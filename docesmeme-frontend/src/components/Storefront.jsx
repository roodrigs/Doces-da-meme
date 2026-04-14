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
  Search,
  Star,
  MessageSquare
} from 'lucide-react';
import '../styles/dashboard.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ProductReviews({ productId, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/reviews`, {
        productId,
        rating: newRating,
        comment: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewComment('');
      setNewRating(5);
      fetchReviews();
      Swal.fire({
        icon: 'success',
        title: 'Avaliação enviada!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Swal.fire('Erro', 'Não foi possível enviar sua avaliação.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(30, 27, 75, 0.6)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
      <div style={{ backgroundColor: 'white', width: '90%', maxWidth: '500px', maxHeight: '80vh', borderRadius: '25px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '25px', borderBottom: '1px solid #F5F3FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} color="#8B5CF6" /> Avaliações
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
          {isLoggedIn ? (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: '30px', padding: '15px', background: '#F5F3FF', borderRadius: '15px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1E1B4B', fontSize: '0.9rem' }}>Deixe sua opinião:</p>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={24} 
                    fill={star <= newRating ? "#8B5CF6" : "none"} 
                    color="#8B5CF6" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setNewRating(star)}
                  />
                ))}
              </div>
              <textarea 
                placeholder="Conte o que achou deste brownie..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #DDD6FE', minHeight: '80px', marginBottom: '10px', fontSize: '0.9rem' }}
                required
              />
              <button 
                type="submit" 
                disabled={submitting}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#8B5CF6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {submitting ? 'Enviando...' : 'Publicar Avaliação'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', background: '#F5F3FF', borderRadius: '15px', marginBottom: '30px' }}>
              <p style={{ margin: 0, color: '#7C3AED', fontSize: '0.9rem' }}>Faça login para avaliar este produto.</p>
            </div>
          )}

          {loading ? (
            <p style={{ textAlign: 'center', color: '#7C3AED' }}>Carregando avaliações...</p>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #F5F3FF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1E1B4B', fontSize: '0.9rem' }}>{review.user.name}</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} fill={star <= review.rating ? "#8B5CF6" : "none"} color="#8B5CF6" />
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, color: '#4C1D95', fontSize: '0.9rem', lineHeight: '1.4' }}>{review.comment}</p>
                <span style={{ fontSize: '0.75rem', color: '#A78BFA' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#A78BFA', marginTop: '20px' }}>Nenhuma avaliação ainda. Seja o primeiro!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Storefront() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

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
      background: '#F5F3FF',
      color: '#8B5CF6'
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

    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Quase lá!',
        text: 'Para finalizar seu pedido e enviar para a Meme, você precisa entrar na sua conta.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Entrar / Cadastrar',
        cancelButtonText: 'Continuar Vendo',
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#DDD6FE',
      }).then((result) => {
        if (result.isConfirmed) {
          // Trigger the login modal or redirect to login
          window.dispatchEvent(new CustomEvent('openLoginModal'));
        }
      });
      return;
    }

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
      const whatsappLink = `https://wa.me/5592981526338?text=${encodedMessage}`; // Replace with actual number

      window.open(whatsappLink, '_blank');
      setCart([]);
      setIsCartOpen(false);
      
      Swal.fire({
        title: 'Pedido Realizado!',
        text: 'Seu pedido foi registrado e enviado para a Meme!',
        icon: 'success',
        confirmButtonColor: '#8B5CF6'
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

  if (loading) return <div className="loading" style={{ color: '#8B5CF6' }}>Preparando a vitrine...</div>;

  return (
    <div className="storefront-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="store-header" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h1 style={{ fontFamily: 'cursive', color: '#8B5CF6', fontSize: 'clamp(2rem, 8vw, 3rem)', margin: 0 }}>Brownie da Meme</h1>
            <p style={{ color: '#7C3AED', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>O doce que você merece! ✨</p>
          </div>
        </div>

        {/* Floating Cart Button */}
        <button 
          className="cart-btn-floating" 
          onClick={() => setIsCartOpen(true)}
          style={{ 
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#8B5CF6', 
            color: 'white', 
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-8px', 
                right: '-8px', 
                background: '#EF4444', 
                color: 'white', 
                fontSize: '0.7rem', 
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px',
                border: '2px solid white'
              }}>
                {cart.length}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 'bold', marginTop: '2px' }}>CARRINHO</span>
        </button>

        <div className="search-box" style={{ marginTop: '30px', position: 'relative', maxWidth: '100%' }}>
          <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#A78BFA' }} size={20} />
          <input 
            type="text" 
            placeholder="Qual doçura você procura hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '15px 15px 15px 55px', 
              borderRadius: '15px', 
              border: '2px solid #DDD6FE', 
              fontSize: '1rem',
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>
      </header>

      <div className="products-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', 
        gap: '20px'
      }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card-premium" style={{ 
            backgroundColor: 'white', 
            borderRadius: '25px', 
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(139, 92, 246, 0.15)',
            border: '1px solid #F5F3FF',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ height: '220px', backgroundColor: '#EDE9FE', position: 'relative' }}>
              {product.imageUrl ? (
                <img src={`${BASE_URL.replace('/api', '')}/uploads/${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cookie size={80} color="#DDD6FE" strokeWidth={1} />
                </div>
              )}
              {product.stock <= 0 && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#8B5CF6', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>ESGOTADO</span>
                </div>
              )}
            </div>
            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                <h3 style={{ color: '#1E1B4B', fontSize: '1.4rem', margin: 0 }}>{product.name}</h3>
                <span style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: '1.2rem' }}>R$ {product.price.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={star <= Math.round(calculateAverageRating(product.reviews)) ? "#8B5CF6" : "none"} 
                      color="#8B5CF6" 
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedProductForReview(product.id)}
                  style={{ background: 'none', border: 'none', color: '#7C3AED', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  ({product.reviews?.length || 0} avaliações)
                </button>
              </div>

              <p style={{ color: '#7C3AED', fontSize: '0.95rem', marginBottom: '20px', minHeight: '40px' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: product.stock < 10 ? '#8B5CF6' : '#9370DB', fontSize: '0.85rem' }}>
                  {product.stock > 0 ? `${product.stock} disponíveis` : 'Sem estoque'}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  style={{ 
                    backgroundColor: product.stock <= 0 ? '#DDD6FE' : '#A78BFA', 
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

      {selectedProductForReview && (
        <ProductReviews 
          productId={selectedProductForReview} 
          onClose={() => {
            setSelectedProductForReview(null);
            fetchProducts(); // Refresh to get new ratings
          }} 
        />
      )}

      {isCartOpen && (
        <div className="cart-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(30, 27, 75, 0.4)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(5px)' }}>
          <div className="cart-modal" style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '30px', borderBottom: '2px solid #F5F3FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                <ShoppingBag /> Seu Carrinho
              </h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C3AED' }}>
                <X size={28} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
              {cart.length > 0 ? cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '20px', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #F5F3FF' }}>
                  <div style={{ width: '70px', height: '70px', backgroundColor: '#EDE9FE', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    {item.imageUrl && <img src={`${BASE_URL.replace('/api', '')}/uploads/${item.imageUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#1E1B4B', margin: '0 0 5px 0' }}>{item.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F3FF', padding: '5px 12px', borderRadius: '10px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5CF6' }}><Minus size={16} /></button>
                        <span style={{ fontWeight: 'bold', color: '#1E1B4B' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B5CF6' }}><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#C4B5FD', cursor: 'pointer', height: 'fit-content' }}>
                    <X size={20} />
                  </button>
                </div>
              )) : (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                  <Cookie size={60} color="#DDD6FE" style={{ marginBottom: '20px' }} />
                  <p style={{ color: '#7C3AED', fontSize: '1.1rem' }}>Seu carrinho está esperando por doçuras!</p>
                </div>
              )}
            </div>

            <div style={{ padding: '30px', borderTop: '2px solid #F5F3FF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold', color: '#1E1B4B', marginBottom: '25px' }}>
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
              <p style={{ textAlign: 'center', color: '#7C3AED', fontSize: '0.85rem', marginTop: '15px' }}>
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
