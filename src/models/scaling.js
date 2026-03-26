// --- Logique d'échelle ---

// Calcule la taille 3D adaptée
export const calculate3DSize = (realRadius) => {
  // Compresse les différences de taille extrêmes (puissance 0.4)
  return Math.pow(realRadius / 6371, 0.4) * 0.4; 
};

// Calcule la distance 3D visuelle
export const calculate3DDistance = (realDistance) => {
  // Écrase les distances cosmiques gigantesques (logarithme base 10)
  const logDist = Math.log10(realDistance);
  return (logDist - 7.5) * 20; 
};