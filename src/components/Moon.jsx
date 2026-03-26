import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculate3DSize, calculateMoonDistance } from '../models/scaling';
import { getOrbitSpeed, getRotationSpeed } from '../models/physics';

// Affiche et anime une lune
export default function Moon({ data, planetSize }) {
  const size = calculate3DSize(data.radius);
  const distance = calculateMoonDistance(data.distance, planetSize);

  // Convertit l'angle d'inclinaison (degrés vers radians)
  const inclinationRad = data.inclination * (Math.PI / 180);

  // Vitesses
  const orbitSpeed = getOrbitSpeed(data.sideralOrbit || 27);
  const rotationSpeed = getRotationSpeed(data.sideralRotation || 27);

  // Références 3D
  const moonPivotRef = useRef();
  const moonMeshRef = useRef();
  const randomStartAngle = useRef(Math.random() * Math.PI * 2);

  // Boucle d'animation
  useFrame((state, delta) => {
    const timeScale = 1; 
    const simulatedDays = delta * timeScale;

    if (moonPivotRef.current) moonPivotRef.current.rotation.y += orbitSpeed * simulatedDays;
    if (moonMeshRef.current) moonMeshRef.current.rotation.y += rotationSpeed * simulatedDays;
  });

  return (
    <group rotation-z={inclinationRad}>
      
      {/* Orbite de la lune*/}
      <mesh rotation-x={-Math.PI / 2}>
        <torusGeometry args={[distance, 0.002, 8, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Point central */}
      <group ref={moonPivotRef} rotation-y={randomStartAngle.current}>
        
        {/* Sphère */}
        <mesh ref={moonMeshRef} position={[distance, 0, 0]}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshToonMaterial color="#aaaaaa" />
        </mesh>

      </group>
    </group>
  );
}