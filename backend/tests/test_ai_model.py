import unittest
import torch
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ai_engine.models.rainfall_convlstm import ConvLSTM, ConvLSTMCell

class TestConvLSTM(unittest.TestCase):
    def test_convlstm_forward(self):
        """Test ConvLSTM layer initialization and output dimensions."""
        batch_size = 2
        seq_len = 3
        channels = 1
        height, width = 16, 16
        hidden_dims = [8, 4]
        
        # Ingest tensor: [Batch, Seq, Channels, Height, Width]
        input_tensor = torch.randn(batch_size, seq_len, channels, height, width)
        
        # Initialize 2-layer ConvLSTM
        model = ConvLSTM(
            input_dim=channels,
            hidden_dim=hidden_dims,
            kernel_size=3,
            num_layers=2,
            bias=True
        )
        
        # Forward pass
        output, hidden = model(input_tensor)
        
        # Check output shapes
        # Final layer output channel should equal the last hidden dimension (4)
        self.assertEqual(output.shape, (batch_size, seq_len, hidden_dims[-1], height, width))
        
        # Check hidden states list length (should equal num_layers)
        self.assertEqual(len(hidden), 2)
        # Check hidden and cell states shape for layer 0
        h_0, c_0 = hidden[0]
        self.assertEqual(h_0.shape, (batch_size, hidden_dims[0], height, width))
        self.assertEqual(c_0.shape, (batch_size, hidden_dims[0], height, width))

if __name__ == "__main__":
    unittest.main()
