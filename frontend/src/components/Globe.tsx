import React, { useEffect, useRef, useState } from "react";

// India's coordinate shape for a recognizable sub-continent outline
const INDIA_BORDER: [number, number][] = [
  [35.5, 74.8], [37.0, 74.5], [37.0, 75.5], [35.5, 77.0], [34.5, 78.5], 
  [32.5, 78.8], [31.5, 78.8], [30.2, 80.2], [28.8, 80.3], [27.5, 83.0],
  [26.5, 85.0], [27.0, 88.0], [28.0, 88.5], [27.5, 89.0], [27.8, 92.0],
  [29.3, 96.0], [28.0, 97.0], [26.0, 95.0], [24.0, 94.2], [22.0, 93.8],
  [22.8, 92.2], [22.0, 91.8], [24.0, 91.8], [25.0, 90.0], [25.8, 88.2],
  [21.8, 89.0], [21.5, 87.0], [20.2, 86.5], [19.0, 84.8], [17.5, 83.3],
  [16.0, 81.5], [13.0, 80.3], [10.0, 79.8], [9.0, 79.0], [8.0, 77.5], // South tip
  [8.5, 77.0], [10.0, 76.0], [13.0, 74.8], [15.0, 74.0], [19.0, 72.8],
  [21.0, 72.0], [20.5, 70.0], [22.0, 68.5], [23.5, 68.0], [24.5, 71.0],
  [25.5, 71.0], [27.0, 70.0], [29.0, 71.5], [31.0, 74.0], [32.5, 74.2],
  [34.0, 74.0], [35.5, 74.8]
];

interface DistrictNode {
  name: string;
  coords: [number, number];
  color: string;
  risk: number;
}

interface GlobeProps {
  selectedDistrict: string;
  onSelectDistrict: (name: string) => void;
  isDarkMode: boolean;
  districtsList: DistrictNode[];
}

export default function Globe({ selectedDistrict, onSelectDistrict, isDarkMode, districtsList }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Rotation refs (centered on India: lon 78E, lat 22N)
  const lonCenterRef = useRef(78);
  const latCenterRef = useRef(22);
  
  // Interactive drag states
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLon = useRef(0);

  // Auto-rotation variable
  const autoRotate = useRef(true);

  // Handle Drag / Pan interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    autoRotate.current = false;
    startX.current = e.clientX;
    startLon.current = lonCenterRef.current;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    // Map screen offset to longitude rotation angle
    const newLon = startLon.current - dx * 0.4;
    lonCenterRef.current = ((newLon + 180) % 360) - 180;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    // Resume auto-rotation after 5 seconds of inactivity
    setTimeout(() => {
      if (!isDragging.current) autoRotate.current = true;
    }, 5000);
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Auto-rotation step
      if (autoRotate.current) {
        lonCenterRef.current = (lonCenterRef.current + 0.08) % 360;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.42; // Sphere radius

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Pitch angle (latitude tilt) in radians
      const pitch = (latCenterRef.current * Math.PI) / 180;
      // Yaw angle (longitude center) in radians
      const yaw = (lonCenterRef.current * Math.PI) / 180;

      // 3D Orthographic Projection Helper
      const project = (lat: number, lon: number): { x: number; y: number; z: number; visible: boolean } => {
        const theta = (lat * Math.PI) / 180;
        const phi = (lon * Math.PI) / 180;

        // Unpitched sphere coordinates (Z pointing out of screen)
        const x0 = Math.cos(theta) * Math.sin(phi - yaw);
        const y0 = Math.sin(theta);
        const z0 = Math.cos(theta) * Math.cos(phi - yaw);

        // Pitched coordinates (rotate around X-axis by pitch angle)
        const x = x0;
        const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
        const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);

        return {
          x: cx + x * R,
          y: cy - y * R,
          z: z,
          visible: z > 0 // Front face of the sphere
        };
      };

      // 1. Draw Globe Base Atmosphere & Shadow Glow
      const glowGrad = ctx.createRadialGradient(cx - R/5, cy - R/5, R*0.6, cx, cy, R);
      if (isDarkMode) {
        glowGrad.addColorStop(0, "#08112d");
        glowGrad.addColorStop(0.7, "#030712");
        glowGrad.addColorStop(1, "#121b3a");
      } else {
        glowGrad.addColorStop(0, "#e0e7ff");
        glowGrad.addColorStop(0.7, "#f1f5f9");
        glowGrad.addColorStop(1, "#c7d2fe");
      }

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Outer atmosphere halo ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.strokeStyle = isDarkMode ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // 2. Draw Latitude and Longitude Grid Lines (Graticules)
      ctx.strokeStyle = isDarkMode ? "rgba(148, 163, 184, 0.05)" : "rgba(71, 85, 105, 0.07)";
      ctx.lineWidth = 1;

      // Latitude circles
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = 0; lon < 360; lon += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -85; lat <= 85; lat += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 3. Draw India Subcontinent Outline
      ctx.beginPath();
      let borderStarted = false;
      INDIA_BORDER.forEach(([lat, lon]) => {
        const pt = project(lat, lon);
        if (pt.visible) {
          if (!borderStarted) {
            ctx.moveTo(pt.x, pt.y);
            borderStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          borderStarted = false; // Break path when wrapping behind the globe
        }
      });
      ctx.closePath();
      ctx.strokeStyle = isDarkMode ? "rgba(99, 102, 241, 0.7)" : "rgba(79, 70, 229, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = isDarkMode ? "rgba(99, 102, 241, 0.06)" : "rgba(79, 70, 229, 0.06)";
      ctx.fill();

      // 4. Draw Interactive Regional Hotspot Pins
      districtsList.forEach((d) => {
        const pt = project(d.coords[0], d.coords[1]);
        if (!pt.visible) return;

        const isSelected = d.name === selectedDistrict;
        const radius = isSelected ? 8 : 4.5;

        // Pulse effect for selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius + Math.sin(Date.now() * 0.008) * 4 + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = `${d.color}35`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw pin dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = d.color;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = isSelected ? 12 : 4;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * 0.4, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Node Label
        ctx.fillStyle = isSelected
          ? (isDarkMode ? "#ffffff" : "#1e1b4b")
          : (isDarkMode ? "rgba(255, 255, 255, 0.45)" : "rgba(30, 41, 59, 0.85)");
        ctx.font = isSelected ? "bold 9px monospace" : "8px monospace";
        ctx.fillText(`📍 ${d.name}`, pt.x + 8, pt.y + 3);
      });

      // 5. Draw Compass / Scale indicators
      ctx.fillStyle = isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.65)";
      ctx.font = "8px monospace";
      ctx.fillText(`3D DIGITAL TWIN SCOPE: INDIA GRID`, 15, 25);
      ctx.fillText(`NAV-C REFERENCED: PITCH=${latCenterRef.current}° YAW=${Math.round(lonCenterRef.current)}°`, 15, 37);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode, districtsList, selectedDistrict]);

  // Handle click on canvas hotspots
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.42;

    const pitch = (latCenterRef.current * Math.PI) / 180;
    const yaw = (lonCenterRef.current * Math.PI) / 180;

    // Project and check closest node
    let closestNode = "";
    let minDistance = 15; // Click threshold distance in pixels

    districtsList.forEach((d) => {
      const theta = (d.coords[0] * Math.PI) / 180;
      const phi = (d.coords[1] * Math.PI) / 180;

      const x0 = Math.cos(theta) * Math.sin(phi - yaw);
      const y0 = Math.sin(theta);
      const z0 = Math.cos(theta) * Math.cos(phi - yaw);

      const x = x0;
      const y = y0 * Math.cos(pitch) - z0 * Math.sin(pitch);
      const z = y0 * Math.sin(pitch) + z0 * Math.cos(pitch);

      if (z > 0) {
        const px = cx + x * R;
        const py = cy - y * R;

        const dist = Math.hypot(clickX - px, clickY - py);
        if (dist < minDistance) {
          minDistance = dist;
          closestNode = d.name;
        }
      }
    });

    if (closestNode) {
      onSelectDistrict(closestNode);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-slate-950/20 backdrop-blur-[2px]">
      <canvas
        ref={canvasRef}
        width={500}
        height={450}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClick={handleCanvasClick}
        className="cursor-grab active:cursor-grabbing max-w-full max-h-full"
      />
      
      {/* Dynamic Rotation Controls Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 flex items-center gap-3">
        <button 
          onClick={() => { lonCenterRef.current = 78; }} 
          className="text-indigo-400 hover:text-indigo-300 font-bold"
          type="button"
        >
          🎯 Center India
        </button>
        <span>|</span>
        <button 
          onClick={() => { autoRotate.current = !autoRotate.current; }}
          className="text-slate-300 hover:text-white"
          type="button"
        >
          🔄 Rotate
        </button>
      </div>
    </div>
  );
}
