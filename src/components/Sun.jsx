import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSunColors, getSunPatternSettings } from '../models/color';
import { SunMaterial } from './SunMaterial';

// Déclare notre matériau solaire personnalisé
extend({ SunMaterial });

// Modélise le Soleil
export default function Sun() {
  const { color1, color2 } = getSunColors();
  const patternScale = getSunPatternSettings();

  // Référence pour mettre à jour le temps du shader
  const materialRef = useRef();

  // Boucle d'animation
  useFrame((state, delta) => {
    if (materialRef.current) {
      // Met à jour la variable uTime avec le temps écoulé de l'app
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* La boule de plasma animée */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3, 64, 64]} />
        <sunMaterial 
          ref={materialRef}
          uColor1={color1} 
          uColor2={color2}
          uPatternScale={patternScale}
        />
      </mesh>

      {/* Le Halo lumineux */}
      <mesh position={[0, 0, 0]} scale={1.2}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent={true} 
          opacity={0.15} 
          // L'AdditiveBlending permet à la couleur d'illuminer ce qui est derrière
          blending={THREE.AdditiveBlending} 
          // depthWrite=false empêche l'orbite de Mercure d'être masquée par le halo
          depthWrite={false} 
        />
      </mesh>
    </group>
  );
}