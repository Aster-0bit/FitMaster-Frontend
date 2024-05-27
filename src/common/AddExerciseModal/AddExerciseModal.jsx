import { useEffect, useState } from 'react';
import './AddExerciseModal.css';
import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthProvider';

const AddExerciseModal = ({ isOpen, onClose, onSave }) => {
  const { getAccessToken } = useAuth();
  const [exerciseId, setExerciseId] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    reps: 0,
    sets: 0,
    weight: 0,
    rest: 0,
    duration: 0,
    intensity: '',
    note: '',
    days: [] // Estado para los días seleccionados
  });

  useEffect(() => {
    if (isOpen) {
      const fetchExercises = async () => {
        try {
          const token = getAccessToken();
          const response = await fetch('https://fitmaster-backend-production.up.railway.app/exercises', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setExercises(data);
            setFilteredExercises(data); // Inicialmente muestra todos los ejercicios
          } else {
            console.error('Error al obtener los ejercicios', response.statusText);
          }
        } catch (error) {
          console.error('Error al obtener los ejercicios', error);
        }
      };

      fetchExercises();
    }
  }, [isOpen, getAccessToken]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setFilteredExercises(exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchValue)
    ));
  };

  const handleFilterClick = (role) => {
    setFilteredExercises(exercises.filter(exercise => exercise.role === role));
  };

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      reps: 0,
      sets: 0,
      weight: 0,
      rest: 0,
      duration: 0,
      intensity: '',
      note: '',
      days: []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleIncrement = (name) => {
    setFormData(prevData => ({ ...prevData, [name]: prevData[name] + 1 }));
  };

  const handleDecrement = (name) => {
    setFormData(prevData => ({ ...prevData, [name]: Math.max(prevData[name] - 1, 0) }));
  };

  const handleDayChange = (day) => {
    setFormData(prevData => {
      const days = prevData.days.includes(day)
        ? prevData.days.filter(d => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExercise) return;

    const token = getAccessToken();
    const response = await fetch('https://fitmaster-backend-production.up.railway.app/exercises', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ exercise_id: selectedExercise.exercise_id, ...formData })
    });

    if (response.ok) {
      const newExercise = await response.json();
      console.log('Nuevo ejercicio:', newExercise);
      onSave(newExercise);

      // Realizar peticiones adicionales para los días seleccionados usando el `id` devuelto
      for (const day of formData.days) {
        await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/id/${newExercise.id}/day/${day}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      onClose();
    } else {
      console.error('Error al añadir el ejercicio', response.statusText);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Añadir Ejercicio</h2>
        {!selectedExercise ? (
          <>
            <div className="search-bar">
              <FaSearch />
              <input type="text" placeholder="Buscar ejercicio..." onChange={handleSearchChange} />
            </div>
            <div className="filter-buttons">
              <button onClick={() => handleFilterClick('calistenia')}>Calistenia</button>
              <button onClick={() => handleFilterClick('gimnasio')}>Gimnasio</button>
              <button onClick={() => handleFilterClick('cardio')}>Cardio</button>
            </div>
            <div className="exercise-list">
              {filteredExercises.map(exercise => (
                <div key={exercise.exercise_id} className="exercise-item" onClick={() => handleExerciseClick(exercise)}>
                  {exercise.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Repeticiones</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('reps')}><FaMinus /></button>
                <input type="number" name="reps" value={formData.reps} onChange={handleChange} />
                <button type="button" onClick={() => handleIncrement('reps')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Series</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('sets')}><FaMinus /></button>
                <input type="number" name="sets" value={formData.sets} onChange={handleChange} />
                <button type="button" onClick={() => handleIncrement('sets')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Peso</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('weight')}><FaMinus /></button>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                <button type="button" onClick={() => handleIncrement('weight')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Descanso</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('rest')}><FaMinus /></button>
                <input type="number" name="rest" value={formData.rest} onChange={handleChange} />
                <button type="button" onClick={() => handleIncrement('rest')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Duración</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('duration')}><FaMinus /></button>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
                <button type="button" onClick={() => handleIncrement('duration')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Intensidad</label>
              <select name="intensity" value={formData.intensity} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nota</label>
              <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
              <label>Días</label>
              <div className="days-selector">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <div key={index} className={`day-circle ${formData.days.includes(index + 1) ? 'selected' : ''}`} onClick={() => handleDayChange(index + 1)}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddExerciseModal;
