// src/components/Auth.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAuth = async () => {
    setError(null);
    if (!validateEmail(email)) {
      setError("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redireccionar o realizar alguna acción después de la autenticación exitosa
    } catch (error) {
      setError(`Error durante la autenticación: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</h1>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</button>
      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;