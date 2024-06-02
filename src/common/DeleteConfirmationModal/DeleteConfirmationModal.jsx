import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, onCheckboxChange, isDeleteAllChecked, isRoutine }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar eliminación</h2>
        {isRoutine ? (
          <>
            <p>¿Estás seguro de que deseas eliminar este ejercicio?</p>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="deleteAll"
                checked={isDeleteAllChecked}
                onChange={onCheckboxChange}
              />
              <label htmlFor="deleteAll">Eliminar de todos los días</label>
            </div>
          </>
        ) : (
          <p>¿Estás seguro de que deseas eliminar este ejercicio? <span className='imprt'>Se eliminará de todos los días</span>.</p>
        )}
        <div className="modal-actions">
          <button className="btn-delete" type="button" onClick={onConfirm}>Confirmar</button>
          <button className="btn-delete" type="button" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
