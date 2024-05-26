import { useEffect, useState } from "react"
import './Routine.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getDayInfo } from '../../routes/utils';
import ExerciseCard from '../../common/ExerciseCard/ExerciseCard';
import FloatingActionButton from '../../common/FloatingActionButton/FloatingActionButton'// Assuming this component exists
import ExerciseSelectionModal from '../../common/ExerciseSelectionModal/ExerciseSelectionModal';
import ExerciseDetailsForm from '../../common/ExerciseDetailsForm/ExerciseDetailsForm';
import { useAuth } from '../../auth/AuthProvider';





const Routine = () => {
  const { getAccessToken } = useAuth();
  const [dayInfo, setDayInfo] = useState(getDayInfo())
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isDetailsFormOpen, setIsDetailsFormOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);

  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`https://fitmaster-backend-production.up.railway.app/user/routine/${dayInfo.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        } else {
          console.error('Error al obtener los datos de los ejercicios');
        }
      } catch (error) {
        console.error('Error al obtener los datos de los ejercicios', error);
      }
    };

    fetchExercises();
  }, [dayInfo, getAccessToken]);

  const handleNextDay = () => {
    setDayInfo((prevDayInfo) => {
      const nextDayId = prevDayInfo.id % 7 + 1
      const prevDayName = getDayInfoById(nextDayId).name
      return { id: nextDayId, name: prevDayName}
    })
  }

  const handlePrevDay = () => {
    setDayInfo((prevDayInfo) => {
      const prevDayId = (prevDayInfo.id + 5) % 7 + 1
      const prevDayName = getDayInfoById(prevDayId).name
      return { id: prevDayId, name: prevDayName}
    })
  }

  const getDayInfoById = (id) => {
    const daysOfWeek = [
      { id: 1, name: 'Lunes' },
      { id: 2, name: 'Martes' },
      { id: 3, name: 'Miércoles' },
      { id: 4, name: 'Jueves' },
      { id: 5, name: 'Viernes' },
      { id: 6, name: 'Sábado' },
      { id: 7, name: 'Domingo' }
    ];
    return daysOfWeek.find(day => day.id === id);
  }

  const exerciseData = {
    name: "Nombre del Ejercicio",
    repetitions: 12,
    sets: 4,
    rest: "60 segundos",
    intensity: "Alta",
    duration: "30 minutos",
    note: "Realizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena posturaRealizar con control y buena postura"
  };

  const handleEdit = () => {
    console.log('Editar ejercicio');
    // Aquí puedes añadir la lógica para editar el ejercicio
  };

  const handleDelete = () => {
    console.log('Eliminar ejercicio');
    // Aquí puedes añadir la lógica para eliminar el ejercicio
  };

  const handleOpenSelectionModal = () => {
    setIsSelectionModalOpen(true);
  };

  const handleCloseSelectionModal = () => {
    setIsSelectionModalOpen(false);
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsSelectionModalOpen(false);
    setIsDetailsFormOpen(true);
  };

  const handleCloseDetailsForm = () => {
    setIsDetailsFormOpen(false);
  };

  const handleSubmitDetails = (details) => {
    console.log(details);
    setIsDetailsFormOpen(false);
  };

  const toggleFavorite = async (exerciseP_id, isFavorite) => {
    try {
      const token = getAccessToken();
      const method = isFavorite ? 'POST' : 'DELETE';
      console.log(`Toggling favorite for exercise: ${exerciseP_id} with method: ${method} and token: ${token}`);
      const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/favourite/${exerciseP_id}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setExercises((prevExercises) =>
          prevExercises.map((exercise) =>
            exercise.ExerciseP_id === exerciseP_id ? { ...exercise, Is_Favorite: isFavorite ? 1 : 0 } : exercise
          )
        );
      } else {
        console.error('Error al actualizar el favorito');
      }
    } catch (error) {
      console.error('Error al actualizar el favorito', error);
    }
  };

  return (
        <main className="content">
          <div className="day-selector">
            <span className="icon-button" onClick={handlePrevDay} >
              <FontAwesomeIcon icon={faChevronLeft} className="fa-2x"/>
            </span>
            <h1>{dayInfo.name}</h1>
            <span className="icon-button" onClick={handleNextDay}>
              <FontAwesomeIcon icon={faChevronRight} className="fa-2x"/>
            </span>
          </div>
          <div className="info">
            Ejercicios: {exercises.length}
          </div>
          <div className="exercises">
          {exercises.length === 0 ? (
              <p className="no-exercises">No hay ejercicios registrados :(</p>
            ) : (
              exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.ExerciseP_id}
                  name={exercise.Exercise_Name}
                  description={exercise.Description}
                  repetitions={exercise.Repetitions}
                  sets={exercise.Sets}
                  rest={exercise.Rest}
                  duration={exercise.Duration}
                  intensity={exercise.Intensity}
                  note={exercise.Description}
                  isFavorite={exercise.Is_Favorite}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>
          <FloatingActionButton onClick={handleOpenSelectionModal} />
          {isSelectionModalOpen && (
            <ExerciseSelectionModal
              exercises={exercises}
              onSelect={handleSelectExercise}
              onClose={handleCloseSelectionModal}
            />
          )}
          {isDetailsFormOpen && selectedExercise && (
            <ExerciseDetailsForm
              exercise={selectedExercise}
              onSubmit={handleSubmitDetails}
              onClose={handleCloseDetailsForm}
            />
          )}
      </main>
  )
};

export default Routine;
