import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, Edit, Trash2, Shield, User, Users } from 'lucide-react';
import '../styles/usuario.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ name: '', email: '', password: '', role: 'CLIENT' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/usuarios`, getHeaders());
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/usuarios/${editingId}`, novoUsuario, getHeaders());
        Swal.fire('Sucesso', 'Usuário atualizado!', 'success');
      } else {
        await axios.post(`${BASE_URL}/usuarios`, novoUsuario, getHeaders());
        Swal.fire('Sucesso', 'Usuário criado!', 'success');
      }
      setNovoUsuario({ name: '', email: '', password: '', role: 'CLIENT' });
      setEditingId(null);
      fetchUsuarios();
    } catch (error) {
      Swal.fire('Erro', 'Ocorreu um erro ao salvar.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff1493',
      confirmButtonText: 'Sim, excluir!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/usuarios/${id}`, getHeaders());
        fetchUsuarios();
        Swal.fire('Excluído!', 'Usuário removido.', 'success');
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir.', 'error');
      }
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setNovoUsuario({ name: user.name, email: user.email, password: '', role: user.role });
  };

  return (
    <div className="usuarios-container">
      <h2 style={{ color: '#ff1493' }}><Users size={24} /> Gerenciar Acessos</h2>

      <form onSubmit={handleCreateOrUpdate} className="usuario-form" style={{ background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #ffc0cb' }}>
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={novoUsuario.name}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={novoUsuario.email}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={novoUsuario.password}
            onChange={(e) => setNovoUsuario({ ...novoUsuario, password: e.target.value })}
            required={!editingId}
          />
        </div>
        <div className="form-group">
          <label>Função</label>
          <select 
            value={novoUsuario.role} 
            onChange={(e) => setNovoUsuario({ ...novoUsuario, role: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ffc0cb' }}
          >
            <option value="CLIENT">Cliente</option>
            <option value="SELLER">Vendedor (Admin)</option>
          </select>
        </div>
        <div className="buttons">
          <button type="submit" className="btn-submit" style={{ backgroundColor: '#ff1493' }}>
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>

      <div className="table-responsive" style={{ marginTop: '30px' }}>
        <table className="usuarios-table">
          <thead>
            <tr style={{ backgroundColor: '#ffe4e1' }}>
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: user.role === 'SELLER' ? '#ff1493' : '#fff0f5',
                    color: user.role === 'SELLER' ? 'white' : '#db7093'
                  }}>
                    {user.role === 'SELLER' ? 'Vendedor' : 'Cliente'}
                  </span>
                </td>
                <td>
                  <button onClick={() => startEdit(user)} className="btn-edit"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(user.id)} className="btn-delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Usuarios;
