import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../auth/constants';
import './ResetPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams(); // Assuming the token is passed via URL parameters

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setMessage('La contraseña debe tener al menos 4 caracteres, 1 dígito, 1 símbolo y 1 mayúscula');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage('Tu contraseña ha sido restablecida exitosamente.');
      } else {
        setMessage('Hubo un error al intentar restablecer tu contraseña.');
      }
    } catch (error) {
      setMessage('Hubo un error al intentar restablecer tu contraseña.');
      console.error('Error:', error);
    }
  }

  return (
    <div className="reset-password-page">
      <div className="form-wrapper">
        <div className="form-container">
          <p className="title">Restablecer contraseña</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={() => setShowPassword(!showPassword)}
                className="password-icon"
              />
            </div>
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-icon"
              />
            </div>
            <button className="form-btn" type="submit">Restablecer contraseña</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
