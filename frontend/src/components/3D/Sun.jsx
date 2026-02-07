import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const Sun = () => {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
    
    // Pulsing glow effect
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Main Sun - Neon Cyan Core */}
      <Sphere ref={sunRef} args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={3}
          color="#00f0ff"
        />
      </Sphere>
      
      {/* Inner glow - Magenta */}
      <Sphere args={[1.4, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ff006e"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer glow - Cyan */}
      <Sphere ref={glowRef} args={[1.7, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Point lights from sun */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={100} color="#00f0ff" />
      <pointLight position={[0, 0, 0]} intensity={1.5} distance={150} color="#ff006e" />
    </group>
  );
};
