import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { CameraController } from '../../hooks/useCameraFocus';

export const SolarSystemScene = ({ 
  celestialBodies, 
  selectedBody, 
  onBodySelect,
  scrollProgress 
}) => {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 40], fov: 60 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #161b2e 0%, #050811 100%)',
        }}
      >
        {/* Lighting - enhanced for asteroid visibility */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#00f0ff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#ff006e" />

        {/* Camera controller for scroll-based zoom toward selected object */}
        <CameraController 
          selectedBody={selectedBody}
          scrollProgress={scrollProgress}
          celestialBodies={celestialBodies}
        />

        {/* Starfield background */}
        <Stars
          radius={300}
          depth={80}
          count={8000}
          factor={8}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Sun */}
        <Sun />

        {/* Planets */}
        {celestialBodies.map((body) => (
          <Planet
            key={body.id}
            data={body}
            isSelected={selectedBody?.id === body.id}
            onClick={onBodySelect}
          />
        ))}

        {/* Orbit controls - manual camera adjustment (works alongside scroll controls) */}
        <OrbitControls
          enableZoom={false}        // Disable zoom (scroll handles this)
          enablePan={false}         // Disable pan (keep focus on target)
          enableRotate={true}       // Allow rotation for different viewing angles
          rotateSpeed={0.5}         // Slower rotation for precision
          enableDamping={true}      // Smooth rotation
          dampingFactor={0.05}      // Damping intensity
          minDistance={5}
          maxDistance={60}
          maxPolarAngle={Math.PI / 1.8}  // Prevent going below horizon
        />
      </Canvas>
    </div>
  );
};
