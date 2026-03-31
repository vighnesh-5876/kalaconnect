import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950 mt-20">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center">
                <span className="text-gold-500 font-display font-bold text-sm">K</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-parchment-50 text-lg font-semibold">Kaal Connect</span>
                <span className="font-sans text-gold-500/60 text-[9px] tracking-[0.25em] uppercase">Artist Marketplace</span>
              </div>
            </div>
            <p className="text-parchment-300/50 font-body text-sm leading-relaxed max-w-xs">
              Where extraordinary art meets discerning collectors. Discover, connect, and own works from independent artists across India and beyond.
            </p>
            <div className="gold-line mt-6 max-w-xs" />
          </div>

          {/* Links */}
          <div>
            <h4 className="text-parchment-300/40 text-[10px] font-sans tracking-[0.25em] uppercase mb-4">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {['Paintings', 'Sculptures', 'Photography', 'Handmade Crafts', 'Digital Art'].map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  className="text-parchment-300/60 hover:text-gold-400 font-sans text-sm transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-parchment-300/40 text-[10px] font-sans tracking-[0.25em] uppercase mb-4">Platform</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/register?role=seller" className="text-parchment-300/60 hover:text-gold-400 font-sans text-sm transition-colors">Sell Your Art</Link>
              <Link to="/products" className="text-parchment-300/60 hover:text-gold-400 font-sans text-sm transition-colors">Browse All</Link>
              <Link to="/register" className="text-parchment-300/60 hover:text-gold-400 font-sans text-sm transition-colors">Create Account</Link>
              <Link to="/login" className="text-parchment-300/60 hover:text-gold-400 font-sans text-sm transition-colors">Sign In</Link>
            </div>
          </div>
        </div>

        <div className="gold-line mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-parchment-300/30 text-xs font-sans">
            © {new Date().getFullYear()} Kaal Connect. All rights reserved.
          </p>
          <p className="text-parchment-300/20 text-xs font-sans">
            Crafted with care for artists & collectors
          </p>
        </div>
      </div>
    </footer>
  );
}
