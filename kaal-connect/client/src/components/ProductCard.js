import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';
const PLACEHOLDER = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=60';

export default function ProductCard({ product, wishlistIds = [], onWishlistToggle }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(wishlistIds.includes(product._id));

  const imageUrl = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${IMG_BASE}${product.images[0]}`)
    : PLACEHOLDER;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Sign in to add to cart'); return; }
    if (user.role === 'seller') { toast.error('Sellers cannot buy products'); return; }
    try {
      setAddingToCart(true);
      await addToCart(product._id, 1);
      toast.success(`"${product.title}" added to cart`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Sign in to add to wishlist'); return; }
    try {
      const { data } = await API.post(`/wishlist/toggle/${product._id}`);
      setIsWishlisted(data.action === 'added');
      toast.success(data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
      if (onWishlistToggle) onWishlistToggle(product._id, data.action);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card block">
      {/* Image */}
      <div className="relative overflow-hidden bg-ink-700 aspect-art">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist button */}
        {user && user.role !== 'seller' && (
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-ink-900/70 backdrop-blur-sm border border-ink-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-gold-500/50"
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-ink-900/80 backdrop-blur-sm text-parchment-300/70 text-[10px] font-sans tracking-widest uppercase">
            {product.category}
          </span>
        </div>

        {/* Stock warning */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-rust-500/80 text-parchment-50 text-[10px] font-sans">
              Only {product.stock} left
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-ink-900/90 border border-ink-600 text-parchment-300/60 text-xs font-sans tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Seller */}
        <p className="text-parchment-300/40 text-[10px] font-sans tracking-widest uppercase mb-1.5">
          {product.sellerId?.name || 'Unknown Artist'}
        </p>

        {/* Title */}
        <h3 className="font-display text-parchment-100 text-base font-medium leading-snug mb-2 line-clamp-2 group-hover:text-gold-300 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.averageRating} size="sm" />
            <span className="text-parchment-300/40 text-xs font-sans">({product.numReviews})</span>
          </div>
        )}

        {/* Price & action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink-700/50">
          <span className="font-display text-gold-400 text-lg font-semibold">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {user?.role !== 'seller' && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="px-3 py-1.5 bg-transparent border border-gold-500/40 text-gold-400 text-xs font-sans tracking-wide hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {addingToCart ? '...' : '+ Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export function StarRating({ rating, size = 'md' }) {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${starSize} ${star <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const HeartIcon = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-rust-400 fill-current' : 'text-parchment-300/60'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
