import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { fetchPlanets } from './services/api';
import Sun from './components/Sun';
import Planet from './components/Planet';

// Initialise l'application 3D principale
function App() {
  const [planets, setPlanets] = useState([]);

  // Récupère l'API au chargement initial
  useEffect(() => {
    const getPlanets = async () => {
      const data = await fetchPlanets();
      setPlanets(data);
    };
    getPlanets();
  }, []);

  return (
    // Scène 3D avec caméra reculée
    <Canvas camera={{ position: [0, 30, 40], fov: 45 }}>
      
      {/* Couleur du fond */}
      <color attach="background" args={['#030508']} />

      {/* Ciel étoilé */}
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />

      {/* Lumière globale très faible */}
      <ambientLight intensity={0.1} />
      
      {/* Lumière centrale simulant le Soleil */}
      <pointLight position={[0, 0, 0]} intensity={500} decay={2} distance={100} color="white" />
      
      {/* Mouvement */}
      <OrbitControls makeDefault />

      <Sun />

      {/* Boucle créant toutes les planètes dynamiquement */}
      {planets.map((planetData) => (
        <Planet key={planetData.id} data={planetData} />
      ))}
      
    </Canvas>
  );
}

export default App;