import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Ring } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Planet/Asteroid component with selection highlighting
 * 
 * SELECTION FEATURES:
 * 1. Object Highlighting:
 *    - Selected: Brighter, larger, pulsing glow
 *    - Not selected: Dimmed, smaller glow
 * 
 * 2. Orbit Highlighting:
 *    - Selected: Bright cyan, thick line, animated pulse
 *    - Not selected: Faint gray, thin line, static
 * 
 * 3. Visual Indicators:
 *    - Selection ring around selected object
 *    - Enhanced particle trail
 *    - Brighter point light
 *    - Pulsing glow animations
 */
export const Planet = ({ 
  data, 
  isSelected, 
  onClick 
}) => {
  const planetRef = useRef();
  const orbitRef = useRef();
  const glowRef = useRef();
  const selectionRingRef = useRef();
  const orbitLineRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Scale up asteroid size for better visibility (multiply by 4.5 for balanced UI)
  const visualRadius = data.radius * 4.5;

  // Create orbit path
  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * data.orbitRadius,
          0,
          Math.sin(angle) * data.orbitRadius
        )
      );
    }
    return points;
  }, [data.orbitRadius]);

  const orbitGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    return geometry;
  }, [orbitPoints]);

  useFrame((state) => {
    if (orbitRef.current && planetRef.current) {
      // Revolution around sun
      orbitRef.current.rotation.y += data.orbitSpeed;
      
      // Rotation on axis
      planetRef.current.rotation.y += data.rotationSpeed;
      
      // Selected object scale animation (subtle breathing effect)
      if (isSelected) {
        const breatheScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        planetRef.current.scale.set(breatheScale, breatheScale, breatheScale);
      } else {
        // Reset scale for non-selected objects
        planetRef.current.scale.set(1, 1, 1);
      }
    }

    // Pulsing glow effect for selected object
    if (glowRef.current && isSelected) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      const pulseOpacity = 0.4 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
      glowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      glowRef.current.material.opacity = pulseOpacity;
    }

    // Rotating selection ring animation
    if (selectionRingRef.current && isSelected) {
      selectionRingRef.current.rotation.z += 0.02;
      // Pulsing ring scale
      const ringPulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      selectionRingRef.current.scale.set(ringPulse, ringPulse, 1);
    }

    // Animated orbit line for selected object (pulsing opacity)
    if (orbitLineRef.current && isSelected) {
      const orbitPulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      orbitLineRef.current.material.opacity = orbitPulse;
    }
  });

  return (
    <group>
      {/* Orbit path with selection highlighting */}
      <line ref={orbitLineRef} geometry={orbitGeometry}>
        <lineBasicMaterial
          color={isSelected ? '#00f0ff' : (hovered ? '#606870' : '#484f58')}
          opacity={isSelected ? 1 : 0.15}
          transparent
          linewidth={isSelected ? 4 : 1}
        />
      </line>

      {/* Orbit highlight ring - only visible when selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.orbitRadius - 0.1, data.orbitRadius + 0.1, 64]} />
          <meshBasicMaterial 
            color="#00f0ff" 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet orbit group */}
      <group ref={orbitRef} userData={{ objectId: data.id, objectData: data }}>
        <group position={[data.orbitRadius, 0, 0]}>
          {/* Enhanced trail - brighter and longer for selected object */}
          <Trail
            width={isSelected ? 4 : (hovered ? 2 : 1.5)}
            length={isSelected ? 15 : 8}
            color={new THREE.Color(isSelected ? '#00f0ff' : data.color).multiplyScalar(isSelected ? 2 : 1.2)}
            attenuation={(t) => t * t}
          >
            <Sphere
              ref={planetRef}
              args={[visualRadius, 32, 32]}
              onClick={(e) => {
                e.stopPropagation();
                onClick(data);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'default';
              }}
            >
              <meshStandardMaterial
                color={isSelected ? new THREE.Color(data.color).multiplyScalar(1.3) : data.color}
                roughness={isSelected ? 0.3 : 0.6}
                metalness={isSelected ? 0.7 : 0.4}
                emissive={isSelected ? '#00f0ff' : data.color}
                emissiveIntensity={isSelected ? 1.8 : (hovered ? 0.8 : 0.4)}
              />
            </Sphere>
          </Trail>

          {/* Ambient glow - dimmed for non-selected objects */}
          <Sphere args={[visualRadius * 1.4, 16, 16]}>
            <meshBasicMaterial
              color={isSelected ? '#00f0ff' : data.color}
              transparent
              opacity={isSelected ? 0.25 : 0.08}
              side={THREE.BackSide}
            />
          </Sphere>

          {/* Point light - brighter for selected, dim for others */}
          <pointLight 
            position={[0, 0, 0]} 
            color={isSelected ? '#00f0ff' : data.color} 
            intensity={isSelected ? 3 : (hovered ? 1.2 : 0.5)}
            distance={isSelected ? 15 : 8}
          />

          {/* Enhanced selection glow with pulsing animation */}
          {isSelected && (
            <Sphere ref={glowRef} args={[visualRadius * 2.2, 16, 16]}>
              <meshBasicMaterial
                color="#00f0ff"
                transparent
                opacity={0.4}
                side={THREE.BackSide}
              />
            </Sphere>
          )}

          {/* Selection ring indicator - rotates around object */}
          {isSelected && (
            <Ring
              ref={selectionRingRef}
              args={[visualRadius * 1.5, visualRadius * 1.7, 32]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshBasicMaterial
                color="#00f0ff"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </Ring>
          )}

          {/* Hover indicator - subtle ring when hovering */}
          {hovered && !isSelected && (
            <Ring
              args={[visualRadius * 1.3, visualRadius * 1.4, 32]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshBasicMaterial
                color={data.color}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </Ring>
          )}
        </group>
      </group>
    </group>
  );
};
