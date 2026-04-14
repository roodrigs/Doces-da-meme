import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
  Cookie,
  LogIn,
  UserPlus
} from 'lucide-react';

import Usuarios from './components/usuario';
import EquipamentoManager from './components/EquipamentoManager';
import Dashboard from './components/Dashboard';
import Storefront from './components/Storefront';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="cart-modal-overlay" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(30, 27, 75, 0.6)', 
      zIndex: 4000, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backdropFilter: 'blur(8px)' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '24px', 
        width: '90%', 
        maxWidth: '400px', 
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative',
        border: '1px solid #DDD6FE'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED' }}>
          <X size={24} />
        </button>
        
        <div style={{ marginBottom: '25px' }}>
          <div style={{ background: '#F5F3FF', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Cookie size={40} color="#8B5CF6" />
          </div>
          <h2 style={{ color: '#1E1B4B', margin: '0 0 10px 0', fontFamily: 'cursive' }}>Bem-vindo(a)!</h2>
          <p style={{ color: '#7C3AED' }}>Escolha como deseja continuar para saborear nossos brownies.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/login" state={{ mode: 'login' }} onClick={onClose} style={{ 
            backgroundColor: '#8B5CF6', 
            color: 'white', 
            padding: '14px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'transform 0.2s'
          }}>
            <LogIn size={20} /> Entrar na minha conta
          </Link>
          
          <Link to="/login" state={{ mode: 'register' }} onClick={onClose} style={{ 
            backgroundColor: '#F5F3FF', 
            color: '#8B5CF6', 
            padding: '14px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            border: '2px solid #DDD6FE'
          }}>
            <UserPlus size={20} /> Criar nova conta
          </Link>
        </div>
      </div>
    </div>
  );
}

function TopHeader({ isLoggedIn, onLoginClick, handleLogout }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage) return null;

  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      display: 'flex',
      gap: '15px'
    }}>
      {!isLoggedIn ? (
        <button 
          onClick={onLoginClick}
          style={{
            backgroundColor: 'white',
            color: '#8B5CF6',
            border: '2px solid #DDD6FE',
            padding: '10px 20px',
            borderRadius: '50px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.3s ease'
          }}
          className="login-trigger-btn"
        >
          <LogIn size={18} /> Entrar / Cadastrar
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', padding: '5px 5px 5px 15px', borderRadius: '50px', border: '1px solid #DDD6FE', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ color: '#1E1B4B', fontWeight: 'bold', fontSize: '0.9rem' }}>Olá, {localStorage.getItem('nomeUsuario') || 'Meme'}</span>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#F5F3FF',
              color: '#EF4444',
              border: 'none',
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar({ isLoggedIn, isAdmin, handleLogout, theme, toggleTheme }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Only show sidebar for Admin or if logged in (optional, keeping it mostly for Admin now)
  const showSidebar = isLoggedIn && isAdmin && location.pathname !== '/login';

  if (!showSidebar) return null;

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/estoque', label: 'Meus Brownies', icon: <Package size={20} /> },
    { path: '/usuarios', label: 'Clientes', icon: <Users size={20} /> },
    { path: '/loja', label: 'Ver Loja', icon: <Cookie size={20} /> }
  ];

  return (
    <>
      <button className="mobile-toggle" onClick={toggleMobileSidebar} style={{ backgroundColor: '#8B5CF6' }}>
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`} style={{ background: 'linear-gradient(180deg, #A78BFA, #8B5CF6)' }}>
        <div className="sidebar-header" style={{ padding: '30px 20px', textAlign: 'center' }}>
          <Cookie size={40} color="white" style={{ marginBottom: '10px' }} />
          <h2 style={{ color: 'white', fontFamily: 'cursive', fontSize: '1.4rem' }}>Painel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? (
              <><Moon size={20} /> <span className="nav-label">Modo Escuro</span></>
            ) : (
              <><Sun size={20} /> <span className="nav-label">Modo Claro</span></>
            )}
          </button>
          
          <button onClick={handleLogout} className="nav-item logout" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">Sair</span>
          </button>
        </div>
      </aside>

      {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('loggedIn') === 'true';
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(logged);
    setIsAdmin(admin);
    document.body.className = theme + '-theme';

    const handleOpenModal = () => setIsLoginModalOpen(true);
    window.addEventListener('openLoginModal', handleOpenModal);
    return () => window.removeEventListener('openLoginModal', handleOpenModal);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(admin);
    localStorage.setItem('loggedIn', 'true');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <div className={`App ${theme}-theme ${isLoggedIn && isAdmin ? 'with-sidebar' : ''}`}>
        <Sidebar 
          isLoggedIn={isLoggedIn} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <TopHeader 
          isLoggedIn={isLoggedIn} 
          onLoginClick={() => setIsLoginModalOpen(true)} 
          handleLogout={handleLogout}
        />

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />

        <main className="content-area" style={{ 
          backgroundColor: theme === 'light' ? '#F5F3FF' : '#1e1b4b',
          minHeight: '100vh',
          position: 'relative'
        }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  {isAdmin ? <Dashboard /> : <Navigate to="/loja" />}
                </PrivateRoute>
              }
            />

            <Route path="/loja" element={<Storefront />} />

            {isAdmin && (
              <>
                <Route
                  path="/estoque"
                  element={
                    <PrivateRoute isLoggedIn={isLoggedIn}>
                      <EquipamentoManager />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute isLoggedIn={isLoggedIn}>
                      <Usuarios />
                    </PrivateRoute>
                  }
                />
              </>
            )}

            <Route
              path="/"
              element={isLoggedIn && isAdmin ? <Navigate to="/dashboard" /> : <Storefront />}
            />

            <Route
              path="*"
              element={<Storefront />}
            />
          </Routes>
          
          <footer className="main-footer" style={{ borderTop: '1px solid #DDD6FE', padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: '#7C3AED', fontWeight: 'bold' }}>&copy; {new Date().getFullYear()} Brownie da Meme - Doçuras com Amor 💜</p>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
