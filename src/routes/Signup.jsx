import { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { API_URL } from '../auth/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Toast } from 'primereact/toast';
import Confetti from 'react-confetti';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres, 1 dígito, 1 símbolo (!@#$%^&*) y 1 mayúscula');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        console.log('Usuario registrado');
        setErrorMessage(''); // Clear error message on success
        setShowConfetti(true); // Show confetti on success
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso', life: 3000 });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('Error en el registro');
        setErrorMessage('Error en el registro');
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'El correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro correo electrónico.', life: 3000 });
      }
    } catch (error) {
      console.error('Error en el registro', error);
      setErrorMessage('Error en el registro');
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error en el registro', life: 3000 });
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="signup-page">
      {showConfetti && <Confetti />}
      <Toast ref={toast} />
      <div className="form-wrapper">
        <div className="form-container">
          <Link to="/" className="back-link"><FontAwesomeIcon icon={faChevronLeft} /> Atrás</Link>
          <p className="title">Crear cuenta</p>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="Contraseña"
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
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                placeholder="Repetir Contraseña"
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="form-btn" type="submit">Registrarse</button>
          </form>
          <p className="sign-up-label">
            ¿Ya tienes una cuenta?<span className="sign-up-link"><Link to="/login">Inicia sesión</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
}
