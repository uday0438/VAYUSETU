import numpy as np
from typing import List

class AttentionVisualizer:
    def generate_attention_weights_grid(self, h: int = 8, w: int = 8) -> List[List[float]]:
        # Simulated spatial self-attention map weights
        weights = np.random.dirichlet(np.ones(h*w), size=1).reshape(h, w)
        return (weights * 100.0).tolist()