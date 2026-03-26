// --- Logique des couleurs ---

import * as THREE from 'three';

// On associe les couleurs à chaque planète
export const getPlanetColors = (id) => {
  const palettes = {
    'mercure': { c1: '#999999', c2: '#555555' }, // Gris
    'venus': { c1: '#e8c37d', c2: '#d1a049' },   // Jaune
    'terre': { c1: '#2b82c9', c2: '#80c93a' },   // Bleu océan et Vert continent
    'mars': { c1: '#d15336', c2: '#8c2d16' },    // Rouge
    'jupiter': { c1: '#d6b894', c2: '#b58b5e' }, // Beige/Marron
    'saturne': { c1: '#e3d2aa', c2: '#c2ad76' }, // Doré pâle
    'uranus': { c1: '#7bc1e8', c2: '#4a9ad4' },  // Bleu clair glacé
    'neptune': { c1: '#3a5cc9', c2: '#1e388c' }  // Bleu profond
  };

  // Si l'ID n'est pas trouvé, on met du gris par défaut
  const colors = palettes[id] || { c1: '#ffffff', c2: '#aaaaaa' };

  return {
    color1: new THREE.Color(colors.c1),
    color2: new THREE.Color(colors.c2)
  };
};

// Définit les couleurs du Soleil
export const getSunColors = () => {
  return {
    color1: new THREE.Color('#FFFB00'), 
    color2: new THREE.Color('#FF4D00')
  };
};

// Définit l'échelle du motif solaire
export const getSunPatternSettings = () => {
  return 8.0; 
};