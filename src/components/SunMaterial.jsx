import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Crée un matériau solaire personnalisé
export const SunMaterial = shaderMaterial(
  {
    uColor1: new THREE.Color('#ffffff'),
    uColor2: new THREE.Color('#000000'),
    uPatternScale: 8.0,
    uTime: 0.0
  },

  // Vertex Shader (Gère la la position)
  `
    varying vec2 vUv;
    varying vec3 vLocalPosition;

    void main() {
      vUv = uv; 
      vLocalPosition = position;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,

  // Fragment Shader (Texturing animé)
  `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uPatternScale;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vLocalPosition;

    // --- FONCTION DE BRUIT ---
    float hash(vec3 p) {
      p  = fract( p*0.3183099 + .1 );
      p *= 17.0;
      return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
    }
    float noise(in vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix( hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)),f.x),
                 mix( hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix( hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)),f.x),
                 mix( hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }

    void main() {
      // --- GÉNÉRATION DU MOTIF DE PLASMA ---
      // On combine la position et le temps pour animer le bruit
      vec3 noisePos = vLocalPosition * uPatternScale;
      float movement = uTime * 0.5; 
      
      // Calcule le bruit organique
      float pattern = noise(noisePos + vec3(0.0, 0.0, movement));
      
      // Step pour le style Cartoon (taches nettes)
      float toonPattern = step(0.4, pattern);
      
      // Mélange le Jaune et l'Orange
      vec3 baseColor = mix(uColor1, uColor2, toonPattern);

      gl_FragColor = vec4(baseColor, 1.0);
    }
  `
);