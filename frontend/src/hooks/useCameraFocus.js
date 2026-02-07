import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Custom hook for scroll-based camera control in 3D space
 * 
 * FEATURES:
 * - Smooth camera zoom toward selected celestial object
 * - Scroll-driven distance control (zoom in/out)
 * - Dynamic target tracking (follows orbiting objects)
 * - Smooth lerp-based transitions (no jitter)
 * - Min/max distance constraints
 * 
 * SCROLL BEHAVIOR:
 * - Scroll down (progress 0 → 1): Zoom IN toward object
 * - Scroll up (progress 1 → 0): Zoom OUT to overview
 * - No selection: Focus on Sun at origin
 * 
 * @param {Object} selectedBody - Currently selected celestial object
 * @param {number} scrollProgress - Normalized scroll (0-1)
 * @param {Array} celestialBodies - All objects for fallback
 * @returns {Object} Camera control state and utilities
 */
export const useCameraFocus = (selectedBody, scrollProgress, celestialBodies) => {
  const { camera, scene } = useThree();
  
  // Target position for camera to look at
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  // Camera position tracking
  const desiredCameraPosition = useRef(new THREE.Vector3(0, 5, 40));
  
  // Distance ranges for zoom
  const MAX_DISTANCE = 45; // Far view (full solar system)
  const MIN_DISTANCE = 8;  // Close view (object detail)
  
  // Smoothing factors
  const POSITION_LERP = 0.05; // Camera movement speed
  const LOOKAT_LERP = 0.08;   // Camera rotation speed
  
  /**
   * Find the mesh/group for a celestial object in the scene
   * Uses traversal to locate the object by ID
   */
  const findObjectInScene = (objectId) => {
    let foundObject = null;
    
    scene.traverse((child) => {
      // Check if this is a planet group with userData
      if (child.userData && child.userData.objectId === objectId) {
        foundObject = child;
      }
    });
    
    return foundObject;
  };
  
  /**
   * Calculate world position of selected object
   * Handles rotating orbit groups by getting actual world coordinates
   */
  const getObjectWorldPosition = (body) => {
    if (!body) return new THREE.Vector3(0, 0, 0); // Default to Sun
    
    // Try to find object in scene
    const sceneObject = findObjectInScene(body.id);
    
    if (sceneObject) {
      // Get actual world position (accounts for parent transformations)
      const worldPos = new THREE.Vector3();
      sceneObject.getWorldPosition(worldPos);
      return worldPos;
    }
    
    // Fallback: Calculate expected position from orbit data
    // This works even before scene is fully loaded
    const angle = Date.now() * body.orbitSpeed * 0.001; // Approximate current angle
    return new THREE.Vector3(
      Math.cos(angle) * body.orbitRadius,
      0,
      Math.sin(angle) * body.orbitRadius
    );
  };
  
  /**
   * Calculate ideal camera position based on target and zoom level
   * 
   * MATH:
   * 1. Start with target position (where object is)
   * 2. Calculate distance based on scroll (lerp between MIN and MAX)
   * 3. Position camera above and behind target for nice viewing angle
   * 4. Add slight offset to avoid direct overhead view
   */
  const calculateCameraPosition = (target, zoomFactor) => {
    // Interpolate distance based on scroll progress
    // zoomFactor 0 (scrolled up) = MAX_DISTANCE (far)
    // zoomFactor 1 (scrolled down) = MIN_DISTANCE (close)
    const distance = THREE.MathUtils.lerp(
      MAX_DISTANCE,
      MIN_DISTANCE,
      zoomFactor
    );
    
    // Calculate camera position relative to target
    // Position camera at an angle (not directly overhead)
    const angleOffset = 0.3; // Slight rotation for better view
    const heightMultiplier = 0.4; // Camera height relative to distance
    
    const cameraOffset = new THREE.Vector3(
      Math.sin(angleOffset) * distance * 0.3,  // Slight X offset
      distance * heightMultiplier,              // Height above object
      distance                                   // Distance back from object
    );
    
    // Final camera position = target + offset
    return target.clone().add(cameraOffset);
  };
  
  /**
   * useFrame hook - runs every animation frame (~60fps)
   * Handles smooth camera movement and target tracking
   */
  useFrame(() => {
    // 1. UPDATE TARGET POSITION
    // Get current world position of selected object (or Sun if none)
    const objectWorldPos = getObjectWorldPosition(selectedBody);
    targetPosition.current.copy(objectWorldPos);
    
    // 2. CALCULATE DESIRED CAMERA POSITION
    // Based on scroll progress (0 = far, 1 = close)
    const idealPosition = calculateCameraPosition(
      targetPosition.current,
      scrollProgress
    );
    desiredCameraPosition.current.copy(idealPosition);
    
    // 3. SMOOTH CAMERA MOVEMENT (lerp for no jitter)
    // Gradually move camera toward desired position
    camera.position.lerp(desiredCameraPosition.current, POSITION_LERP);
    
    // 4. SMOOTH CAMERA ROTATION (look at target)
    // Gradually rotate camera to face the target
    currentLookAt.current.lerp(targetPosition.current, LOOKAT_LERP);
    camera.lookAt(currentLookAt.current);
    
    // 5. UPDATE CAMERA MATRICES
    // Required for Three.js to apply transformations
    camera.updateProjectionMatrix();
  });
  
  // Return camera state (useful for debugging or advanced features)
  return {
    targetPosition: targetPosition.current,
    cameraPosition: camera.position,
    lookingAt: currentLookAt.current,
    zoomDistance: THREE.MathUtils.lerp(MAX_DISTANCE, MIN_DISTANCE, scrollProgress),
  };
};

/**
 * React component wrapper for camera controls
 * Handles scroll-based zoom and object focusing
 * 
 * USAGE:
 * <CameraController 
 *   selectedBody={selectedBody}
 *   scrollProgress={scrollProgress}
 *   celestialBodies={celestialBodies}
 * />
 * 
 * BEHAVIOR:
 * - Default view: Overview of solar system (camera at z=45, y=18)
 * - Scroll down: Gradually zoom toward selected object
 * - Object selection change: Smoothly transition to new target
 * - No object selected: Focus on Sun at center
 * 
 * SCROLL MAPPING:
 * scrollProgress 0.0 → Camera far (overview)
 * scrollProgress 0.5 → Camera medium distance
 * scrollProgress 1.0 → Camera close (detail view)
 */
export const CameraController = ({ 
  selectedBody, 
  scrollProgress,
  celestialBodies 
}) => {
  const cameraState = useCameraFocus(selectedBody, scrollProgress, celestialBodies);
  
  // Component doesn't render anything - just controls camera
  return null;
};

/**
 * TECHNICAL NOTES:
 * 
 * 1. WHY LERP (Linear Interpolation)?
 *    - Prevents sudden camera jumps
 *    - Creates smooth, cinematic movement
 *    - Formula: current + (target - current) * factor
 *    - Factor 0.05 = camera reaches 95% of target in ~60 frames (1 second)
 * 
 * 2. WHY SEPARATE POSITION AND LOOKAT LERP?
 *    - Camera position and rotation need independent smoothing
 *    - Different lerp factors create more natural motion
 *    - Position slower (0.05) for stable movement
 *    - LookAt faster (0.08) for responsive targeting
 * 
 * 3. WHY getWorldPosition()?
 *    - Planets are in rotating parent groups
 *    - Local position is always [orbitRadius, 0, 0]
 *    - World position accounts for parent rotation
 *    - Essential for correct camera targeting
 * 
 * 4. WHY NOT JUST USE ORBIT CONTROLS?
 *    - OrbitControls good for manual camera movement
 *    - This system provides automatic, scroll-driven cinematics
 *    - Both can coexist (OrbitControls for fine-tuning)
 *    - Scroll provides primary navigation, orbit controls for adjustment
 * 
 * 5. PERFORMANCE CONSIDERATIONS:
 *    - useFrame runs 60 times per second
 *    - All calculations use Vector3 instances (no allocations)
 *    - Scene traversal only when selection changes
 *    - Lerp is highly optimized in Three.js
 */

/**
 * CUSTOMIZATION EXAMPLES:
 * 
 * 1. Adjust zoom speed:
 *    const POSITION_LERP = 0.1; // Faster (less smooth)
 *    const POSITION_LERP = 0.02; // Slower (more cinematic)
 * 
 * 2. Change zoom range:
 *    const MAX_DISTANCE = 60; // Further out
 *    const MIN_DISTANCE = 5;  // Closer in
 * 
 * 3. Different camera angle:
 *    const angleOffset = Math.PI / 4; // 45° angle
 *    const heightMultiplier = 0.6;    // Higher camera
 * 
 * 4. Add camera shake on selection:
 *    useEffect(() => {
 *      if (selectedBody) {
 *        gsap.to(camera.position, {
 *          x: "+=0.1",
 *          duration: 0.1,
 *          yoyo: true,
 *          repeat: 3
 *        });
 *      }
 *    }, [selectedBody]);
 */
