import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center page-container text-center">
      <div>
        <p className="font-display text-9xl text-ink-700 font-bold select-none">404</p>
        <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-4 -mt-4">Page Not Found</p>
        <h1 className="font-display text-3xl text-parchment-100 mb-4">This canvas is blank.</h1>
        <p className="text-parchment-300/40 font-body text-lg mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-gold px-8 py-3.5">Go Home</Link>
      </div>
    </div>
  );
}
