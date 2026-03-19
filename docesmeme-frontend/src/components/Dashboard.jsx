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
const COLORS = ['#FF1493', '#FF69B4', '#DB7093', '#C71585', '#FFB6C1'];

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

  if (loading) return <div className="loading" style={{ color: '#FF1493' }}>Calculando faturamento...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2 style={{ fontFamily: 'cursive', color: '#FF1493', fontSize: '2rem' }}>
          <LayoutDashboard style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Painel de Vendas - Brownie da Meme
        </h2>
        <p style={{ color: '#DB7093' }}>Acompanhe o crescimento das suas doçuras!</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon" style={{ backgroundColor: '#FF1493' }}><DollarSign color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Faturamento Total</span>
            <span className="stat-value">R$ {stats?.totalRevenue?.toFixed(2)}</span>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon" style={{ backgroundColor: '#FF69B4' }}><ShoppingBag color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Total de Pedidos</span>
            <span className="stat-value">{stats?.totalOrders}</span>
          </div>
        </div>

        <div className="stat-card items">
          <div className="stat-icon" style={{ backgroundColor: '#C71585' }}><Package color="white" /></div>
          <div className="stat-info">
            <span className="stat-label">Produtos Cadastrados</span>
            <span className="stat-value">{stats?.productsCount}</span>
          </div>
        </div>
      </div>

      <div className="charts-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(255,182,193,0.1)' }}>
          <h3 style={{ color: '#C71585', marginBottom: '20px' }}><TrendingUp size={18} /> Histórico de Receita (30 dias)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF0F5" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#FF1493" strokeWidth={3} dot={{ fill: '#FF1493' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(255,182,193,0.1)' }}>
          <h3 style={{ color: '#C71585', marginBottom: '20px' }}>Mais Vendidos</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="totalSold"
                >
                  {stats?.topProducts?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="recent-activity" style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#C71585', marginBottom: '15px' }}>Top Brownies</h3>
        <div className="top-products-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {stats?.topProducts?.map((p, i) => (
            <div key={i} className="top-product-pill" style={{ 
              background: 'white', 
              padding: '10px 20px', 
              borderRadius: '30px', 
              border: '1px solid #FFC0CB',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontWeight: 'bold', color: '#FF1493' }}>#{i+1}</span>
              <span style={{ color: '#4B0082' }}>{p.name}</span>
              <span style={{ color: '#DB7093', fontSize: '0.8rem' }}>({p.totalSold} vendas)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
