"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function MouseParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 based on screen center
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Different elements move at different speeds (parallax layers)
  // Deep background layer (moves slowly, opposite direction)
  const layer1X = useTransform(smoothX, [-1, 1], [50, -50]);
  const layer1Y = useTransform(smoothY, [-1, 1], [50, -50]);

  // Middle layer (moves a bit faster)
  const layer2X = useTransform(smoothX, [-1, 1], [100, -100]);
  const layer2Y = useTransform(smoothY, [-1, 1], [100, -100]);

  // Foreground layer (moves fast, same direction for dynamic feel)
  const layer3X = useTransform(smoothX, [-1, 1], [-60, 60]);
  const layer3Y = useTransform(smoothY, [-1, 1], [-60, 60]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* Dynamic Color Shifting Gradient SVG Filters */}
      <svg className="hidden">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Massive soft glowing orbs */}
      <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply opacity-30 animate-blob bg-gradient-to-r from-[#ff2a85] to-[#ffeb3b] blur-3xl"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000 bg-gradient-to-r from-[#00e5ff] to-[#8a2be2] blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000 bg-gradient-to-r from-[#ffeb3b] to-[#00e5ff] blur-3xl"></div>
      </motion.div>

      {/* Layer 2: Geometric Shapes */}
      <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-0 opacity-40">
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full border-[10px] border-[#ff2a85]/40 backdrop-blur-sm animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute top-[60%] right-[15%] w-48 h-48 bg-[#00e5ff]/20 backdrop-blur-md rounded-[3rem] rotate-45 animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute bottom-[25%] left-[30%] w-20 h-20 bg-[#ffeb3b]/40 backdrop-blur-lg rounded-full animate-bounce"></div>
      </motion.div>

      {/* Layer 3: Small dynamic particles */}
      <motion.div style={{ x: layer3X, y: layer3Y }} className="absolute inset-0 opacity-60">
        <div className="absolute top-[30%] right-[30%] w-4 h-4 bg-[#ff2a85] rounded-full shadow-[0_0_20px_#ff2a85] animate-ping"></div>
        <div className="absolute bottom-[40%] left-[20%] w-6 h-6 bg-[#8a2be2] rounded-full shadow-[0_0_30px_#8a2be2] animate-pulse"></div>
        <div className="absolute top-[70%] right-[40%] w-3 h-3 bg-[#00e5ff] rounded-full shadow-[0_0_15px_#00e5ff] animate-ping" style={{ animationDuration: '3s' }}></div>
      </motion.div>
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

    </div>
  );
}
