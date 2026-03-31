import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const IMG_BASE = 'http://localhost:5000';

export default function SellerProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sellerRes, prodRes] = await Promise.all([
          API.get(`/auth/seller/${id}`),
          API.get(`/products?seller=${id}`),
        ]);
        setSeller(sellerRes.data.seller);
        setProducts(prodRes.data.products || []);
      } catch {
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="pt-24 page-container">
      <div className="h-48 bg-ink-800 shimmer mb-8" />
    </div>
  );

  if (!seller) return (
    <div className="pt-24 page-container text-center py-20">
      <p className="text-parchment-300/40 font-display text-2xl">Artist not found</p>
      <Link to="/products" className="btn-outline mt-6 inline-flex">Browse Artworks</Link>
    </div>
  );

  const avatarSrc = seller.avatar
    ? (seller.avatar.startsWith('http') ? seller.avatar : `${IMG_BASE}${seller.avatar}`)
    : null;

  return (
    <div className="pt-24 pb-20">
      {/* Hero banner */}
      <div className="bg-ink-800 border-b border-ink-700 py-12">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-ink-600 border-2 border-ink-500 overflow-hidden flex items-center justify-center shrink-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-parchment-300 text-4xl font-semibold">{seller.name?.charAt(0)}</span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-1">Artist</p>
              <h1 className="font-display text-3xl text-parchment-50 mb-2">{seller.name}</h1>
              {seller.bio && <p className="text-parchment-300/60 font-body text-sm max-w-lg leading-relaxed mb-3">{seller.bio}</p>}
              <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start text-xs font-sans text-parchment-300/40">
                {seller.location && <span>📍 {seller.location}</span>}
                {seller.website && (
                  <a href={seller.website} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                    🔗 Website
                  </a>
                )}
                <span>🗓 Since {new Date(seller.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                <span>🎨 {products.length} works</span>
                {seller.totalSales > 0 && (
                  <span className="text-gold-500/60">₹{seller.totalSales.toLocaleString('en-IN')} sold</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="page-container pt-12">
        <h2 className="font-display text-2xl text-parchment-100 mb-6">Works by {seller.name}</h2>
        {products.length === 0 ? (
          <p className="text-parchment-300/40 font-body text-lg text-center py-12">No artworks listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
