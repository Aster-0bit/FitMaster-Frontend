import React, { useEffect, useState } from 'react';
import './../AddExerciseModal/AddExerciseModal.css';
import { FaSearch, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthProvider';
import { NumericFormat } from 'react-number-format';
import { Dropdown } from 'primereact/dropdown';

const EditExerciseModal = ({ isOpen, onClose, onSave, exerciseP_id, showToast }) => {
  const { getAccessToken } = useAuth();
  const [exerciseData, setExerciseData] = useState({
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
    setExerciseData({
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (exerciseP_id && isOpen) {
      const fetchExerciseData = async () => {
        try {
          setLoading(true);
          const token = getAccessToken();
          const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/${exerciseP_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setExerciseData({
              reps: data.reps || 0,
              sets: data.sets || 0,
              weight: data.weight || 0,
              rest: data.rest || 0,
              duration: data.duration || 0,
              intensity: data.intensity || '',
              note: data.note || '',
              days: data.days || []
            });
          } else {
            console.error('Error al obtener los datos del ejercicio', response.statusText);
          }
        } catch (error) {
          console.error('Error al obtener los datos del ejercicio', error);
        }finally{
          setLoading(false);
        }
      };

      fetchExerciseData();
    }
  }, [exerciseP_id, isOpen, getAccessToken]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number' || type === 'text') {
      setExerciseData(prevData => ({ ...prevData, [name]: parseFloat(value) }));
    } else {
      setExerciseData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleIncrement = (name) => {
    setExerciseData(prevData => ({ ...prevData, [name]: (parseFloat(prevData[name]) || 0) + 1 }));
  };

  const handleDecrement = (name) => {
    setExerciseData(prevData => ({ ...prevData, [name]: Math.max((parseFloat(prevData[name]) || 0) - 1, 0) }));
  };

  const handleDayChange = (day) => {
    setExerciseData(prevData => {
      const days = prevData.days.includes(day)
        ? prevData.days.filter(d => d !== day)
        : [...prevData.days, day];
      return { ...prevData, days };
    });
  };

  const validateInputs = () => {
    const positiveCounts = [
      exerciseData.reps,
      exerciseData.sets,
      exerciseData.weight,
      exerciseData.rest,
      exerciseData.duration
    ].filter(value => value > 0).length;

    return positiveCounts >= 2;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      showToast('error', 'Error', 'Al menos 2 valores numéricos deben ser positivos.');
      return;
    }
    const updatedData = {
      reps: exerciseData.reps ? Number(exerciseData.reps) : undefined,
      sets: exerciseData.sets ? Number(exerciseData.sets) : undefined,
      weight: exerciseData.weight ? Number(exerciseData.weight) : undefined,
      rest: exerciseData.rest ? Number(exerciseData.rest) : undefined,
      duration: exerciseData.duration ? Number(exerciseData.duration) : undefined,
      intensity: exerciseData.intensity || undefined,
      note: exerciseData.note || undefined
    };
    try {
      const token = getAccessToken();
      setLoading(true);
      const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/${exerciseP_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const updatedExercise = { ...updatedData, ExerciseP_id: exerciseP_id };
        onSave(updatedExercise);
        showToast('success', 'Éxito', 'Ejercicio actualizado correctamente');
        resetForm();
        onClose();
        setLoading(false);
      } else {
        console.error('Error al actualizar el ejercicio', response.statusText);
        showToast('error', 'Error', 'Error al actualizar el ejercicio');
      }
      const historyResponse = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/add/history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'	
        },
        body: JSON.stringify({...updatedData, exerciseP_id: exerciseP_id})
      });
      console.log({'repuesta': "si", ...updatedData, exerciseP_id: exerciseP_id });
    } catch (error) {
      console.error('Error al actualizar el ejercicio', error);
      showToast('error', 'Error', 'Error al actualizar el ejercicio');
    }finally{
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
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
        <button className="close-btn" onClick={handleModalClose}><FaTimes /></button>
        <h2>{loading ? 'Cargando...': 'Editar Ejercicio'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Repeticiones</label>
            <div className="input-group">
              <button type="button" onClick={() => handleDecrement('reps')}><FaMinus /></button>
              <input type="number" min="0" max="75" name="reps" value={exerciseData.reps} onChange={handleChange} />
              <button type="button" onClick={() => handleIncrement('reps')}><FaPlus /></button>
            </div>
          </div>
          <div className="form-group">
            <label>Series</label>
            <div className="input-group">
              <button type="button" onClick={() => handleDecrement('sets')}><FaMinus /></button>
              <input type="number" name="sets" value={exerciseData.sets} onChange={handleChange} />
              <button type="button" onClick={() => handleIncrement('sets')}><FaPlus /></button>
            </div>
          </div>
          <div className="form-group">
            <label>Peso (kg)</label>
            <div className="input-group">
              <button type="button" onClick={() => handleDecrement('weight')}><FaMinus /></button>
              <NumericFormat
                value={exerciseData.weight}
                onValueChange={({ floatValue }) => setExerciseData(prevData => ({ ...prevData, weight: floatValue }))}
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
                value={exerciseData.rest}
                onValueChange={({ floatValue }) => setExerciseData(prevData => ({ ...prevData, rest: floatValue }))}
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
                value={exerciseData.duration}
                onValueChange={({ floatValue }) => setExerciseData(prevData => ({ ...prevData, duration: floatValue }))}
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
              value={exerciseData.intensity}
              options={intensityOptions}
              onChange={(e) => setExerciseData(prevData => ({ ...prevData, intensity: e.value }))}
              placeholder="Seleccionar"
            />
          </div>
          <div className="form-group">
            <label>Nota</label>
            <textarea name="note" value={exerciseData.note} onChange={handleChange}></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleModalClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciseModal;
