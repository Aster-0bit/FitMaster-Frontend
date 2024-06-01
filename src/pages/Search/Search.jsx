import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import './Search.css';
import { FaSearch } from 'react-icons/fa';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

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
  { id: 11, name: 'Antebrazos' }
];

const exerciseTypes = [
  { value: 'gimnasio', name: 'Gimnasio' },
  { value: 'calistenia', name: 'Calistenia' },
  { value: 'cardio', name: 'Cardio' }
];

const intensities = [
  { value: 'Media', name: 'Media' },
  { value: 'Alta', name: 'Alta' },
  { value: 'Baja', name: 'Baja' }
];

const Search = () => {
  const { getAccessToken } = useAuth();
  const [recentExercises, setRecentExercises] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [activeTab, setActiveTab] = useState('recientes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExerciseType, setSelectedExerciseType] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('');
  const toast = useRef(null);

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
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los ejercicios recientes', life: 3000 });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los ejercicios recientes', life: 3000 });
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
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los ejercicios favoritos', life: 3000 });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los ejercicios favoritos', life: 3000 });
      }
    };

    fetchRecentExercises();
    fetchFavoriteExercises();
  }, [getAccessToken]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchFilteredExercises = async (endpoint, filterType) => {
    try {
      const token = getAccessToken();
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if(data.length === 0) {
          toast.current.show({ severity: 'info', summary: 'Info', detail: `No hay ejercicios por ${filterType}`, life: 3000 });
        }
        setFilteredExercises(data);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: `No hay ejercicios para ese grupo muscular.`, life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al obtener los ejercicios por ${filterType}`, life: 3000 });
    }
  };

  const handleMuscleGroupChange = (e) => {
    setSelectedMuscleGroup(e.value);
    setSelectedExerciseType('');
    setSelectedIntensity('');
    if (e.value) {
      const endpoint = `https://fitmaster-backend-production.up.railway.app/exercises/muscle-group/${e.value}`;
      fetchFilteredExercises(endpoint, 'grupo muscular');
    } else {
      setFilteredExercises([]);
    }
  };

  const handleExerciseTypeChange = (e) => {
    setSelectedExerciseType(e.value);
    setSelectedMuscleGroup('');
    setSelectedIntensity('');
    if (e.value) {
      const endpoint = `https://fitmaster-backend-production.up.railway.app/exercises/role/${e.value}`;
      fetchFilteredExercises(endpoint, 'tipo de ejercicio');
    } else {
      setFilteredExercises([]);
    }
  };

  const handleIntensityChange = (e) => {
    setSelectedIntensity(e.value);
    setSelectedMuscleGroup('');
    setSelectedExerciseType('');
    if (e.value) {
      const endpoint = `https://fitmaster-backend-production.up.railway.app/exercises/intensity/${e.value}`;
      fetchFilteredExercises(endpoint, 'intensidad');
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
      <Toast ref={toast} />
      <div className="search-bar" id='searchh'>
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar ejercicio"
          value={searchTerm}
          onChange={handleSearchChange}
          id='inputt'
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
            <Dropdown
              value={selectedMuscleGroup}
              options={muscleGroups.map(group => ({ label: group.name, value: group.id }))}
              onChange={handleMuscleGroupChange}
              placeholder="Seleccionar grupo muscular"
              className="md:w-20rem w-full"
            />
            <Dropdown
              value={selectedExerciseType}
              options={exerciseTypes.map(type => ({ label: type.name, value: type.value }))}
              onChange={handleExerciseTypeChange}
              placeholder="Seleccionar tipo de ejercicio"
              className="md:w-20rem w-full"
            />
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
