import React, { useState, useEffect } from 'react';
import { Eye, Search, Calendar, User, Hash, Box, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/cadastroEquip.css';

function ControleFormularios() {
  const [formularios, setFormularios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [buscarGeral, setBuscarGeral] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/formulario`);
      const ordenado = response.data.sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
      );
      setFormularios(ordenado);
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoDevolvido = async (id) => {
    const resultado = await Swal.fire({
      title: 'Confirmar devolução?',
      text: 'O equipamento voltará para o estoque como disponível.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      confirmButtonText: 'Sim, devolver',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.patch(`${BASE_URL}/formulario/${id}/devolver`);
      fetchFormularios();
      Swal.fire('Sucesso', 'Equipamento devolvido ao estoque.', 'success');
    } catch (error) {
      Swal.fire('Erro', 'Falha ao processar devolução.', 'error');
    }
  };

  const filtrarLista = (lista, termo) => {
    return lista.filter((form) => {
      const eq = form.equipamento;
      const matchesTipo = filtroTipo === 'todos' || eq?.itemTipo === filtroTipo;
      const campos = [
        form.nome,
        form.matricula,
        eq?.marca,
        eq?.modelo,
        eq?.numeroSerie,
        eq?.patrimonio
      ];
      const matchesBusca = termo === '' || campos.some((campo) => campo?.toLowerCase().includes(termo.toLowerCase()));
      return matchesTipo && matchesBusca;
    });
  };

  const emprestados = filtrarLista(formularios.filter((form) => !form.devolvidoEm), buscarGeral);
  const devolvidos = filtrarLista(formularios.filter((form) => form.devolvidoEm), buscarGeral);

  const renderCard = (form, devolvido = false) => {
    const eq = form.equipamento;
    return (
      <div key={form.id} className={`loan-card ${devolvido ? 'devolvido' : ''}`}>
        <div className="card-header">
          <div className="user-badge">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <h4>{form.nome}</h4>
              <span className="matricula">ID: {form.matricula}</span>
            </div>
          </div>
          <div className={`status-pill ${devolvido ? 'pill--devolvido' : 'pill--aberto'}`}>
            {devolvido ? <CheckCircle size={14} /> : <Clock size={14} />}
            {devolvido ? 'Devolvido' : 'Em Aberto'}
          </div>
        </div>
        
        <div className="card-body">
          <div className="info-section">
            <span className="section-label"><Box size={14} /> EQUIPAMENTO</span>
            <div className="asset-box">
              <div className="asset-main">{eq?.marca} {eq?.modelo}</div>
              <div className="asset-sub">
                <span>{eq?.itemTipo}</span>
                <span className="dot"></span>
                <span>S/N: {eq?.numeroSerie}</span>
              </div>
              <div className="asset-sub" style={{ marginTop: '4px', fontStyle: 'italic', color: '#666' }}>
                <span>Operador: {form.operador || 'Sistema'}</span>
              </div>
              {(eq?.patrimonio || eq?.ativo) && (
                <div className="asset-tags">
                  {eq?.patrimonio && <span className="tag">PAT: {eq?.patrimonio}</span>}
                  {eq?.ativo && <span className="tag">ATIVO: {eq?.ativo}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="dates-grid">
            <div className="date-box">
              <span className="section-label">RETIRADA</span>
              <div className="date-content">
                <Calendar size={14} className="text-muted" />
                <span>{new Date(form.criadoEm).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="date-box">
              <span className="section-label">{devolvido ? 'DEVOLUÇÃO' : 'PREVISÃO'}</span>
              <div className="date-content">
                <Clock size={14} className={devolvido ? 'text-success' : 'text-warning'} />
                <span>
                  {devolvido 
                    ? new Date(form.devolvidoEm).toLocaleDateString() 
                    : (form.devolucaoPrevista ? new Date(form.devolucaoPrevista).toLocaleDateString() : '—')
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-actions">
          {form.arquivoUrl && (
            <button 
              className="action-btn btn-secondary" 
              onClick={() => {
                const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
                const fileUrl = `${cleanBaseUrl}${form.arquivoUrl}`;
                window.open(fileUrl, '_blank');
              }}
            >
              <Eye size={16} /> Ver Termo
            </button>
          )}
          {!devolvido && (
            <button className="action-btn btn-primary" onClick={() => marcarComoDevolvido(form.id)}>
              <CheckCircle size={16} /> Devolver
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="controle-formularios">
      <h2>Controle de Empréstimos</h2>
      
      <div className="controls-row">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, série, patrimônio..." 
            value={buscarGeral}
            onChange={(e) => setBuscarGeral(e.target.value)}
          />
        </div>

        <select 
          className="filter-select" 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todas Categorias</option>
          <option value="Notebook">Notebooks</option>
          <option value="Celular">Celulares</option>
          <option value="Tablet">Tablets</option>
        </select>
      </div>

      <div className="section-header">
        <Clock size={20} color="#dc0032" />
        <h3>Empréstimos em Aberto ({emprestados.length})</h3>
      </div>
      
      <div className="grid-cards">
        {emprestados.length > 0 ? (
          emprestados.map(f => renderCard(f))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            Nenhum empréstimo ativo encontrado.
          </div>
        )}
      </div>

      <div className="section-header" style={{ marginTop: '50px' }}>
        <CheckCircle size={20} color="#10b981" />
        <h3>Histórico / Devolvidos ({devolvidos.length})</h3>
      </div>
      
      <div className="grid-cards">
        {devolvidos.length > 0 ? (
          devolvidos.map(f => renderCard(f, true))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            O histórico está vazio.
          </div>
        )}
      </div>
    </div>
  );
}

export default ControleFormularios;
