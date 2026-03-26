import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { calculate3DSize, calculate3DDistance } from '../models/scaling';
import { getOrbitSpeed, getRotationSpeed } from '../models/physics';
import { generateCanvasTexture, generateCelGradientMap } from '../models/texture';

// Affiche et anime une planète
export default function Planet({ data }) {
  const distance = calculate3DDistance(data.distance);
  const size = calculate3DSize(data.radius);

  // Convertit l'angle d'inclinaison (degrés vers radians)
  const inclinationRad = data.inclination * (Math.PI / 180);

  // Génération de la texture
  const planetTexture = useMemo(() => generateCanvasTexture(data), [data]);
  
  // Génère l'image du Cel-Shading
  const celGradient = useMemo(() => generateCelGradientMap(), []);

  // Calcule les vitesses angulaires
  const orbitSpeed = getOrbitSpeed(data.sideralOrbit);
  const rotationSpeed = getRotationSpeed(data.sideralRotation);

  // Référence pour cibler le centre de rotation
  const planetPivotRef = useRef();

  // Référence pour la rotation sur elle-même
  const planetMeshRef = useRef();
  
  // Stocke une position de départ aléatoire fixe
  const randomStartAngle = useRef(Math.random() * Math.PI * 2);

  // Échelle de temps (Ex: 1 jours simulés par seconde)
  const timeScale = 1;

  // Boucle d'animation
  useFrame((state, delta) => {
    // Calcule le temps simulé écoulé depuis la dernière image
    const simulatedDays = delta * timeScale;

    // Rotation autour du Soleil
    if (planetPivotRef.current) {
      planetPivotRef.current.rotation.y += orbitSpeed * simulatedDays;
    }

    // Rotation sur elle-même
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += rotationSpeed * simulatedDays;
    }
  });

  return (
    <group rotation-z={inclinationRad}>
      
      {/* Orbite */}
      <mesh rotation-x={-Math.PI / 2}>
        <torusGeometry args={[distance, 0.1, 16, 100]} />
        <meshBasicMaterial color="#445566" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Point central */}
      <group ref={planetPivotRef} rotation-y={randomStartAngle.current}>
        
        {/* Sphère */}
        <mesh ref={planetMeshRef} position={[distance, 0, 0]}>
          <sphereGeometry args={[size, 64, 64]} />
          
          <meshToonMaterial 
            map={planetTexture} // L'image de surface
            gradientMap={celGradient} // L'image du Cel-Shading
          />
        </mesh>

      </group>
    </group>
  );
}