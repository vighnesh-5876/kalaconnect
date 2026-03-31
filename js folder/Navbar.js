import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const KaalLogo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center group-hover:border-gold-400 transition-colors">
      <span className="text-gold-500 font-display font-bold text-sm group-hover:text-gold-400 transition-colors">K</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display text-parchment-50 text-lg font-semibold tracking-tight">Kaal</span>
      <span className="font-sans text-gold-500/70 text-[9px] tracking-[0.25em] uppercase">Connect</span>
    </div>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const isSeller = user?.role === 'seller';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ink-900/95 backdrop-blur-sm border-b border-ink-700/60' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          <KaalLogo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="nav-link">Explore</Link>
            {user && !isSeller && (
              <>
                <Link to="/orders" className="nav-link">Orders</Link>
                <Link to="/wishlist" className="nav-link">Wishlist</Link>
              </>
            )}
            {isSeller && (
              <>
                <Link to="/seller/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/seller/products" className="nav-link">My Art</Link>
                <Link to="/seller/orders" className="nav-link">Sales</Link>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {!isSeller && (
                  <Link to="/cart" className="relative p-2 text-parchment-300/70 hover:text-gold-400 transition-colors">
                    <CartIcon />
                    {itemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-ink-900 text-[10px] font-bold font-sans flex items-center justify-center rounded-full">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 bg-ink-600 border border-ink-500 group-hover:border-gold-500/50 flex items-center justify-center transition-colors overflow-hidden">
                      {user.avatar ? (
                        <img src={`http://localhost:5000${user.avatar}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-parchment-300 text-xs font-sans font-semibold uppercase">
                          {user.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-parchment-300/70 text-sm font-sans group-hover:text-parchment-200 transition-colors">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-parchment-300/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-ink-800 border border-ink-600 shadow-ink py-1 animate-fade-in">
                      <div className="px-4 py-3 border-b border-ink-700">
                        <p className="text-parchment-100 text-sm font-sans font-medium">{user.name}</p>
                        <p className="text-parchment-300/40 text-xs font-sans mt-0.5">{user.email}</p>
                        <span className="badge-gold mt-1.5">{isSeller ? 'Artist' : 'Buyer'}</span>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-parchment-300/70 hover:text-parchment-100 hover:bg-ink-700 text-sm font-sans transition-colors">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      {!isSeller && (
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-parchment-300/70 hover:text-parchment-100 hover:bg-ink-700 text-sm font-sans transition-colors">
                          <BoxIcon className="w-4 h-4" /> My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rust-400 hover:text-rust-400 hover:bg-ink-700 text-sm font-sans transition-colors border-t border-ink-700 mt-1"
                      >
                        <LogoutIcon className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
                <Link to="/register" className="btn-gold text-sm px-5 py-2.5">Join Now</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-parchment-300/70 hover:text-gold-400"
          >
            {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink-900/98 border-t border-ink-700 backdrop-blur-sm animate-fade-in">
          <div className="page-container py-4 flex flex-col gap-1">
            <Link to="/products" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Explore</Link>
            {user && !isSeller && (
              <>
                <Link to="/cart" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800 flex justify-between">
                  Cart {itemCount > 0 && <span className="badge-gold">{itemCount}</span>}
                </Link>
                <Link to="/orders" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Orders</Link>
                <Link to="/wishlist" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Wishlist</Link>
              </>
            )}
            {isSeller && (
              <>
                <Link to="/seller/dashboard" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Dashboard</Link>
                <Link to="/seller/products" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">My Art</Link>
                <Link to="/seller/orders" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Sales</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/profile" className="px-4 py-3 text-parchment-300/70 hover:text-gold-400 font-sans text-sm border-b border-ink-800">Profile</Link>
                <button onClick={handleLogout} className="px-4 py-3 text-rust-400 font-sans text-sm text-left">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-3 px-4 pt-3">
                <Link to="/login" className="btn-outline flex-1 text-center py-2.5">Sign In</Link>
                <Link to="/register" className="btn-gold flex-1 text-center py-2.5">Join Now</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Inline SVG icons
const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const ChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const BoxIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
