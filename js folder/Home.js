import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './axios';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { name: 'Paintings', emoji: '🎨', desc: 'Oil, watercolour, acrylic & more' },
  { name: 'Sculptures', emoji: '🗿', desc: 'Clay, stone, metal & mixed' },
  { name: 'Photography', emoji: '📷', desc: 'Fine art & documentary prints' },
  { name: 'Handmade Crafts', emoji: '🧵', desc: 'Handcrafted unique objects' },
  { name: 'Digital Art', emoji: '💻', desc: 'Prints, NFTs & generative art' },
  { name: 'Jewelry', emoji: '💎', desc: 'Handmade adornments' },
  { name: 'Textiles', emoji: '🪡', desc: 'Weavings, quilts & fabric art' },
  { name: 'Ceramics', emoji: '🏺', desc: 'Pottery & ceramic sculpture' },
];

const HERO_STATS = [
  { value: '500+', label: 'Artists' },
  { value: '3,200+', label: 'Artworks' },
  { value: '12,000+', label: 'Collectors' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/products/featured');
        setFeatured(data.products || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    else navigate('/products');
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#d4a843 1px, transparent 1px), linear-gradient(90deg, #d4a843 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-gold-500/5 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 70%)' }} />

        <div className="page-container w-full py-20">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <div className="w-8 h-px bg-gold-500/60" />
              <span className="text-gold-500/70 text-xs font-sans tracking-[0.3em] uppercase">Artist Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-parchment-50 leading-[0.95] mb-8 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Where Art<br />
              <span className="italic text-gold-400">Finds Its</span><br />
              Keeper.
            </h1>

            <p className="text-parchment-300/60 font-body text-lg md:text-xl leading-relaxed max-w-xl mb-10 animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              Discover extraordinary works from independent artists. Every piece tells a story — find the one that speaks to you.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-0 max-w-lg mb-10 animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search paintings, sculptures, artists..."
                className="input-dark flex-1 text-sm h-12"
              />
              <button type="submit" className="btn-gold h-12 px-6 shrink-0">Search</button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
              <Link to="/products" className="btn-gold px-8 py-3.5">Explore Artworks</Link>
              <Link to="/register?role=seller" className="btn-outline px-8 py-3.5">Sell Your Art</Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-16 pt-10 border-t border-ink-700/50 animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            {HERO_STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-gold-400 font-semibold">{value}</div>
                <div className="text-parchment-300/40 text-xs font-sans tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-line" />

      {/* Categories */}
      <section className="py-20 bg-ink-950/50">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-3">Browse by</p>
              <h2 className="section-title">Categories</h2>
            </div>
            <Link to="/products" className="btn-ghost text-sm hidden sm:flex">View All →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="card-dark p-5 group hover:border-gold-500/30 hover:bg-ink-700/50 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="font-display text-parchment-100 text-sm font-medium group-hover:text-gold-300 transition-colors mb-1">{cat.name}</h3>
                <p className="text-parchment-300/40 text-xs font-sans leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="page-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-3">Handpicked</p>
              <h2 className="section-title">Featured Works</h2>
            </div>
            <Link to="/products" className="btn-ghost text-sm hidden sm:flex">See All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-dark overflow-hidden">
                  <div className="bg-ink-700 aspect-art shimmer" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-ink-700 w-1/2 shimmer" />
                    <div className="h-4 bg-ink-700 w-full shimmer" />
                    <div className="h-4 bg-ink-700 w-3/4 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <div key={product._id} className="animate-fade-up" style={{ opacity: 0 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-parchment-300/40 font-body text-lg mb-4">No artworks yet.</p>
              <p className="text-parchment-300/30 font-sans text-sm mb-6">Be the first artist to list your work on Kaal Connect.</p>
              <Link to="/register?role=seller" className="btn-gold">Start Selling</Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-ink-800/60 border-y border-ink-700">
        <div className="page-container text-center">
          <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-4">For Artists</p>
          <h2 className="section-title mb-4">Share Your Art With the World</h2>
          <p className="text-parchment-300/50 font-body text-lg max-w-xl mx-auto mb-8">
            Join hundreds of independent artists selling directly to collectors who value original work.
          </p>
          <Link to="/register?role=seller" className="btn-gold px-10 py-4 text-base">
            Open Your Shop
          </Link>
        </div>
      </section>
    </div>
  );
}
