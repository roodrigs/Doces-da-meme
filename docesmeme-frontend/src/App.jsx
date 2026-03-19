import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate
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
  Cookie
} from 'lucide-react';

import Usuarios from './components/usuario';
import EquipamentoManager from './components/EquipamentoManager';
import Dashboard from './components/Dashboard';
import Storefront from './components/Storefront';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import './styles/App.css';

function Sidebar({ isLoggedIn, isAdmin, handleLogout, theme, toggleTheme }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const showSidebar = isLoggedIn && location.pathname !== '/login';

  if (!showSidebar) return null;

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const navItems = [];
  
  if (isAdmin) {
    navItems.push(
      { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/estoque', label: 'Meus Brownies', icon: <Package size={20} /> },
      { path: '/usuarios', label: 'Clientes', icon: <Users size={20} /> }
    );
  } else {
    navItems.push(
      { path: '/loja', label: 'Vitrine', icon: <Cookie size={20} /> }
    );
  }

  return (
    <>
      <button className="mobile-toggle" onClick={toggleMobileSidebar} style={{ backgroundColor: '#FF1493' }}>
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`} style={{ background: 'linear-gradient(180deg, #FF69B4, #FF1493)' }}>
        <div className="sidebar-header" style={{ padding: '30px 20px', textAlign: 'center' }}>
          <Cookie size={40} color="white" style={{ marginBottom: '10px' }} />
          <h2 style={{ color: 'white', fontFamily: 'cursive', fontSize: '1.4rem' }}>Brownie da Meme</h2>
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
          
          <Link to="/login" onClick={handleLogout} className="nav-item logout">
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">Sair</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const logged = localStorage.getItem('loggedIn') === 'true';
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(logged);
    setIsAdmin(admin);
    document.body.className = theme + '-theme';
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
      <div className={`App ${theme}-theme ${isLoggedIn ? 'with-sidebar' : ''}`}>
        <Sidebar 
          isLoggedIn={isLoggedIn} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout} 
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="content-area" style={{ backgroundColor: theme === 'light' ? '#FFF0F5' : '#1A000F' }}>
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

            <Route
              path="/loja"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Storefront />
                </PrivateRoute>
              }
            />

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
              element={isLoggedIn ? (isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/loja" />) : <Login onLogin={handleLogin} />}
            />

            <Route
              path="*"
              element={isLoggedIn ? (isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/loja" />) : <Login onLogin={handleLogin} />}
            />
          </Routes>
          
          {isLoggedIn && (
            <footer className="main-footer" style={{ borderTop: '1px solid #FFC0CB' }}>
              <p style={{ color: '#DB7093', fontWeight: 'bold' }}>&copy; {new Date().getFullYear()} Brownie da Meme - Doçuras com Amor 💖</p>
            </footer>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
