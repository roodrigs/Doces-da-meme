import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Tags, PlusCircle, Trash2, XCircle, PackagePlus, ArrowLeft, 
  Settings, Info, Landmark, FileUp, Cpu, Monitor, Smartphone,
  Hash, Clipboard, Calendar, DollarSign, Building2, User
} from 'lucide-react';
import '../styles/categoria.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function CategoriaManager() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoModelo, setNovoModelo] = useState({ categoriaId: '', nome: '' });
  
  // Estados para o novo formulário de Equipamento físico
  const [showEquipForm, setShowEquipForm] = useState(false);
  const [selectedCatForEquip, setSelectedCatForEquip] = useState(null);
  const [dadosEquip, setDadosEquip] = useState({
    itemTipo: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    ativo: '',
    patrimonio: '',
    imei: '',
    numeroChip: '',
    numeroPin: '',
    numeroPuk: '',
    possuiCarregador: 'Sim',
    fornecedorNome: '',
    fornecedorCnpj: '',
    dataCompra: '',
    valorCompra: '',
    vidaUtilMeses: '60',
  });
  const [notaFiscal, setNotaFiscal] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categoria`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleCreateCategoria = async (e) => {
    e.preventDefault();
    if (!novaCategoria) return;
    try {
      await axios.post(`${BASE_URL}/categoria`, { nome: novaCategoria });
      setNovaCategoria('');
      fetchCategorias();
      Swal.fire('Sucesso', 'Categoria criada!', 'success');
    } catch (error) {
      Swal.fire('Erro', 'Erro ao criar categoria.', 'error');
    }
  };

  const handleDeleteCategoria = async (id) => {
    const result = await Swal.fire({
      title: 'Excluir Categoria?',
      text: "Isso removerá todos os modelos e equipamentos vinculados!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc0032',
      confirmButtonText: 'Sim, excluir!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/categoria/${id}`);
        fetchCategorias();
        Swal.fire('Removido!', 'Categoria excluída.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Erro ao excluir categoria.', 'error');
      }
    }
  };

  const handleCreateModelo = async (e) => {
    e.preventDefault();
    if (!novoModelo.nome || !novoModelo.categoriaId) return;
    try {
      await axios.post(`${BASE_URL}/categoria/${novoModelo.categoriaId}/modelo`, { nome: novoModelo.nome });
      setNovoModelo({ ...novoModelo, nome: '' });
      fetchCategorias();
      Swal.fire('Sucesso', 'Modelo adicionado!', 'success');
    } catch (error) {
      Swal.fire('Erro', 'Erro ao criar modelo.', 'error');
    }
  };

  const handleDeleteModelo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/categoria/modelo/${id}`);
      fetchCategorias();
    } catch (error) {
      Swal.fire('Erro', 'Erro ao excluir modelo.', 'error');
    }
  };

  // Funções para cadastro de Equipamento Físico
  const openEquipForm = (cat) => {
    setSelectedCatForEquip(cat);
    setDadosEquip({
      ...dadosEquip,
      itemTipo: cat.nome,
      modelo: cat.modelos[0]?.nome || '',
      marca: '',
      fornecedorNome: '',
      fornecedorCnpj: '',
      dataCompra: '',
      valorCompra: '',
      vidaUtilMeses: '60'
    });
    setNotaFiscal(null);
    setShowEquipForm(true);
  };

  const handleEquipSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(dadosEquip).forEach(key => {
        formData.append(key, dadosEquip[key]);
      });
      if (notaFiscal) {
        formData.append('notaFiscal', notaFiscal);
      }

      await axios.post(`${BASE_URL}/equipamento`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Equipamento adicionado ao estoque!',
        icon: 'success',
        confirmButtonColor: '#dc0032'
      });
      setShowEquipForm(false);
      setDadosEquip({
        itemTipo: '', marca: '', modelo: '', numeroSerie: '', ativo: '', patrimonio: '',
        imei: '', numeroChip: '', numeroPin: '', numeroPuk: '', possuiCarregador: 'Sim',
        fornecedorNome: '', fornecedorCnpj: '', dataCompra: '', valorCompra: '', vidaUtilMeses: '60'
      });
      setNotaFiscal(null);
    } catch (error) {
      Swal.fire('Erro', error.response?.data?.message || 'Erro ao cadastrar', 'error');
    }
  };

  if (showEquipForm) {
    const tipo = selectedCatForEquip.nome.toLowerCase();
    const isMobile = tipo === 'celular' || tipo === 'tablet' || tipo.includes('smartphone');
    const isPC = tipo === 'notebook' || tipo.includes('pc') || tipo.includes('computador');

    return (
      <div className="categoria-container equip-form-page">
        <header className="form-header">
          <button className="btn-back" onClick={() => setShowEquipForm(false)}>
            <ArrowLeft size={20} />
            <span>Voltar para Categorias</span>
          </button>
          <div className="header-title">
            <PackagePlus size={32} color="#dc0032" />
            <div>
              <h1 style={{ fontSize: '1.5rem' }}>Cadastro de Unidade Física</h1>
              <p>Adicionando item: <strong>{selectedCatForEquip.nome}</strong></p>
            </div>
          </div>
        </header>
        
        <form onSubmit={handleEquipSubmit} className="modern-form">
          <section className="form-section">
            <div className="section-title">
              <Info size={20} />
              <h3>Identificação do Equipamento</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><Building2 size={16} /> Marca</label>
                <input 
                  name="marca" 
                  value={dadosEquip.marca} 
                  onChange={(e) => setDadosEquip({...dadosEquip, marca: e.target.value})} 
                  required 
                  placeholder="Ex: Dell, Apple..." 
                />
              </div>

              <div className="form-group">
                <label><Settings size={16} /> Modelo</label>
                <select 
                  name="modelo" 
                  value={dadosEquip.modelo} 
                  onChange={(e) => setDadosEquip({...dadosEquip, modelo: e.target.value})} 
                  required
                >
                  <option value="">Selecione o Modelo</option>
                  {selectedCatForEquip.modelos.map(m => (
                    <option key={m.id} value={m.nome}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><Hash size={16} /> Número de Série</label>
                <input 
                  name="numeroSerie" 
                  value={dadosEquip.numeroSerie} 
                  onChange={(e) => setDadosEquip({...dadosEquip, numeroSerie: e.target.value})} 
                  required 
                  placeholder="S/N"
                />
              </div>

              {isPC && (
                <>
                  <div className="form-group">
                    <label><Clipboard size={16} /> Ativo</label>
                    <input name="ativo" value={dadosEquip.ativo} onChange={(e) => setDadosEquip({...dadosEquip, ativo: e.target.value})} required placeholder="Ativo" />
                  </div>
                  <div className="form-group">
                    <label><Landmark size={16} /> Patrimônio</label>
                    <input name="patrimonio" value={dadosEquip.patrimonio} onChange={(e) => setDadosEquip({...dadosEquip, patrimonio: e.target.value})} required placeholder="Patrimônio" />
                  </div>
                </>
              )}

              {isMobile && (
                <>
                  <div className="form-group">
                    <label><Smartphone size={16} /> Número do Chip</label>
                    <input name="numeroChip" value={dadosEquip.numeroChip} onChange={(e) => setDadosEquip({...dadosEquip, numeroChip: e.target.value})} required placeholder="(00) 00000-0000" />
                  </div>
                  <div className="form-group">
                    <label><Cpu size={16} /> IMEI</label>
                    <input name="imei" value={dadosEquip.imei} onChange={(e) => setDadosEquip({...dadosEquip, imei: e.target.value})} placeholder="IMEI" />
                  </div>
                  <div className="form-group">
                    <label><Hash size={16} /> PIN</label>
                    <input name="numeroPin" value={dadosEquip.numeroPin} onChange={(e) => setDadosEquip({...dadosEquip, numeroPin: e.target.value})} required placeholder="PIN" />
                  </div>
                  <div className="form-group">
                    <label><Hash size={16} /> PUK</label>
                    <input name="numeroPuk" value={dadosEquip.numeroPuk} onChange={(e) => setDadosEquip({...dadosEquip, numeroPuk: e.target.value})} required placeholder="PUK" />
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="form-section">
            <div className="section-title">
              <Landmark size={20} />
              <h3>Compra e Rastreio</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label><Building2 size={16} /> Fornecedor</label>
                <input name="fornecedorNome" value={dadosEquip.fornecedorNome} onChange={(e) => setDadosEquip({...dadosEquip, fornecedorNome: e.target.value})} placeholder="Nome na NF" />
              </div>

              <div className="form-group">
                <label><Hash size={16} /> CNPJ</label>
                <input name="fornecedorCnpj" value={dadosEquip.fornecedorCnpj} onChange={(e) => setDadosEquip({...dadosEquip, fornecedorCnpj: e.target.value})} placeholder="CNPJ" />
              </div>

              <div className="form-group">
                <label><Calendar size={16} /> Data Compra</label>
                <input type="date" name="dataCompra" value={dadosEquip.dataCompra} onChange={(e) => setDadosEquip({...dadosEquip, dataCompra: e.target.value})} />
              </div>

              <div className="form-group">
                <label><DollarSign size={16} /> Valor (R$)</label>
                <input type="number" step="0.01" name="valorCompra" value={dadosEquip.valorCompra} onChange={(e) => setDadosEquip({...dadosEquip, valorCompra: e.target.value})} placeholder="0.00" />
              </div>

              <div className="form-group">
                <label><Calendar size={16} /> Vida Útil (meses)</label>
                <input type="number" name="vidaUtilMeses" value={dadosEquip.vidaUtilMeses} onChange={(e) => setDadosEquip({...dadosEquip, vidaUtilMeses: e.target.value})} placeholder="60" />
              </div>

              <div className="form-group">
                <label><FileUp size={16} /> Nota Fiscal</label>
                <div className="file-input-wrapper">
                  <input type="file" id="nf-upload" accept="application/pdf" onChange={(e) => setNotaFiscal(e.target.files[0])} />
                  <label htmlFor="nf-upload" className={`file-label ${notaFiscal ? 'has-file' : ''}`}>
                    <FileUp size={18} />
                    {notaFiscal ? (notaFiscal.name.length > 20 ? notaFiscal.name.substring(0, 17) + '...' : notaFiscal.name) : 'Anexar PDF'}
                  </label>
                </div>
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn-submit-modern">
              <PackagePlus size={20} />
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="categoria-container">
      <div className="categoria-header-main">
        <h2>
          <Monitor size={28} />
          Estrutura de Ativos
        </h2>
      </div>

      <div className="categoria-main-grid">
        {/* Coluna de Cadastro (Sidebar) */}
        <aside className="cadastro-sidebar">
          <div className="cadastro-card">
            <h3><Tags size={20} /> Nova Categoria</h3>
            <form onSubmit={handleCreateCategoria} className="form-stack">
              <input
                type="text"
                placeholder="Ex: Notebook, Celular..."
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                required
              />
              <button type="submit" className="btn-cadastrar">
                <PlusCircle size={18} /> Cadastrar
              </button>
            </form>
          </div>

          <div className="cadastro-card">
            <h3><Settings size={20} /> Novo Modelo</h3>
            <form onSubmit={handleCreateModelo} className="form-stack">
              <select
                value={novoModelo.categoriaId}
                onChange={(e) => setNovoModelo({ ...novoModelo, categoriaId: e.target.value })}
                required
              >
                <option value="">Selecione a Categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Ex: Dell Latitude, iPhone 15..."
                value={novoModelo.nome}
                onChange={(e) => setNovoModelo({ ...novoModelo, nome: e.target.value })}
                required
              />
              <button type="submit" className="btn-cadastrar">
                <PlusCircle size={18} /> Adicionar
              </button>
            </form>
          </div>
        </aside>

        {/* Coluna de Listagem (Grid de Cards) */}
        <div className="categorias-list-grid">
          {categorias.map((cat) => (
            <div key={cat.id} className="cat-item-card">
              <div className="cat-item-header">
                <div className="cat-name-badge">
                  <div className="cat-icon-box">
                    <Tags size={20} />
                  </div>
                  <h4>{cat.nome}</h4>
                </div>
                <button 
                  onClick={() => handleDeleteCategoria(cat.id)} 
                  className="btn-cat-delete" 
                  title="Excluir Categoria"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="modelos-container">
                <span className="section-label" style={{ marginBottom: '8px' }}>
                  <Info size={12} /> MODELOS VINCULADOS
                </span>
                <div className="modelos-tags">
                  {cat.modelos.length > 0 ? cat.modelos.map(mod => (
                    <span key={mod.id} className="modelo-tag-pill">
                      {mod.nome}
                      <button 
                        onClick={() => handleDeleteModelo(mod.id)} 
                        className="btn-del-modelo" 
                        title="Remover Modelo"
                      >
                        <XCircle size={14} />
                      </button>
                    </span>
                  )) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Nenhum modelo cadastrado.
                    </span>
                  )}
                </div>
              </div>

              <div className="cat-actions-footer">
                <button 
                  onClick={() => openEquipForm(cat)} 
                  className="btn-estoque-add" 
                  disabled={cat.modelos.length === 0}
                >
                  <PackagePlus size={18} /> + Unidade Física
                </button>
              </div>
            </div>
          ))}

          {categorias.length === 0 && (
            <div className="empty-state-estoque">
              <Tags size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>Nenhuma categoria encontrada.</p>
              <small>Utilize o formulário ao lado para começar.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriaManager;
