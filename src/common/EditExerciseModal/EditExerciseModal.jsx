import { useEffect, useState } from 'react';
import './EditExerciseModal.css';
import { useAuth } from '../../auth/AuthProvider';

const EditExerciseModal = ({ isOpen, onClose, onSave, exerciseP_id }) => {
  const { getAccessToken } = useAuth();
  const [exerciseData, setExerciseData] = useState({
    reps: '',
    sets: '',
    weight: '',
    rest: '',
    duration: '',
    intensity: '',
    note: ''
  });

  useEffect(() => {
    if (exerciseP_id && isOpen) {
      const fetchExerciseData = async () => {
        try {
          const token = getAccessToken();
          const response = await fetch(`https://fitmaster-backend-production.up.railway.app/exercises/${exerciseP_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setExerciseData({
              reps: data.reps ? data.reps.toString() : '',
              sets: data.sets ? data.sets.toString() : '',
              weight: data.weight ? data.weight.toString() : '',
              rest: data.rest ? data.rest.toString() : '',
              duration: data.duration ? data.duration.toString() : '',
              intensity: data.intensity || '',
              note: data.note || ''
            });
          } else {
            console.error('Error al obtener los datos del ejercicio', response.statusText);
          }
        } catch (error) {
          console.error('Error al obtener los datos del ejercicio', error);
        }
      };

      fetchExerciseData();
    }
  }, [exerciseP_id, isOpen, getAccessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        onClose();
      } else {
        console.error('Error al actualizar el ejercicio', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el ejercicio', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Ejercicio</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reps">Repeticiones</label>
            <input
              type="number"
              id="reps"
              name="reps"
              value={exerciseData.reps}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="sets">Series</label>
            <input
              type="number"
              id="sets"
              name="sets"
              value={exerciseData.sets}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Peso</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={exerciseData.weight}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rest">Descanso</label>
            <input
              type="number"
              id="rest"
              name="rest"
              value={exerciseData.rest}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duración</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={exerciseData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="intensity">Intensidad</label>
            <select
              id="intensity"
              name="intensity"
              value={exerciseData.intensity}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="note">Nota</label>
            <textarea
              id="note"
              name="note"
              value={exerciseData.note}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciseModal;
