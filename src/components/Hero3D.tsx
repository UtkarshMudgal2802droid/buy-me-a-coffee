"use client";

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-[100%] h-[100%] relative min-h-[500px]">
      <Canvas shadows camera={{ position: [0, 2, 10], fov: 50 }}>
        {/* Premium Studio Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Floating Animation Wrapper */}
        <Float 
          speed={2.5} 
          rotationIntensity={0.2} 
          floatIntensity={0.5}
          floatingRange={[-0.1, 0.1]}
        >
          {/* A glowing premium tech ring */}
          <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 2.6, 64]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
          </mesh>

          {/* Core Centerpiece (Abstract Transit Element) */}
          <PresentationControls 
            global 
            snap={true} 
            rotation={[0, 0, 0]} 
            polar={[-Math.PI / 3, Math.PI / 3]} 
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <mesh scale={1.5}>
              <boxGeometry args={[2, 1, 1]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.8} />
            </mesh>
          </PresentationControls>
        </Float>
        
        {/* Soft floor shadow */}
        <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
