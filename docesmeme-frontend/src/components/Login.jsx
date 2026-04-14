import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Lock, LogIn, Cookie, Sun, Moon, User, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/login.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Login({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme + '-theme';
  }, [theme]);

  // Update mode if location state changes
  useEffect(() => {
    if (location.state?.mode) {
      setIsLogin(location.state.mode !== 'register');
    }
  }, [location.state]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('isAdmin', response.data.isAdmin.toString());
        localStorage.setItem('nomeUsuario', response.data.name || '');
        localStorage.setItem('userId', response.data.sub || '');
        localStorage.setItem('loggedIn', 'true');
        
        onLogin();
        
        if (response.data.isAdmin) {
          navigate('/dashboard');
        } else {
          navigate('/loja');
        }
      } else {
        // Handle Register
        await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
        
        Swal.fire({
          icon: 'success',
          title: 'Conta criada!',
          text: 'Agora você pode entrar com seu e-mail e senha.',
          confirmButtonColor: '#8B5CF6'
        });
        
        setIsLogin(true); // Switch to login after successful registration
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      let errorMessage = isLogin ? 'E-mail ou senha incorretos.' : 'Erro ao criar conta. Tente outro e-mail.';
      
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message) 
          ? error.response.data.message[0] 
          : error.response.data.message;
      } else if (!error.response) {
        errorMessage = 'Servidor indisponível.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Ops!',
        text: errorMessage,
        confirmButtonColor: '#8B5CF6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}-theme`}>
      <button 
        onClick={() => navigate('/loja')} 
        className="back-btn" 
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          background: 'white', 
          border: '1px solid #DDD6FE', 
          padding: '10px 15px', 
          borderRadius: '50px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: '#8B5CF6', 
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          zIndex: 10
        }}
      >
        <ArrowLeft size={18} /> Voltar para a Loja
      </button>

      <button onClick={toggleTheme} className="login-theme-toggle" type="button">
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      <div className="login-container">
        <div className="login-brand-section" style={{ background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)' }}>
          <div className="brand-content">
            <Cookie size={80} color="white" strokeWidth={1.5} />
            <h1 style={{ fontFamily: 'cursive', fontSize: '3rem' }}>Brownie da Meme</h1>
            <p>O sabor que derrete na boca!</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-box">
            <div className="form-header">
              <h2>{isLogin ? 'Bem-vinda(o)!' : 'Criar Conta'}</h2>
              <p>{isLogin ? 'Entre para fazer seus pedidos deliciosos.' : 'Cadastre-se para começar a pedir.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="modern-login-form">
              {!isLogin && (
                <div className="input-group">
                  <label>Nome Completo</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={20} />
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

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

              <button type="submit" className="btn-login-modern" disabled={loading} style={{ backgroundColor: '#8B5CF6' }}>
                {loading ? (
                  <div className="loader-spinner"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar' : 'Cadastrar'}</span>
                    <LogIn size={20} />
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ background: 'none', border: 'none', color: '#8B5CF6', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
