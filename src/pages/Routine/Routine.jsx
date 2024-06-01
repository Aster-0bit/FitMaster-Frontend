import { useEffect, useState, useRef } from "react";
import './Routine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getDayInfo } from '../../routes/utils';
import ExerciseCard from '../../common/ExerciseCard/ExerciseCard';
import FloatingActionButton from '../../common/FloatingActionButton/FloatingActionButton';
import ExerciseSelectionModal from '../../common/ExerciseSelectionModal/ExerciseSelectionModal';
import ExerciseDetailsForm from '../../common/ExerciseDetailsForm/ExerciseDetailsForm';
import EditExerciseModal from '../../common/EditExerciseModal/EditExerciseModal';
import DeleteConfirmationModal from '../../common/DeleteConfirmationModal/DeleteConfirmationModal';
import AddExerciseModal from '../../common/AddExerciseModal/AddExerciseModal';
import { useAuth } from '../../auth/AuthProvider';
import ToastManager from './../../common/ToastManager';



const Routine = () => {
  const { getAccessToken } = useAuth();
  const [dayInfo, setDayInfo] = useState(getDayInfo());
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isDetailsFormOpen, setIsDetailsFormOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteAllChecked, setIsDeleteAllChecked] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState(null);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const toast = useRef(null);

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
        console.error('Error al obtener los datos de los ejercicios', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener los datos de los ejercicios', error);
    }
  };
  useEffect(() => {

    fetchExercises();
  }, [dayInfo, getAccessToken]);

  const handleNextDay = () => {
    setDayInfo((prevDayInfo) => {
      const nextDayId = prevDayInfo.id % 7 + 1;
      const nextDayName = getDayInfoById(nextDayId).name;
      return { id: nextDayId, name: nextDayName };
    });
  };

  const handlePrevDay = () => {
    setDayInfo((prevDayInfo) => {
      const prevDayId = (prevDayInfo.id + 5) % 7 + 1;
      const prevDayName = getDayInfoById(prevDayId).name;
      return { id: prevDayId, name: prevDayName };
    });
  };

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
  };

  const handleEdit = (exerciseP_id) => {
    setExerciseToEdit(exerciseP_id);
    setIsEditModalOpen(true);
  };

  const handleDeleteDay = async (exerciseP_id) => {
    try {
      const token = getAccessToken();
      const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/${exerciseP_id}/day/${dayInfo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setExercises(prevExercises => prevExercises.filter(exercise => exercise.ExerciseP_id !== exerciseP_id));
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Ejercicio eliminado correctamente', life: 3000 });
      } else {
        console.error('Error al eliminar el ejercicio', response.statusText);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ejercicio', life: 3000 });
      }
    } catch (error) {
      console.error('Error al eliminar el ejercicio', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ejercicio', life: 3000 });
    }
  };
  
  const handleDeleteAll = async (exerciseP_id) => {
    try {
      const token = getAccessToken();
      const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/${exerciseP_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setExercises(prevExercises => prevExercises.filter(exercise => exercise.ExerciseP_id !== exerciseP_id));
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Ejercicio eliminado completamente', life: 3000 });
      } else {
        console.error('Error al eliminar el ejercicio completamente', response.statusText);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ejercicio completamente', life: 3000 });
      }
    } catch (error) {
      console.error('Error al eliminar el ejercicio completamente', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ejercicio completamente', life: 3000 });
    }
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
        console.error('Error al actualizar el favorito', response.statusText);
        const errorText = await response.text();
        console.error('Detalles del error:', errorText);
      }
    } catch (error) {
      console.error('Error al actualizar el favorito', error);
    }
  };

  const handleDeleteClick = (exerciseP_id) => {
    setExerciseToDelete(exerciseP_id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isDeleteAllChecked) {
      handleDeleteAll(exerciseToDelete);
    } else {
      handleDeleteDay(exerciseToDelete);
    }
    setIsDeleteModalOpen(false);
    setIsDeleteAllChecked(false);
    setExerciseToDelete(null);
  };

  const handleCheckboxChange = () => {
    setIsDeleteAllChecked(!isDeleteAllChecked);
  };

  const handleSaveEdit = (updatedExercise) => {
    fetchExercises();
  };

  const handleSaveNewExercise = (newExercise) => {
    fetchExercises();
  };

  return (
    <main className="content">
      <ToastManager ref={toast} />
      <div className="day-selector">
        <span className="icon-button" onClick={handlePrevDay}>
          <FontAwesomeIcon icon={faChevronLeft} className="fa-2x" />
        </span>
        <h1>{dayInfo.name}</h1>
        <span className="icon-button" onClick={handleNextDay}>
          <FontAwesomeIcon icon={faChevronRight} className="fa-2x" />
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
              exerciseP_id={exercise.ExerciseP_id} // Aquí se pasa el ID correctamente
              name={exercise.Exercise_Name}
              description={exercise.Description}
              repetitions={exercise.Repetitions}
              sets={exercise.Sets}
              rest={exercise.Rest}
              duration={exercise.Duration}
              intensity={exercise.Intensity}
              note={exercise.Note}
              isFavorite={exercise.Is_Favorite}
              onEdit={() => handleEdit(exercise.ExerciseP_id)}
              onDelete={() => handleDeleteClick(exercise.ExerciseP_id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
      <FloatingActionButton onClick={() => setIsAddExerciseModalOpen(true)} />
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
      <EditExerciseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        exerciseP_id={exerciseToEdit}
        showToast={(severity, summary, detail) => toast.current.show({ severity, summary, detail, life: 3000 })}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        onCheckboxChange={handleCheckboxChange}
        isDeleteAllChecked={isDeleteAllChecked}
      />
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onSave={handleSaveNewExercise}
        showToast={(severity, summary, detail) => toast.current.show({ severity, summary, detail, life: 3000 })}
      />
    </main>
  );
};

export default Routine;
