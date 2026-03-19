import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Lock, LogIn, Cookie, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme + '-theme';
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('isAdmin', response.data.isAdmin.toString());
      localStorage.setItem('nomeUsuario', response.data.name || '');
      localStorage.setItem('userId', response.data.sub || '');
      localStorage.setItem('loggedIn', 'true');
      
      onLogin();
      navigate('/loja');
    } catch (error) {
      console.error('Erro de login:', error);
      let errorMessage = 'E-mail ou senha incorretos.';
      
      if (!error.response) {
        errorMessage = 'Servidor indisponível.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Ops!',
        text: errorMessage,
        confirmButtonColor: '#ff1493'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}-theme`}>
      <button onClick={toggleTheme} className="login-theme-toggle" type="button">
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      <div className="login-container">
        <div className="login-brand-section" style={{ background: 'linear-gradient(135deg, #ff69b4, #ff1493)' }}>
          <div className="brand-content">
            <Cookie size={80} color="white" strokeWidth={1.5} />
            <h1 style={{ fontFamily: 'cursive', fontSize: '3rem' }}>Brownie da Meme</h1>
            <p>O sabor que derrete na boca!</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-box">
            <div className="form-header">
              <h2>Bem-vinda(o)!</h2>
              <p>Entre para fazer seus pedidos deliciosos.</p>
            </div>

            <form onSubmit={handleSubmit} className="modern-login-form">
              <div className="input-group">
                <label>E-mail</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Senha</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-modern" disabled={loading} style={{ backgroundColor: '#ff1493' }}>
                {loading ? (
                  <div className="loader-spinner"></div>
                ) : (
                  <>
                    <span>Entrar</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
