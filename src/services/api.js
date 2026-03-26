const API_URL = '/api-solaire/bodies/';

const API_TOKEN = 'aea933c3-822c-408b-bb9d-a9e7b825760d'; 

export const fetchPlanets = async () => {
  try {
    // On appelle l'API
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    // On vérifie si la réponse est OK avant d'essayer de la lire
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    // On filtre et on nettoie les données
    const planetsData = data.bodies
      .filter(body => body.isPlanet)
      .map(planet => ({
        id: planet.id,
        name: planet.name,
        radius: planet.meanRadius, 
        distance: planet.semimajorAxis, 
        density: planet.density, 
        gravity: planet.gravity,
        inclination: planet.inclination,
        sideralOrbit: planet.sideralOrbit,
        sideralRotation: planet.sideralRotation
      }))
      .sort((a, b) => a.distance - b.distance); 
    
    console.log(planetsData);
    return planetsData;
  } catch (error) {
    console.error("Erreur de communication avec la base de données spatiale :", error);
    return [];
  }
};