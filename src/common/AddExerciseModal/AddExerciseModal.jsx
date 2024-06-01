import React, { useEffect, useState } from 'react';
import './AddExerciseModal.css';
import { FaSearch, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthProvider';
import { NumericFormat } from 'react-number-format';
import { Dropdown } from 'primereact/dropdown';

const AddExerciseModal = ({ isOpen, onClose, onSave, showToast }) => {
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
    days: []
  });

  const resetForm = () => {
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
    setSelectedExercise(null);
  };

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
            setFilteredExercises(data);
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

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  

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
    const { name, value, type } = e.target;
    if (type === 'number' || type === 'text') {
      setFormData(prevData => ({ ...prevData, [name]: parseFloat(value) }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleIncrement = (name) => {
    setFormData(prevData => ({ ...prevData, [name]: (parseFloat(prevData[name]) || 0) + 1 }));
  };

  const handleDecrement = (name) => {
    setFormData(prevData => ({ ...prevData, [name]: Math.max((parseFloat(prevData[name]) || 0) - 1, 0) }));
  };

  const handleDayChange = (day) => {
    setFormData(prevData => {
      const days = prevData.days.includes(day)
        ? prevData.days.filter(d => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days };
    });
  };

  const validateInputs = () => {
    const positiveCounts = [
      formData.reps,
      formData.sets,
      formData.weight,
      formData.rest,
      formData.duration
    ].filter(value => value > 0).length;
  
    return positiveCounts >= 2;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExercise || formData.days.length === 0) {
      showToast('error', 'Error', 'Debes seleccionar un ejercicio y al menos un día.');
      return;
    }

    if (!validateInputs()) {
      showToast('error', 'Error', 'Al menos 2 valores numéricos deben ser positivos.');
      return;
    }

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

      for (const day of formData.days) {
        await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/id/${newExercise.id}/day/${day}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      showToast('success', 'Éxito', 'Ejercicio añadido correctamente');
      onClose();
    } else {
      console.error('Error al añadir el ejercicio', response.statusText);
      showToast('error', 'Error', 'Error al añadir el ejercicio');
    }
  };

  if (!isOpen) return null;

  const intensityOptions = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Añadir Ejercicio</h2>
        {!selectedExercise ? (
          <>
            <div className="search-bar">
              <FaSearch className='icon'/>
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
                <input type="number" min="0" max="75" name="reps" value={formData.reps} onChange={handleChange} />
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
              <label>Peso (kg)</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('weight')}><FaMinus /></button>
                <NumericFormat
                  value={formData.weight}
                  onValueChange={({ floatValue }) => setFormData(prevData => ({ ...prevData, weight: floatValue }))}
                  thousandSeparator={true}
                  suffix={' kg'}
                  customInput={props => <input {...props} name="weight" />}
                />
                <button type="button" onClick={() => handleIncrement('weight')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Descanso (minutos)</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('rest')}><FaMinus /></button>
                <NumericFormat
                  value={formData.rest}
                  onValueChange={({ floatValue }) => setFormData(prevData => ({ ...prevData, rest: floatValue }))}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  suffix={' m'}
                  customInput={props => <input {...props} name="rest" />}
                />
                <button type="button" onClick={() => handleIncrement('rest')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Duración (minutos)</label>
              <div className="input-group">
                <button type="button" onClick={() => handleDecrement('duration')}><FaMinus /></button>
                <NumericFormat
                  value={formData.duration}
                  onValueChange={({ floatValue }) => setFormData(prevData => ({ ...prevData, duration: floatValue }))}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  suffix={' m'}
                  customInput={props => <input {...props} name="duration" />}
                />
                <button type="button" onClick={() => handleIncrement('duration')}><FaPlus /></button>
              </div>
            </div>
            <div className="form-group">
              <label>Intensidad</label>
              <Dropdown
                value={formData.intensity}
                options={intensityOptions}
                onChange={(e) => setFormData(prevData => ({ ...prevData, intensity: e.value }))}
                placeholder="Seleccionar"
              />
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
