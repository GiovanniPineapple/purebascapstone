import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de que esto esté apuntando correctamente a tu contexto

const Login = () => {
  const { login } = useAuth(); // Accede a la función login desde el contexto de autenticación
  const [email, setEmail] = useState('');  // Aquí se inicializa la variable email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Asegúrate de que 'email' y 'password' se estén enviando correctamente
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      const { token, id, name, role, email: userEmail } = response.data;

      // Llamamos a la función 'login' y pasamos los datos
      login({ token, id, name, role, email: userEmail }); 

      // Redirige según el rol del usuario
      const roleRedirects = {
        admin: '/admin-dashboard',
        entrenador: '/trainer-dashboard',
        cliente: '/',
      };
      navigate(roleRedirects[role] || '/');
    } catch (error) {
      console.error('Error de inicio de sesión', error);
      alert(error.response?.data?.message || 'Error de conexión o credenciales incorrectas');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Aquí actualizas el estado de 'email'
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Aquí actualizas el estado de 'password'
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
