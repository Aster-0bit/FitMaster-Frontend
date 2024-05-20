import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../auth/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
      } else {
        setMessage('Hubo un error al intentar enviar el correo electrónico.');
      }
    } catch (error) {
      setMessage('Hubo un error al intentar enviar el correo electrónico.');
      console.error('Error:', error);
    }
  }

  return (
    <div className="forgot-password-page">
      <div className="form-wrapper">
        <div className="form-container">
          <Link to="/login" className="back-link"><FontAwesomeIcon icon={faChevronLeft} /> Atrás</Link>
          <p className="title">Recuperar contraseña</p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="form-btn" type="submit">Enviar</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
