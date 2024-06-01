import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import './Profile.css';

const UserProfile = () => {
  const { getAccessToken, logout } = useAuth();
  const [user, setUser] = useState({ name: '', email: '', date: '', favs: 0, excs: 0 });
  const [quote, setQuote] = useState('');
  const [translatedQuote, setTranslatedQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const toast = useRef(null);
  const token = getAccessToken();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://fitmaster-backend-production.up.railway.app/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchQuote = async () => {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'ce5674234fmshb63903b41d58200p1e51a4jsn648ab1d5984c',
          'X-RapidAPI-Host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch('https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info', options);
        const data = await response.json();
        setQuote(`${data.text} - ${data.author}`);
        translateQuote(`${data.text} - ${data.author}`);
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    const translateQuote = async (text) => {
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'ce5674234fmshb63903b41d58200p1e51a4jsn648ab1d5984c',
          'X-RapidAPI-Host': 'google-translator9.p.rapidapi.com'
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'es',
          format: 'text'
        })
      };

      try {
        const response = await fetch('https://google-translator9.p.rapidapi.com/v2', options);
        const data = await response.json();
        setTranslatedQuote(data.data.translations[0].translatedText);
      } catch (error) {
        console.error('Error translating quote:', error);
      }
    };

    const fetchData = async () => {
      await fetchUserData();
      await fetchQuote();
      setLoading(false);
    };

    fetchData();
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewName(user.name);
  };

  const handleSaveClick = async () => {
    if (newName.length < 3) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'El nombre debe tener al menos 3 caracteres', life: 3000 });
      return;
    }
    try {
      const response = await fetch('https://fitmaster-backend-production.up.railway.app/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (response.ok) {
        const updatedUser = { ...user, name: newName };
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Error updating user name');
      }
    } catch (error) {
      console.error('Error updating user name', error);
    }
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  return (
    <main className="content">
      <Toast ref={toast} />
      {loading ? (
        <div className="spinner-container">
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <header className="profile-header">
            <div className="profile-header-content">
              <div className="profile-avatar">
                <div className="profile-avatar-fallback">{user.name[0]}</div>
              </div>
              <div>
                <div className="profile-name">
                  {isEditing ? (
                    <input type="text" value={newName} onChange={handleChange} />
                  ) : (
                    user.name
                  )}
                </div>
                <div className="profile-email">{user.email}</div>
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <button className="btn" onClick={handleSaveClick}>Guardar</button>
              ) : (
                <button className="btn" onClick={handleEditClick}>Editar</button>
              )}
              <button className="btn" onClick={logout}>Cerrar sesión</button>
            </div>
          </header>
          <div className="profile-main">
            <div className="profile-info">
              <div className="profile-info-item">
                <span className="profile-info-label">Fecha de Registro:</span>
                <span className="profile-info-value">{user.date}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Favoritos:</span>
                <span className="profile-info-value">{user.favs}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Ejercicios:</span>
                <span className="profile-info-value">{user.excs}</span>
              </div>
            </div>
            <div className="profile-quote">
              <h2 className="profile-quote-title">Frase del Día</h2>
              <p className="profile-quote-content">{translatedQuote}</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default UserProfile;
