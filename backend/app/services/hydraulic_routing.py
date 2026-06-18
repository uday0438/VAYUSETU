import numpy as np
from typing import Tuple

class SaintVenantSolver2D:
    def __init__(self, nx: int = 16, ny: int = 16, dx: float = 100.0, dy: float = 100.0, dt: float = 0.05, g: float = 9.81):
        """
        2D shallow water Saint-Venant hydraulic flood routing solver.
        Solves the conservation of mass and momentum over a discrete grid.
        """
        self.nx = nx
        self.ny = ny
        self.dx = dx
        self.dy = dy
        self.dt = dt
        self.g = g

    def solve(self, elevation: np.ndarray, runoff: np.ndarray, friction_coeff: float = 0.03, steps: int = 20) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Solves 2D shallow water equations.
        elevation: numpy array [nx, ny] - topographic elevation (meters)
        runoff: numpy array [nx, ny] - rain runoff input (source term) in m/s
        friction_coeff: Manning's n or basic friction coefficient
        returns: (h, u, v) - water depth grid (m), x-velocity grid (m/s), y-velocity grid (m/s)
        """
        # Initial conditions: small initial water depth
        h = np.ones((self.nx, self.ny)) * 0.01  # depth (m)
        u = np.zeros((self.nx, self.ny))       # x-velocity (m/s)
        v = np.zeros((self.nx, self.ny))       # y-velocity (m/s)

        # Ensure float operations
        z = elevation.astype(float)
        R = runoff.astype(float)

        for _ in range(steps):
            h_new = np.copy(h)
            u_new = np.copy(u)
            v_new = np.copy(v)

            # Mass and momentum conservation updates (finite difference on interior cells)
            for i in range(1, self.nx - 1):
                for j in range(1, self.ny - 1):
                    # Spatial derivatives for conservation of mass
                    dh_dx = (h[i+1, j] * u[i+1, j] - h[i-1, j] * u[i-1, j]) / (2 * self.dx)
                    dh_dy = (h[i, j+1] * v[i, j+1] - h[i, j-1] * v[i, j-1]) / (2 * self.dy)
                    
                    # Update depth: dh/dt = R - dh_dx - dh_dy
                    h_new[i, j] = max(0.0, h[i, j] + self.dt * (R[i, j] - dh_dx - dh_dy))

                    # Topographic slopes
                    dz_dx = (z[i+1, j] - z[i-1, j]) / (2 * self.dx)
                    dz_dy = (z[i, j+1] - z[i, j-1]) / (2 * self.dy)

                    # Friction drag
                    vel_mag = np.sqrt(u[i, j]**2 + v[i, j]**2)
                    drag_x = friction_coeff * u[i, j] * vel_mag / max(0.001, h[i, j])
                    drag_y = friction_coeff * v[i, j] * vel_mag / max(0.001, h[i, j])

                    # Gravity acceleration / momentum terms
                    if h[i, j] > 0.01:
                        # Simple momentum approximation
                        du_dt = - self.g * dz_dx - drag_x
                        dv_dt = - self.g * dz_dy - drag_y

                        u_new[i, j] = u[i, j] + self.dt * du_dt
                        v_new[i, j] = v[i, j] + self.dt * dv_dt
                    else:
                        u_new[i, j] = 0.0
                        v_new[i, j] = 0.0

            # Apply boundary conditions (zero gradient / reflection)
            h = np.clip(h_new, 0.0, 10.0)
            u = np.clip(u_new, -5.0, 5.0)
            v = np.clip(v_new, -5.0, 5.0)

        return h, u, v
