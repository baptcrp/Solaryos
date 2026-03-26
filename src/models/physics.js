// --- Logique de la physique ---

// Calcule la vitesse d'orbite (radians/jour)
export const getOrbitSpeed = (sideralOrbitDays) => {
  return (2 * Math.PI) / sideralOrbitDays;
};

// Calcule la vitesse de rotation (radians/jour)
export const getRotationSpeed = (sideralRotationHours) => {
  const rotationInDays = sideralRotationHours / 24;
  return (2 * Math.PI) / rotationInDays;
};