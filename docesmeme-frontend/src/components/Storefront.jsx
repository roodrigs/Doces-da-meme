import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Send,
  Cookie,
  Info,
  Search
} from 'lucide-react';
import '../styles/dashboard.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Storefront() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      Swal.fire('Esgotado', 'Desculpe, este brownie acabou!', 'error');
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        Swal.fire('Limite de estoque', 'Você já adicionou todo o estoque disponível.', 'warning');
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${product.name} no carrinho!`,
      showConfirmButton: false,
      timer: 1500,
      background: '#FFF0F5',
      color: '#FF1493'
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQty = item.quantity + delta;
        if (newQty > product.stock) return item;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Cliente';
    const userId = localStorage.getItem('userId');

    try {
      // 1. Save order to Backend
      await axios.post(`${BASE_URL}/orders`, {
        clientId: userId,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      // 2. Generate WhatsApp Message
      let message = `*Novo Pedido - Brownie da Meme*\n\n`;
      message += `*Cliente:* ${nomeUsuario}\n`;
      message += `--------------------------\n`;
      cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `--------------------------\n`;
      message += `*Total: R$ ${cartTotal.toFixed(2)}*\n\n`;
      message += `Olá Meme! Acabei de fazer um pedido pelo site. Pode confirmar para mim? 💖`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/5511999999999?text=${encodedMessage}`; // Replace with actual number

      window.open(whatsappLink, '_blank');
      setCart([]);
      setIsCartOpen(false);
      
      Swal.fire({
        title: 'Pedido Realizado!',
        text: 'Seu pedido foi registrado e enviado para a Meme!',
        icon: 'success',
        confirmButtonColor: '#FF1493'
      });
      fetchProducts(); // Refresh stock
    } catch (error) {
      console.error('Erro no checkout:', error);
      Swal.fire('Erro', 'Ocorreu um problema ao processar seu pedido.', 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading" style={{ color: '#FF1493' }}>Preparando a vitrine...</div>;

  return (
    <div className="storefront-container">
      <header className="store-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'cursive', color: '#FF1493', fontSize: '3rem', margin: 0 }}>Brownie da Meme</h1>
            <p style={{ color: '#DB7093', fontSize: '1.2rem' }}>O doce que você merece! ✨</p>
          </div>
          <button 
            className="cart-btn-large" 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              backgroundColor: '#FF1493', 
              color: 'white', 
              padding: '15px 30px', 
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(255, 20, 147, 0.3)'
            }}
          >
            <ShoppingCart size={24} />
            Carrinho ({cart.length})
          </button>
        </div>

        <div className="search-box" style={{ marginTop: '30px', position: 'relative', maxWidth: '600px' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#FF69B4' }} size={20} />
          <input 
            type="text" 
            placeholder="Qual doçura você procura hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '15px 15px 15px 55px', 
              borderRadius: '15px', 
              border: '2px solid #FFC0CB', 
              fontSize: '1rem',
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>
      </header>

      <div className="products-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '30px'
      }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card-premium" style={{ 
            backgroundColor: 'white', 
            borderRadius: '25px', 
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(255, 182, 193, 0.15)',
            border: '1px solid #FFF0F5',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ height: '220px', backgroundColor: '#FFE4E1', position: 'relative' }}>
              {product.imageUrl ? (
                <img src={`${BASE_URL.replace('/api', '')}/uploads/${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cookie size={80} color="#FFB6C1" strokeWidth={1} />
                </div>
              )}
              {product.stock <= 0 && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#FF1493', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>ESGOTADO</span>
                </div>
              )}
            </div>
            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ color: '#4B0082', fontSize: '1.4rem', margin: 0 }}>{product.name}</h3>
                <span style={{ color: '#FF1493', fontWeight: 'bold', fontSize: '1.2rem' }}>R$ {product.price.toFixed(2)}</span>
              </div>
              <p style={{ color: '#DB7093', fontSize: '0.95rem', marginBottom: '20px', minHeight: '40px' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: product.stock < 10 ? '#FF1493' : '#9370DB', fontSize: '0.85rem' }}>
                  {product.stock > 0 ? `${product.stock} disponíveis` : 'Sem estoque'}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  style={{ 
                    backgroundColor: product.stock <= 0 ? '#FFB6C1' : '#FF69B4', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 20px', 
                    borderRadius: '15px',
                    cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  <Plus size={18} /> Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCartOpen && (
        <div className="cart-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(75, 0, 130, 0.4)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(5px)' }}>
          <div className="cart-modal" style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '30px', borderBottom: '2px solid #FFF0F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#FF1493', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                <ShoppingBag /> Seu Carrinho
              </h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DB7093' }}>
                <X size={28} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
              {cart.length > 0 ? cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #FFF0F5' }}>
                  <div style={{ width: '70px', height: '70px', backgroundColor: '#FFE4E1', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    {item.imageUrl && <img src={`${BASE_URL.replace('/api', '')}/uploads/${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#4B0082', margin: '0 0 5px 0' }}>{item.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#FF1493', fontWeight: 'bold' }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#FFF0F5', padding: '5px 12px', borderRadius: '10px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF1493' }}><Minus size={16} /></button>
                        <span style={{ fontWeight: 'bold', color: '#4B0082' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF1493' }}><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#FFC0CB', cursor: 'pointer', height: 'fit-content' }}>
                    <X size={20} />
                  </button>
                </div>
              )) : (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                  <Cookie size={60} color="#FFB6C1" style={{ marginBottom: '20px' }} />
                  <p style={{ color: '#DB7093', fontSize: '1.1rem' }}>Seu carrinho está esperando por doçuras!</p>
                </div>
              )}
            </div>

            <div style={{ padding: '30px', borderTop: '2px solid #FFF0F5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold', color: '#4B0082', marginBottom: '25px' }}>
                <span>Total:</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                style={{ 
                  width: '100%', 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  border: 'none', 
                  padding: '18px', 
                  borderRadius: '20px', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 10px 25px rgba(37, 211, 102, 0.3)'
                }}
              >
                <Send size={24} />
                Pedir pelo WhatsApp
              </button>
              <p style={{ textAlign: 'center', color: '#DB7093', fontSize: '0.85rem', marginTop: '15px' }}>
                Ao clicar, você será redirecionado para o WhatsApp da Meme.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Storefront;
