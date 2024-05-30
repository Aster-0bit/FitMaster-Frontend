import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';

const UserProfile = () => {
  const { getAccessToken } = useAuth();
  const [user, setUser] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const token = getAccessToken() // Reemplaza esto con tu token actual

  useEffect(() => {
    fetch('https://fitmaster-backend-production.up.railway.app/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      return setUser(data);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewName(user.name);
  };

  const handleSaveClick = () => {
    const token = getAccessToken();
    fetch('https://fitmaster-backend-production.up.railway.app/user/update', {
      method: 'PUT', // o 'PUT' según tu API
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: newName })
    })
    .then(response => response.json())
    .then(data => {
      setUser(prevUser => ({
        ...prevUser,
        name: data.user.name
      }));
      setIsEditing(false);
    })
    .catch(error => {
      console.error('Error updating user data:', error);
    });
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  return (
    <main className='content'>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>
        Nombre:&nbsp; 
        {isEditing ? (
          <input type="text" value={newName} onChange={handleChange} />
        ) : (
           user.name
        )}
      </p>
      {isEditing ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </main>
  );
};

export default UserProfile;
