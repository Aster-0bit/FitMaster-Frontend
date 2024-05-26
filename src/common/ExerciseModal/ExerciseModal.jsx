import './ExerciseModal.css';

const ExerciseModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Seleccionar Ejercicio</h2>
      <form>
        <div>
          <label>Nombre del Ejercicio:</label>
          <input type="text" name="name" />
        </div>
        <div>
          <label>Repeticiones:</label>
          <input type="number" name="repetitions" />
        </div>
        <div>
          <label>Series:</label>
          <input type="number" name="sets" />
        </div>
        <div>
          <label>Descanso:</label>
          <input type="text" name="rest" />
        </div>
        <div>
          <label>Intensidad:</label>
          <input type="text" name="intensity" />
        </div>
        <div>
          <label>Duración:</label>
          <input type="text" name="duration" />
        </div>
        <div>
          <label>Nota:</label>
          <textarea name="note"></textarea>
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  </div>
);

export default ExerciseModal;
