import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  pending: 'text-gold-400', processing: 'text-blue-400',
  shipped: 'text-parchment-300', delivered: 'text-sage-400', cancelled: 'text-rust-400',
};

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          API.get('/products/my-products'),
          API.get('/orders/seller'),
        ]);
        setProducts(prodRes.data.products || []);
        setOrders(ordRes.data.orders || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: '🎨', link: '/seller/products' },
    { label: 'Total Orders', value: orders.length, icon: '📦', link: '/seller/orders' },
    { label: 'Pending', value: pendingOrders, icon: '⏳', link: '/seller/orders' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', link: '/seller/orders' },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Artist Studio</p>
            <h1 className="section-title">Dashboard</h1>
            <p className="text-parchment-300/40 font-sans text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <Link to="/seller/products/new" className="btn-gold px-6 py-3 flex items-center gap-2">
            <span>+</span> Add New Work
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.link} className="card-dark p-5 hover:border-gold-500/30 transition-all group">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="font-display text-2xl text-parchment-50 font-semibold group-hover:text-gold-300 transition-colors">{loading ? '—' : stat.value}</p>
              <p className="text-parchment-300/40 font-sans text-xs tracking-widest uppercase mt-1">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="card-dark p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-parchment-100 text-lg">My Artworks</h2>
              <Link to="/seller/products" className="text-gold-500/60 hover:text-gold-400 text-xs font-sans transition-colors">View All →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-ink-700 shimmer"/>)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-parchment-300/40 font-sans text-sm mb-3">No artworks listed yet</p>
                <Link to="/seller/products/new" className="btn-outline text-sm py-2 px-4">Add Your First Work</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex items-center justify-between py-2 border-b border-ink-700/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-parchment-100 font-sans text-sm truncate">{product.title}</p>
                      <p className="text-parchment-300/40 text-xs font-sans">{product.category} · Stock: {product.stock}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-gold-400 font-display text-sm font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] font-sans ${product.isAvailable ? 'text-sage-400' : 'text-rust-400'}`}>
                        {product.isAvailable ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="card-dark p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-parchment-100 text-lg">Recent Orders</h2>
              <Link to="/seller/orders" className="text-gold-500/60 hover:text-gold-400 text-xs font-sans transition-colors">View All →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-ink-700 shimmer"/>)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-parchment-300/40 font-sans text-sm">No orders received yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-ink-700/50 last:border-0">
                    <div>
                      <p className="text-parchment-100 font-sans text-xs font-mono">{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-parchment-300/40 text-xs font-sans">by {order.buyerId?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-400 font-display text-sm">₹{order.items.reduce((s,i)=>s+i.price*i.quantity,0).toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] font-sans capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
