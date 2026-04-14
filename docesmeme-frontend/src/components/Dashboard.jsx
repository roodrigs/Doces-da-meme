import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import '../styles/dashboard.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const COLORS = ['#8B5CF6', '#A78BFA', '#7C3AED', '#6D28D9', '#C4B5FD'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get(`${BASE_URL}/dashboard/stats`),
        axios.get(`${BASE_URL}/dashboard/revenue-history`)
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading" style={{ color: '#8B5CF6' }}>Calculando faturamento...</div>;

  return (
    <div className="dashboard-container" style={{ padding: 'clamp(10px, 4vw, 20px)' }}>
      <header className="dashboard-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontFamily: 'cursive', color: '#8B5CF6', fontSize: 'clamp(1.5rem, 6vw, 2rem)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <LayoutDashboard size={window.innerWidth < 480 ? 24 : 32} />
          <span>Painel de Vendas</span>
        </h2>
        <p style={{ color: '#7C3AED', fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>Acompanhe o crescimento das suas doçuras!</p>
      </header>

      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
        gap: '20px' 
      }}>
        <div className="stat-card revenue">
          <div className="stat-icon" style={{ backgroundColor: '#8B5CF6' }}><DollarSign color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Faturamento Total</span>
            <span className="stat-value" style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)' }}>R$ {stats?.totalRevenue?.toFixed(2)}</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon" style={{ backgroundColor: '#A78BFA' }}><ShoppingBag color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Total de Pedidos</span>
            <span className="stat-value" style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)' }}>{stats?.totalOrders}</span>
          </div>
        </div>

        <div className="stat-card items">
          <div className="stat-icon" style={{ backgroundColor: '#6D28D9' }}><Package color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Produtos</span>
            <span className="stat-value" style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)' }}>{stats?.productsCount}</span>
          </div>
        </div>
      </div>

      <div className="charts-section" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.1)', overflow: 'hidden' }}>
          <h3 style={{ color: '#6D28D9', marginBottom: '20px', fontSize: '1.1rem' }}><TrendingUp size={18} /> Receita (30 dias)</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F3FF" />
                <XAxis dataKey="date" hide />
                <YAxis width={40} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.1)', overflow: 'hidden' }}>
          <h3 style={{ color: '#6D28D9', marginBottom: '20px', fontSize: '1.1rem' }}>Mais Vendidos</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth < 480 ? 40 : 60}
                  outerRadius={window.innerWidth < 480 ? 60 : 80}
                  paddingAngle={5}
                  dataKey="totalSold"
                >
                  {stats?.topProducts?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-activity" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#6D28D9', marginBottom: '15px', fontSize: '1.2rem' }}>Top Brownies</h3>
        <div className="top-products-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {stats?.topProducts?.map((p, i) => (
            <div key={i} className="top-product-pill" style={{ 
              background: 'white', 
              padding: '8px 16px', 
              borderRadius: '30px', 
              border: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              flex: window.innerWidth < 480 ? '1 1 100%' : 'none'
            }}>
              <span style={{ fontWeight: 'bold', color: '#8B5CF6' }}>#{i+1}</span>
              <span style={{ color: '#1E1B4B', fontWeight: '500' }}>{p.name}</span>
              <span style={{ color: '#7C3AED', fontSize: '0.8rem' }}>({p.totalSold} vendidos)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
