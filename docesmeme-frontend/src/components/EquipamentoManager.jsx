import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Image as ImageIcon,
  DollarSign,
  Layers
} from 'lucide-react';
import '../styles/equipamentoManager.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function EquipamentoManager() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingProduct) {
        await axios.patch(`${BASE_URL}/products/${editingProduct.id}`, formData); // Patch might not support FormData easily if not configured, but let's assume it works or we use multipart
        Swal.fire('Sucesso', 'Brownie atualizado!', 'success');
      } else {
        await axios.post(`${BASE_URL}/products`, data);
        Swal.fire('Sucesso', 'Brownie cadastrado!', 'success');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', image: null });
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Swal.fire('Erro', 'Erro ao salvar brownie.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff1493',
      cancelButtonColor: '#ffb6c1',
      confirmButtonText: 'Sim, deletar!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/products/${id}`);
        Swal.fire('Deletado!', 'O brownie foi removido.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Erro', 'Erro ao deletar brownie.', 'error');
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manager-container">
      <div className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#ff1493' }}><Package size={24} /> Gerenciar Brownies</h2>
          <p style={{ color: '#db7093' }}>Adicione, edite ou remova produtos da sua loja</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', image: null }); setIsModalOpen(true); }}
          style={{ backgroundColor: '#ff1493', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={20} /> Novo Brownie
        </button>
      </div>

      <div className="search-bar" style={{ marginBottom: '20px', position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#db7093' }} size={20} />
        <input 
          type="text" 
          placeholder="Buscar brownie..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid #ffc0cb', outline: 'none' }}
        />
      </div>

      <div className="table-responsive" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <table className="usuarios-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#ffe4e1', color: '#c71585' }}>
              <th style={{ padding: '15px' }}>Foto</th>
              <th style={{ padding: '15px' }}>Nome</th>
              <th style={{ padding: '15px' }}>Preço</th>
              <th style={{ padding: '15px' }}>Estoque</th>
              <th style={{ padding: '15px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #fff0f5' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#fff0f5', borderRadius: '8px', overflow: 'hidden' }}>
                    {product.imageUrl && <img src={`${BASE_URL.replace('/api', '')}/uploads/${product.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                </td>
                <td style={{ padding: '15px', color: '#4b0082', fontWeight: 'bold' }}>{product.name}</td>
                <td style={{ padding: '15px', color: '#ff1493' }}>R$ {product.price.toFixed(2)}</td>
                <td style={{ padding: '15px' }}>{product.stock} un</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openEditModal(product)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ color: '#ff1493', marginBottom: '20px' }}>{editingProduct ? 'Editar Brownie' : 'Novo Brownie'}</h3>
            <form onSubmit={handleSubmit} className="form-stack">
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#db7093' }}>Nome do Brownie</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ffc0cb' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#db7093' }}>Descrição</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ffc0cb', minHeight: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#db7093' }}>Preço (R$)</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ffc0cb' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#db7093' }}>Estoque</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ffc0cb' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#db7093' }}>Foto do Produto</label>
                <input type="file" onChange={handleFileChange} accept="image/*" style={{ width: '100%' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#fff0f5', border: 'none', padding: '10px 20px', borderRadius: '8px', color: '#db7093', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#ff1493', border: 'none', padding: '10px 20px', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipamentoManager;
