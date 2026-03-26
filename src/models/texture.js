// --- Logique de texturing ---

import * as THREE from 'three';
import { getPlanetColors } from './color';

// Configuration
const CONFIG = {
  rocky: {
    minContinents: 15,
    maxContinents: 35,
    minRadius: 10,   
    maxRadius: 45,  
  },
  gas: {
    minBands: 4,
    maxBands: 12,
    minThickness: 10,
    maxThickness: 40,
  }
};

// Générateur de la seed
const seededRandom = (seedStr) => {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  return function() { h = Math.imul(1597334677, h); return ((h >>> 0) / 4294967296); };
};

// Dessine des blobs organiques
const drawBlob = (ctx, x, y, radius, random) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  
  // On divise le cercle en 8 segments pour le déformer
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    // On ajoute du chaos à la distance du centre (entre 70% et 130% du rayon)
    const dist = radius * (0.7 + random() * 0.6);
    ctx.lineTo(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist);
  }
  ctx.closePath();
  ctx.fill();
};

// Dessine la texture
export const generateCanvasTexture = (planetData) => {
  // Création du canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Récupère les couleurs et la seed
  const { color1, color2 } = getPlanetColors(planetData.id);
  const random = seededRandom(planetData.id + planetData.radius);

  // Peint le fond avec la couleur principal
  ctx.fillStyle = `#${color1.getHexString()}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Définit la couleur des détails
  ctx.fillStyle = `#${color2.getHexString()}`;

  // Logique de dessin
  if (planetData.density >= 3) {
    // --- PLANÈTE ROCHEUSE ---
    const { minContinents, maxContinents, minRadius, maxRadius } = CONFIG.rocky;

    // Calcule le nombre de continents au hasard entre min et max
    const numContinents = Math.floor(random() * (maxContinents - minContinents + 1)) + minContinents;

    // Dessine chaque continent
    ctx.filter = 'blur(4px)'; 
    for (let i = 0; i < numContinents; i++) {
      const x = random() * canvas.width;
      const y = random() * canvas.height;
      const radius = minRadius + random() * (maxRadius - minRadius);
      
      drawBlob(ctx, x, y, radius, random);
    }
    ctx.filter = 'none'; 
  } else {
    // --- GÉANTE GAZEUSE ---
    const { minBands, maxBands, minThickness, maxThickness } = CONFIG.gas;
    
    // Calcule le nombre de bandes au hasard entre min et max
    const numBands = Math.floor(random() * (maxBands - minBands + 1)) + minBands;

    let currentY = 0;
    
    // Dessine chaque bande
    for (let i = 0; i < numBands; i++) {
      // Épaisseur de la bande
      const thickness = minThickness + random() * (maxThickness - minThickness);

      currentY += random() * 20;
      ctx.fillRect(0, currentY, canvas.width, thickness);
      currentY += thickness;
    }
  }

  // Convertit notre dessin en texture pour la 3D
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter; 
  texture.minFilter = THREE.NearestFilter;
  return texture;
};

// Génère l'image du Cel-Shading
export const generateCelGradientMap = () => {
  // Canvas de 2x1
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  // Pixel 1: Noir (Ombre dure)
  ctx.fillStyle = '#020202'; 
  ctx.fillRect(0, 0, 1, 1);
  // Pixel 2: Blanc (Pleine lumière)
  ctx.fillStyle = '#ffffff'; 
  ctx.fillRect(1, 0, 1, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter; 
  texture.minFilter = THREE.NearestFilter;
  return texture;
};