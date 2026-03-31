import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    API.get('/products/my-products').then(({ data }) => setProducts(data.products || [])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const formData = new FormData();
      formData.append('isAvailable', !product.isAvailable);
      const { data } = await API.put(`/products/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts((prev) => prev.map((p) => p._id === product._id ? data.product : p));
      toast.success(`${data.product.isAvailable ? 'Shown' : 'Hidden'} in marketplace`);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="pt-24 pb-20 page-container">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Artist Studio</p>
          <h1 className="section-title">My Artworks</h1>
        </div>
        <Link to="/seller/products/new" className="btn-gold px-6 py-3">+ Add New Work</Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-20 bg-ink-800 shimmer"/>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🖼️</div>
          <h2 className="font-display text-parchment-100 text-2xl mb-3">No artworks yet</h2>
          <p className="text-parchment-300/40 font-sans text-sm mb-8">Start listing your work to reach collectors worldwide</p>
          <Link to="/seller/products/new" className="btn-gold px-8 py-3.5">List Your First Work</Link>
        </div>
      ) : (
        <div className="card-dark overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-ink-700 bg-ink-700/30">
            <div className="col-span-5 text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase">Artwork</div>
            <div className="col-span-2 text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase">Price</div>
            <div className="col-span-1 text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase">Stock</div>
            <div className="col-span-2 text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase">Status</div>
            <div className="col-span-2 text-parchment-300/30 text-[10px] font-sans tracking-widest uppercase text-right">Actions</div>
          </div>

          {products.map((product, i) => {
            const imgSrc = product.images?.[0]
              ? (product.images[0].startsWith('http') ? product.images[0] : `${IMG_BASE}${product.images[0]}`)
              : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60';

            return (
              <div key={product._id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 items-center ${i < products.length - 1 ? 'border-b border-ink-700/50' : ''} hover:bg-ink-700/20 transition-colors`}>
                {/* Product info */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="w-14 h-14 shrink-0 bg-ink-700 overflow-hidden">
                    <img src={imgSrc} alt={product.title} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60'; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-parchment-100 font-sans text-sm font-medium truncate">{product.title}</p>
                    <p className="text-parchment-300/40 text-xs font-sans">{product.category}</p>
                    <p className="text-parchment-300/20 text-[10px] font-sans">Sold: {product.totalSold}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-gold-400 font-display font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="md:col-span-1">
                  <p className={`font-sans text-sm ${product.stock === 0 ? 'text-rust-400' : product.stock <= 3 ? 'text-gold-400' : 'text-parchment-200'}`}>
                    {product.stock}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <button onClick={() => handleToggleAvailability(product)}
                    className={`text-xs font-sans px-2.5 py-1 border transition-colors ${
                      product.isAvailable
                        ? 'text-sage-400 border-sage-400/30 bg-sage-400/10 hover:bg-sage-400/20'
                        : 'text-parchment-300/30 border-ink-600 hover:border-parchment-300/30'}`}>
                    {product.isAvailable ? 'Active' : 'Hidden'}
                  </button>
                </div>

                <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                  <Link to={`/products/${product._id}`} className="p-2 text-parchment-300/40 hover:text-parchment-100 transition-colors" title="View">
                    <EyeIcon />
                  </Link>
                  <Link to={`/seller/products/edit/${product._id}`} className="p-2 text-parchment-300/40 hover:text-gold-400 transition-colors" title="Edit">
                    <EditIcon />
                  </Link>
                  <button onClick={() => handleDelete(product._id, product.title)}
                    disabled={deletingId === product._id}
                    className="p-2 text-parchment-300/40 hover:text-rust-400 transition-colors disabled:opacity-30" title="Delete">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
