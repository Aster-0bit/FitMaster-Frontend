import { useState } from 'react';
import './ExerciseSelectionModal.css';

const ExerciseSelectionModal = ({ exercises, onSelect, onClose }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filter, setFilter] = useState('');

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleConfirm = () => {
    if (selectedExercise) {
      onSelect(selectedExercise);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Seleccionar Ejercicio</h2>
        <input type="text" placeholder="Buscar ejercicio..." className="search-bar" />
        <div className="filter-buttons">
          <button onClick={() => setFilter('gimnasio')}>Gimnasio</button>
          <button onClick={() => setFilter('calistenia')}>Calistenia</button>
          <button onClick={() => setFilter('cardio')}>Cardio</button>
        </div>
        <div className="exercise-grid">
          {exercises
            .filter(ex => !filter || ex.type === filter)
            .map(exercise => (
              <div key={exercise.id} className="exercise-card" onClick={() => handleSelectExercise(exercise)}>
                <h3>{exercise.name}</h3>
                {selectedExercise && selectedExercise.id === exercise.id && <p>{exercise.description}</p>}
              </div>
          ))}
        </div>
        <button className="confirm-button" onClick={handleConfirm}>Confirmar</button>
      </div>
    </div>
  );
};

export default ExerciseSelectionModal;
