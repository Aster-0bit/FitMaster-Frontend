// ExerciseDetailsForm.js
import { useState } from 'react';
import './ExerciseDetailsForm.css';

const ExerciseDetailsForm = ({ exercise, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    repetitions: '',
    sets: '',
    rest: '',
    weight: '',
    duration: '',
    note: '',
    intensity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{exercise.name}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Repeticiones:</label>
            <input type="number" name="repetitions" value={formData.repetitions} onChange={handleChange} />
          </div>
          <div>
            <label>Series:</label>
            <input type="number" name="sets" value={formData.sets} onChange={handleChange} />
          </div>
          <div>
            <label>Descanso:</label>
            <input type="text" name="rest" value={formData.rest} onChange={handleChange} />
          </div>
          <div>
            <label>Peso:</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
          </div>
          <div>
            <label>Duración:</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
          </div>
          <div>
            <label>Nota:</label>
            <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
          </div>
          <div>
            <label>Intensidad:</label>
            <input type="text" name="intensity" value={formData.intensity} onChange={handleChange} />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ExerciseDetailsForm;
