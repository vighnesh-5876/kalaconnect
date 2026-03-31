// Wishlist.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/wishlist').then(({ data }) => setWishlist(data.wishlist || [])).finally(() => setLoading(false));
  }, []);

  const handleToggle = (productId, action) => {
    if (action === 'removed') {
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    }
  };

  if (loading) return (
    <div className="pt-24 page-container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="bg-ink-800 aspect-art shimmer" />)}
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 page-container">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Saved</p>
      <h1 className="section-title mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🤍</div>
          <h2 className="font-display text-parchment-100 text-2xl mb-3">Nothing saved yet</h2>
          <p className="text-parchment-300/40 font-sans text-sm mb-8">Tap the heart on any artwork to save it here</p>
          <Link to="/products" className="btn-gold px-8 py-3.5">Explore Artworks</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} wishlistIds={wishlist.map(p => p._id)} onWishlistToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
