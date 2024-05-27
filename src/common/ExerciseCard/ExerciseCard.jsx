import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaHeart, FaRegHeart } from 'react-icons/fa';
import './ExerciseCard.css';

const ExerciseCard = ({ exerciseP_id, name, repetitions, sets, rest, intensity, duration, note, isFavorite, onEdit, onDelete, onToggleFavorite }) => {
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(isFavorite === 1);

  useEffect(() => {
    setIsLiked(isFavorite === 1);
  }, [isFavorite]);

  const toggleNoteVisibility = () => {
    setIsNoteVisible(!isNoteVisible);
  };

  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onToggleFavorite(exerciseP_id, newLikedState);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="exercise-name">{name}</h2>
        <div className="card-actions">
          <button className="edit-btn" onClick={onEdit}>
            <FaEdit />
          </button>
          <button className="delete-btn" onClick={onDelete}>
            <FaTrash />
          </button>
          <button className="like-btn" onClick={toggleLike}>
            {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        </div>
      </div>
      <div className="card-body">
        <ul className="exercise-details">
          <li><span>Repeticiones:</span> {repetitions}</li>
          <li><span>Series:</span> {sets}</li>
          <li><span>Descanso:</span> {rest}</li>
          <li><span>Intensidad:</span> {intensity}</li>
          <li><span>Duración:</span> {duration}</li>
        </ul>
        <div className="note-section">
          <button className="note-toggle" onClick={toggleNoteVisibility}>
            Nota {isNoteVisible ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isNoteVisible && <p className="note-content">{note}</p>}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
