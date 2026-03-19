import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FileUp } from 'lucide-react';
import '../styles/formulario.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Formulario() {
  const [categorias, setCategorias] = useState([]);
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    matricula: '',
    departamento: '',
    itemTipo: '',
    equipamentoId: '',
    operador: '',
    devolucaoPrevista: '',
    arquivo: null,
  });

  useEffect(() => {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
      setDados((prev) => ({ ...prev, operador: nomeUsuario }));
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (dados.itemTipo) {
      fetchEquipamentosDisponiveis(dados.itemTipo);
    }
  }, [dados.itemTipo]);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categoria`);
      setCategorias(response.data);
      if (response.data.length > 0) {
        setDados(prev => ({ ...prev, itemTipo: response.data[0].nome }));
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchEquipamentosDisponiveis = async (categoria) => {
    try {
      const res = await axios.get(`${BASE_URL}/equipamento/disponiveis`, {
        params: { categoria }
      });
      setEquipamentosDisponiveis(res.data);
      setDados(prev => ({ ...prev, equipamentoId: '' }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    setDados((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dados.nome || !dados.email || !dados.matricula || !dados.equipamentoId) {
      Swal.fire('Erro', 'Preencha os campos obrigatórios e selecione um equipamento.', 'error');
      return;
    }

    if (!dados.arquivo) {
      Swal.fire('Erro', 'Por favor, selecione o Termo de Uso e Responsabilidade.', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(dados).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value);
    });

    try {
      await axios.post(`${BASE_URL}/formulario`, formData);
      Swal.fire('Sucesso', 'Empréstimo realizado com sucesso!', 'success');

      setDados({
        ...dados,
        nome: '',
        email: '',
        matricula: '',
        departamento: '',
        equipamentoId: '',
        devolucaoPrevista: '',
        arquivo: null,
      });

      fetchEquipamentosDisponiveis(dados.itemTipo);
      document.getElementById('input-arquivo').value = '';
    } catch (error) {
      Swal.fire('Erro', error.response?.data?.message || 'Falha ao realizar empréstimo.', 'error');
    }
  };

  return (
    <div className="formulario-container">
      <h2>Realizar Empréstimo de Ativo</h2>
      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-section">
          <div className="form-section-title">👤 Dados do Colaborador</div>
          <div className="form-row">
            <div className="form-group">
              <label>Nome Completo:</label>
              <input name="nome" placeholder="Nome do colaborador" value={dados.nome} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label>E-mail Corporativo:</label>
              <input type="email" name="email" placeholder="email@dominio" value={dados.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Matrícula:</label>
              <input name="matricula" placeholder="000000" value={dados.matricula} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Departamento:</label>
              <input name="departamento" placeholder="Ex: Logística, TI..." value={dados.departamento} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">📦 Seleção do Equipamento</div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoria:</label>
              <select name="itemTipo" value={dados.itemTipo} onChange={handleChange}>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Equipamento Disponível:</label>
              <select name="equipamentoId" value={dados.equipamentoId} onChange={handleChange} required>
                <option value="">Selecione um item do estoque</option>
                {equipamentosDisponiveis.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.marca} {eq.modelo} - S/N: {eq.numeroSerie} {eq.patrimonio ? `(PAT: ${eq.patrimonio})` : ''}
                  </option>
                ))}
              </select>
              {equipamentosDisponiveis.length === 0 && (
                <small style={{ color: '#dc0032', fontWeight: 'bold' }}>⚠️ Nenhum item disponível nesta categoria.</small>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">📅 Prazos e Documentação</div>
          <div className="form-row">
            <div className="form-group">
              <label>Previsão de Devolução:</label>
              <input type="date" name="devolucaoPrevista" value={dados.devolucaoPrevista} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Termo de Responsabilidade (PDF):</label>
              <div className="file-input-container">
                <input 
                  id="input-arquivo" 
                  type="file" 
                  name="arquivo" 
                  accept="application/pdf" 
                  onChange={handleChange} 
                  required 
                  className="hidden-file-input"
                />
                <label htmlFor="input-arquivo" className={`custom-file-label ${dados.arquivo ? 'file-selected' : ''}`}>
                  <FileUp size={20} />
                  <span>{dados.arquivo ? dados.arquivo.name : 'Selecionar Termo PDF'}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-submit-loan">Confirmar Empréstimo de Ativo</button>
      </form>
    </div>
  );
}

export default Formulario;
