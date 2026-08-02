"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-bmc-cream">
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23222222' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Main Interactive Orb (Follows Mouse) */}
      <motion.div
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 2 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FFDD00]/20 to-[#FF9000]/20 blur-[100px]"
      />

      {/* Parallax Orb (Reacts to Scroll) */}
      <motion.div
        animate={{
          y: -scrollPosition * 0.5 + 500,
          x: '80vw'
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
        className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[#FF2A85]/10 to-[#FFDD00]/10 blur-[120px]"
      />

      {/* Ambient Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-[#10b981]/5 blur-[150px]"
      />
    </div>
  );
}
