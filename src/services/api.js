// --- Service de données ---

const API_URL = '/api-solaire/bodies/';

const API_TOKEN = 'aea933c3-822c-408b-bb9d-a9e7b825760d'; 

// Récupère toutes les planètes et leurs lunes
export const fetchPlanets = async () => {
  try {
    // On appelle l'API
    const response = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });

    // On vérifie si la réponse est OK avant d'essayer de la lire
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    const data = await response.json();

    // Filtre et nettoie les données
    const planetsData = data.bodies
      .filter(body => body.isPlanet)
      .map(planet => {
        
        // On cherche toutes les lunes qui tournent autour de la planète
        const moons = data.bodies
          .filter(b => b.aroundPlanet && b.aroundPlanet.planet === planet.id)
          .map(moon => ({
            id: moon.id,
            name: moon.name,
            radius: moon.meanRadius || 10, 
            distance: moon.semimajorAxis || 50000, 
            inclination: moon.inclination || 0,
            sideralOrbit: moon.sideralOrbit || 20,
            sideralRotation: moon.sideralRotation || 20
          }));

        return {
          id: planet.id,
          name: planet.name,
          radius: planet.meanRadius, 
          distance: planet.semimajorAxis, 
          density: planet.density, 
          gravity: planet.gravity,
          inclination: planet.inclination,
          sideralOrbit: planet.sideralOrbit,
          sideralRotation: planet.sideralRotation,
          moons: moons
        };
      })
      .sort((a, b) => a.distance - b.distance); 
    
    console.log(planetsData);
    
    return planetsData;
  } catch (error) {
    console.error("Erreur de base de données :", error);
    return [];
  }
};