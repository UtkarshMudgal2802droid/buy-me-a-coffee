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

function Spaceship({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// 4K Transit Element
export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
