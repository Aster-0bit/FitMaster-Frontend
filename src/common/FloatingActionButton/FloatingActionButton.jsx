import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => (
  <button className="fab" onClick={onClick}>
    <FontAwesomeIcon icon={faPlus} className="fa-2x" />
  </button>
);

export default FloatingActionButton;
