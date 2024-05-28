import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import './Search.css';
import { FaSearch } from 'react-icons/fa';

const muscleGroups = [
  { id: 1, name: 'Pectorales' },
  { id: 2, name: 'Dorsales' },
  { id: 3, name: 'Hombros' },
  { id: 4, name: 'Bíceps' },
  { id: 5, name: 'Tríceps' },
  { id: 6, name: 'Cuádriceps' },
  { id: 7, name: 'Isquiotibiales' },
  { id: 8, name: 'Glúteos' },
  { id: 9, name: 'Abdominales' },
  { id: 10, name: 'Pantorrillas' },
  { id: 11, name: 'Antebrazos' },
];

const Search = () => {
  const { getAccessToken } = useAuth();
  const [recentExercises, setRecentExercises] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [activeTab, setActiveTab] = useState('recientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  useEffect(() => {
    const fetchRecentExercises = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch('https://fitmaster-backend-production.up.railway.app/exercises/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRecentExercises(data);
        } else {
          console.error('Error al obtener los ejercicios recientes', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener los ejercicios recientes', error);
      }
    };

    const fetchFavoriteExercises = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch('https://fitmaster-backend-production.up.railway.app/exercises/favourite', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFavoriteExercises(data);
        } else {
          console.error('Error al obtener los ejercicios favoritos', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener los ejercicios favoritos', error);
      }
    };

    fetchRecentExercises();
    fetchFavoriteExercises();
  }, [getAccessToken]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMuscleGroupChange = async (e) => {
    const muscleGroupId = e.target.value;
    setSelectedMuscleGroup(muscleGroupId);

    if (muscleGroupId) {
      try {
        const token = getAccessToken();
        const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/muscle-group/${muscleGroupId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFilteredExercises(data);
        } else {
          console.error('Error al obtener los ejercicios por grupo muscular', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener los ejercicios por grupo muscular', error);
      }
    } else {
      setFilteredExercises([]);
    }
  };

  const filteredRecentExercises = recentExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFavoriteExercises = favoriteExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="content">
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar ejercicio"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="tabs">
        <button className={activeTab === 'recientes' ? 'active' : ''} onClick={() => setActiveTab('recientes')}>Recientes</button>
        <button className={activeTab === 'favoritos' ? 'active' : ''} onClick={() => setActiveTab('favoritos')}>Favoritos</button>
        <button className={activeTab === 'filtros' ? 'active' : ''} onClick={() => setActiveTab('filtros')}>Filtros</button>
      </div>
      {activeTab === 'recientes' && (
        <div className="exercises">
          {filteredRecentExercises.map(exercise => (
            <div key={exercise.exerciseP_id} className="card">
              <div className="card-header">
                <h2 className="exercise-name">{exercise.name}</h2>
              </div>
              <div className="card-body">
                <ul className="exercise-details">
                  <li><span>Repeticiones:</span> {exercise.reps}</li>
                  <li><span>Series:</span> {exercise.sets}</li>
                  <li><span>Descanso:</span> {exercise.rest}</li>
                  <li><span>Intensidad:</span> {exercise.intensity}</li>
                  <li><span>Duración:</span> {exercise.duration}</li>
                  <li><span>Nota:</span> {exercise.note}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'favoritos' && (
        <div className="exercises">
          {filteredFavoriteExercises.map(exercise => (
            <div key={exercise.exerciseP_id} className="card">
              <div className="card-header">
                <h2 className="exercise-name">{exercise.name}</h2>
              </div>
              <div className="card-body">
                <ul className="exercise-details">
                  <li><span>Repeticiones:</span> {exercise.reps}</li>
                  <li><span>Series:</span> {exercise.sets}</li>
                  <li><span>Descanso:</span> {exercise.rest}</li>
                  <li><span>Intensidad:</span> {exercise.intensity}</li>
                  <li><span>Duración:</span> {exercise.duration}</li>
                  <li><span>Nota:</span> {exercise.note}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'filtros' && (
        <>
          <div className="filter-bar">
            <select onChange={handleMuscleGroupChange} value={selectedMuscleGroup}>
              <option value="">Seleccionar grupo muscular</option>
              {muscleGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="exercises">
            {filteredExercises.map(exercise => (
              <div key={exercise.exerciseP_id} className="card">
                <div className="card-header">
                  <h2 className="exercise-name">{exercise.name}</h2>
                </div>
                <div className="card-body">
                  <ul className="exercise-details">
                    <li><span>Repeticiones:</span> {exercise.reps}</li>
                    <li><span>Series:</span> {exercise.sets}</li>
                    <li><span>Descanso:</span> {exercise.rest}</li>
                    <li><span>Intensidad:</span> {exercise.intensity}</li>
                    <li><span>Duración:</span> {exercise.duration}</li>
                    <li><span>Nota:</span> {exercise.note}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Search;
