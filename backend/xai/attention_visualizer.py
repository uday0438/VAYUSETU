import numpy as np
from typing import List


class AttentionVisualizer:
    """Generates deterministic, spatially-structured attention weight grids
    that mimic real self-attention patterns in climate vision transformers."""

    def generate_attention_weights_grid(self, h: int = 8, w: int = 8) -> List[List[float]]:
        """Return a center-weighted 2D Gaussian attention map (h × w).

        Climate transformer attention empirically concentrates on the
        central region of interest (the cyclone eye, heat-island core, etc.).
        A 2D Gaussian centred on the grid faithfully represents this pattern
        without any stochastic component.

        Parameters
        ----------
        h, w : int
            Grid height and width (default 8 × 8).

        Returns
        -------
        List[List[float]]
            Attention weights scaled to [0, 100] and normalised so the
            grid sums to 100.
        """
        # Row and column indices centred at the grid midpoint
        row = np.linspace(-1.0, 1.0, h)
        col = np.linspace(-1.0, 1.0, w)
        R, C = np.meshgrid(row, col, indexing='ij')

        # Anisotropic Gaussian – slightly wider along the longitude (column)
        # axis, reflecting the elongated spatial receptive field typical in
        # climate attention heads.
        sigma_r, sigma_c = 0.6, 0.75
        weights = np.exp(-0.5 * ((R / sigma_r) ** 2 + (C / sigma_c) ** 2))

        # Normalise so the grid sums to 100 (percentage scale)
        weights = weights / weights.sum() * 100.0

        return weights.tolist()