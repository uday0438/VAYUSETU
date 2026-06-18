import torch
import torch.nn as nn
from ai_engine.models.rainfall_convlstm import ConvLSTM

class DoubleConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(DoubleConv, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.conv(x)

class UNetConvLSTM(nn.Module):
    def __init__(self, in_channels, out_channels, hidden_dim=64):
        """
        U-Net + ConvLSTM hybrid model for high-resolution climate forecasting.
        Encoder extracts multiscale spatial features.
        Bottleneck ConvLSTM captures temporal transport/dynamics.
        Decoder upsamples features with skip connections to restore fine details.
        """
        super(UNetConvLSTM, self).__init__()
        
        # Encoder
        self.inc = DoubleConv(in_channels, hidden_dim)
        self.down1 = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(hidden_dim, hidden_dim * 2)
        )
        self.down2 = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(hidden_dim * 2, hidden_dim * 4)
        )
        
        # Bottleneck ConvLSTM: handles sequential spatial feature map progression
        # Input to bottleneck ConvLSTM: hidden_dim * 4 channels
        # Out from bottleneck ConvLSTM: hidden_dim * 4 channels
        self.bottleneck_lstm = ConvLSTM(
            input_dim=hidden_dim * 4,
            hidden_dim=[hidden_dim * 4],
            kernel_size=3,
            num_layers=1,
            bias=True
        )
        
        # Decoder
        self.up1 = nn.ConvTranspose2d(hidden_dim * 4, hidden_dim * 2, kernel_size=2, stride=2)
        # Skip connection from down1: hidden_dim * 2 channels, total input to doubleconv = hidden_dim * 4 channels
        self.conv_up1 = DoubleConv(hidden_dim * 4, hidden_dim * 2)
        
        self.up2 = nn.ConvTranspose2d(hidden_dim * 2, hidden_dim, kernel_size=2, stride=2)
        # Skip connection from inc: hidden_dim channels, total input to doubleconv = hidden_dim * 2 channels
        self.conv_up2 = DoubleConv(hidden_dim * 2, hidden_dim)
        
        self.outc = nn.Conv2d(hidden_dim, out_channels, kernel_size=1)

    def forward(self, x):
        """
        x shape: [Batch, SeqLen, Channels, Height, Width]
        """
        b, seq_len, c, h, w = x.size()
        
        # Lists to store intermediate encoder outputs for skip connections across sequence steps
        enc1_list = []
        enc2_list = []
        bottleneck_in_list = []
        
        for t in range(seq_len):
            x_t = x[:, t, :, :, :]
            enc1 = self.inc(x_t)
            enc2 = self.down1(enc1)
            bottleneck_in = self.down2(enc2)
            
            enc1_list.append(enc1)
            enc2_list.append(enc2)
            bottleneck_in_list.append(bottleneck_in)
            
        # Stack bottleneck inputs: [Batch, SeqLen, hidden_dim * 4, H/4, W/4]
        bottleneck_in_seq = torch.stack(bottleneck_in_list, dim=1)
        
        # Pass through ConvLSTM
        lstm_out, _ = self.bottleneck_lstm(bottleneck_in_seq)
        
        # Decoder pass for each sequence step
        outputs = []
        for t in range(seq_len):
            lstm_t = lstm_out[:, t, :, :, :]
            enc2_t = enc2_list[t]
            enc1_t = enc1_list[t]
            
            # Upsample bottleneck representation
            dec2 = self.up1(lstm_t)
            # Concat skip connection
            dec2_concat = torch.cat([dec2, enc2_t], dim=1)
            dec2_conv = self.conv_up1(dec2_concat)
            
            # Upsample next layer
            dec1 = self.up2(dec2_conv)
            dec1_concat = torch.cat([dec1, enc1_t], dim=1)
            dec1_conv = self.conv_up2(dec1_concat)
            
            out_t = self.outc(dec1_conv)
            outputs.append(out_t)
            
        # Stack output: [Batch, SeqLen, out_channels, Height, Width]
        return torch.stack(outputs, dim=1)
