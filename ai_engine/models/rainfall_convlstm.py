import torch
import torch.nn as nn

class ChannelAttention(nn.Module):
    def __init__(self, in_planes, ratio=16):
        super(ChannelAttention, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)
           
        reduced_planes = max(1, in_planes // ratio)
        self.fc = nn.Sequential(
            nn.Conv2d(in_planes, reduced_planes, 1, bias=False),
            nn.ReLU(),
            nn.Conv2d(reduced_planes, in_planes, 1, bias=False)
        )
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = self.fc(self.avg_pool(x))
        max_out = self.fc(self.max_pool(x))
        out = avg_out + max_out
        return self.sigmoid(out)

class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=7):
        super(SpatialAttention, self).__init__()
        assert kernel_size in (3, 7), 'kernel size must be 3 or 7'
        padding = 3 if kernel_size == 7 else 1
        self.conv1 = nn.Conv2d(2, 1, kernel_size, padding=padding, bias=False)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        concat = torch.cat([avg_out, max_out], dim=1)
        out = self.conv1(concat)
        return self.sigmoid(out)

class CBAM(nn.Module):
    def __init__(self, in_planes, ratio=16, kernel_size=7):
        super(CBAM, self).__init__()
        self.ca = ChannelAttention(in_planes, ratio)
        self.sa = SpatialAttention(kernel_size)

    def forward(self, x):
        out = x * self.ca(x)
        out = out * self.sa(out)
        return out

class ConvLSTMCell(nn.Module):
    def __init__(self, input_dim, hidden_dim, kernel_size, bias):
        """
        Initialize Convolutional LSTM Cell.
        Fuses 2D Convolutions with LSTM gates to capture spatiotemporal grid dependencies.
        Integrates CBAM (Channel & Spatial Attention) to focus on coastal precipitation cells.
        """
        super(ConvLSTMCell, self).__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.kernel_size = kernel_size
        self.padding = kernel_size // 2
        self.bias = bias

        # CBAM block applied on the concatenated inputs and hidden states
        self.cbam = CBAM(in_planes=self.input_dim + self.hidden_dim)

        # Fusing all gates (input, forget, cell, output) into a single 2D Convolution layer
        self.conv = nn.Conv2d(
            in_channels=self.input_dim + self.hidden_dim,
            out_channels=4 * self.hidden_dim,
            kernel_size=self.kernel_size,
            padding=self.padding,
            bias=self.bias
        )

    def forward(self, input_tensor, cur_state):
        h_cur, c_cur = cur_state

        # Concatenate input and hidden state along channel dimension
        combined = torch.cat([input_tensor, h_cur], dim=1)
        
        # Apply CBAM attention gating
        combined_gated = self.cbam(combined)
        
        # Convolve combined input
        combined_conv = self.conv(combined_gated)
        
        # Split into gates
        cc_i, cc_f, cc_o, cc_g = torch.split(combined_conv, self.hidden_dim, dim=1)
        
        # Gate activations
        i = torch.sigmoid(cc_i)
        f = torch.sigmoid(cc_f)
        o = torch.sigmoid(cc_o)
        g = torch.tanh(cc_g)

        # Calculate next cell state and hidden state
        c_next = f * c_cur + i * g
        h_next = o * torch.tanh(c_next)

        return h_next, c_next

    def init_hidden(self, batch_size, image_size):
        height, width = image_size
        return (
            torch.zeros(batch_size, self.hidden_dim, height, width, device=self.conv.weight.device),
            torch.zeros(batch_size, self.hidden_dim, height, width, device=self.conv.weight.device)
        )


class ConvLSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, kernel_size, num_layers, bias=True):
        """
        Spatio-Temporal ConvLSTM Network for Rainfall Precipitation Grid Forecasting.
        Ingests multi-temporal satellite rasters and predicts future weather states.
        """
        super(ConvLSTM, self).__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.kernel_size = kernel_size
        self.num_layers = num_layers
        self.bias = bias

        cell_list = []
        for i in range(0, self.num_layers):
            cur_input_dim = self.input_dim if i == 0 else self.hidden_dim[i - 1]
            cell_list.append(
                ConvLSTMCell(
                    input_dim=cur_input_dim,
                    hidden_dim=self.hidden_dim[i],
                    kernel_size=self.kernel_size,
                    bias=self.bias
                )
            )

        self.cell_list = nn.ModuleList(cell_list)

    def forward(self, x, hidden_state=None):
        """
        Forward pass.
        x: [Batch, Sequence_Length, Channels, Height, Width]
        """
        b, seq_len, _, h, w = x.size()

        if hidden_state is None:
            hidden_state = self._init_hidden(b, (h, w), x.device)

        layer_output_list = []
        last_state_list = []

        cur_layer_input = x

        for layer_idx in range(self.num_layers):
            h_state, c_state = hidden_state[layer_idx]
            output_inner = []
            
            for t in range(seq_len):
                h_state, c_state = self.cell_list[layer_idx](
                    input_tensor=cur_layer_input[:, t, :, :, :],
                    cur_state=(h_state, c_state)
                )
                output_inner.append(h_state)

            layer_output = torch.stack(output_inner, dim=1)
            cur_layer_input = layer_output

            layer_output_list.append(layer_output)
            last_state_list.append((h_state, c_state))

        # We return the output of the final layer and the hidden states
        return layer_output_list[-1], last_state_list

    def _init_hidden(self, batch_size, image_size, device):
        init_states = []
        for i in range(self.num_layers):
            init_states.append(self.cell_list[i].init_hidden(batch_size, image_size))
        # Move states to correct device
        return [(h.to(device), c.to(device)) for h, c in init_states]


class PhysicsInformedLoss(nn.Module):
    def __init__(self, lambda_physics=0.1):
        super(PhysicsInformedLoss, self).__init__()
        self.lambda_physics = lambda_physics
        self.mse = nn.MSELoss()

    def forward(self, pred_rainfall, target_rainfall, soil_moisture_t, soil_moisture_t1, evaporation, runoff):
        """
        Calculates MSE loss with physics-informed conservation of water mass penalty.
        pred_rainfall, target_rainfall: tensors (e.g. predictions and targets)
        soil_moisture_t: Soil moisture at time t (current)
        soil_moisture_t1: Soil moisture at time t-1 (previous)
        evaporation: Evaporation at time t
        runoff: Runoff at time t
        """
        base_loss = self.mse(pred_rainfall, target_rainfall)
        
        # Physics violation penalty: SM_t <= SM_{t-1} + Rainfall_t - Evap_t - Runoff_t
        # So violation if SM_t > SM_{t-1} + Rainfall_t - Evap_t - Runoff_t
        # Which is equivalent to: SM_t - (SM_{t-1} + Rainfall_t - Evap_t - Runoff_t) > 0
        violation = soil_moisture_t - (soil_moisture_t1 + pred_rainfall - evaporation - runoff)
        physics_penalty = torch.mean(torch.clamp(violation, min=0.0))
        
        return base_loss + self.lambda_physics * physics_penalty
