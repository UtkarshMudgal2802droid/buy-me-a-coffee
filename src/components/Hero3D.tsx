"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function GlassTorus({ position, scale, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <meshPhysicalMaterial 
          color={color}
          transmission={1}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={2}
          specularIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function MetallicIcosahedron({ position, scale, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, scale, color }: any) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={2} position={position}>
      <mesh scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial 
          color={color}
          transmission={0.9}
          opacity={1}
          metalness={0.2}
          roughness={0.05}
          ior={1.2}
          thickness={1}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Environment preset="city" />

        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          {/* Top Left - Yellow Glass Donut */}
          <GlassTorus position={[-6, 3, -4]} scale={1.2} color="#FFDD00" />
          
          {/* Bottom Right - Dark Metallic Icosahedron */}
          <MetallicIcosahedron position={[6, -3, -5]} scale={1.5} color="#222222" />
          
          {/* Top Right - Coral Pink Donut */}
          <GlassTorus position={[5, 4, -6]} scale={0.8} color="#FF2A85" />
          
          {/* Bottom Left - Emerald Glass Icosahedron */}
          <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5} position={[-5, -4, -6]}>
            <mesh scale={2}>
              <icosahedronGeometry args={[1, 1]} />
              <meshPhysicalMaterial 
                color="#10b981"
                transmission={0.4}
                opacity={0.9}
                transparent={true}
                metalness={0.2}
                roughness={0.1}
                ior={1.5}
                thickness={3}
                clearcoat={1}
              />
            </mesh>
          </Float>
        </PresentationControls>

        {/* Soft floor shadow */}
        <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={20} blur={2} far={5} />
      </Canvas>
    </div>
  );
}
