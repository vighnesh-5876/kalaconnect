import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';
const PLACEHOLDER = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=60';

export default function Cart() {
  const { items, total, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleQuantity = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) { toast.error('Exceeds available stock'); return; }
    try { await updateItem(productId, newQty); }
    catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (productId, title) => {
    try {
      await removeItem(productId);
      toast.success(`"${title}" removed from cart`);
    } catch { toast.error('Failed to remove item'); }
  };

  if (loading) return (
    <div className="pt-24 page-container">
      <div className="h-8 w-32 bg-ink-800 shimmer mb-8" />
      {[1,2,3].map(i => <div key={i} className="h-24 bg-ink-800 shimmer mb-3" />)}
    </div>
  );

  return (
    <div className="pt-24 pb-20 page-container">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Your Selection</p>
      <h1 className="section-title mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="font-display text-parchment-100 text-2xl mb-3">Your cart is empty</h2>
          <p className="text-parchment-300/40 font-sans text-sm mb-8">Discover artworks that speak to you</p>
          <Link to="/products" className="btn-gold px-8 py-3.5">Explore Artworks</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const imgSrc = product.images?.[0]
                ? (product.images[0].startsWith('http') ? product.images[0] : `${IMG_BASE}${product.images[0]}`)
                : PLACEHOLDER;

              return (
                <div key={item._id || product._id} className="card-dark p-4 flex gap-4 items-center group">
                  {/* Image */}
                  <Link to={`/products/${product._id}`} className="w-20 h-20 shrink-0 overflow-hidden bg-ink-700">
                    <img src={imgSrc} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product._id}`} className="font-display text-parchment-100 text-sm font-medium hover:text-gold-300 transition-colors line-clamp-2">
                      {product.title}
                    </Link>
                    <p className="text-gold-400 font-sans text-sm font-semibold mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-parchment-300/30 text-xs font-sans mt-0.5">
                      Stock: {product.stock}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-ink-600">
                    <button onClick={() => handleQuantity(product._id, item.quantity - 1, product.stock)}
                      className="w-8 h-8 text-parchment-300/60 hover:text-parchment-100 hover:bg-ink-700 transition-colors text-sm">–</button>
                    <span className="w-8 text-center font-sans text-sm text-parchment-100">{item.quantity}</span>
                    <button onClick={() => handleQuantity(product._id, item.quantity + 1, product.stock)}
                      className="w-8 h-8 text-parchment-300/60 hover:text-parchment-100 hover:bg-ink-700 transition-colors text-sm">+</button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-display text-parchment-100 text-base font-semibold">
                      ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Remove */}
                  <button onClick={() => handleRemove(product._id, product.title)}
                    className="text-parchment-300/30 hover:text-rust-400 transition-colors ml-2 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card-dark p-6 sticky top-24">
              <h2 className="font-display text-parchment-100 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-parchment-300/60">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="text-parchment-200">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-parchment-300/60">Shipping</span>
                  <span className="text-sage-400 text-xs">Free</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-parchment-300/60">Tax (18% GST)</span>
                  <span className="text-parchment-200">₹{Math.round(total * 0.18).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="gold-line mb-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-parchment-100 text-lg">Total</span>
                <span className="font-display text-gold-400 text-2xl font-semibold">
                  ₹{Math.round(total * 1.18).toLocaleString('en-IN')}
                </span>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn-gold w-full py-3.5 text-base mb-3">
                Proceed to Checkout
              </button>
              <Link to="/products" className="btn-ghost w-full text-center text-sm py-2">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
