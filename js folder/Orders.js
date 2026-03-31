import React, { useEffect, useState } from 'react';
import API from './axios';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'text-gold-400 bg-gold-500/10 border-gold-500/30',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  shipped: 'text-parchment-300 bg-parchment-300/10 border-parchment-300/20',
  delivered: 'text-sage-400 bg-sage-400/10 border-sage-400/30',
  cancelled: 'text-rust-400 bg-rust-400/10 border-rust-400/30',
};
const IMG_BASE = 'http://localhost:5000';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    API.get('/orders/seller').then(({ data }) => setOrders(data.orders || [])).finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const { data } = await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: data.order.status } : o));
      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  return (
    <div className="pt-24 pb-20 page-container">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Artist Studio</p>
      <h1 className="section-title mb-2">Sales & Orders</h1>
      <p className="text-parchment-300/40 font-sans text-sm mb-8">
        Total revenue: <span className="text-gold-400 font-display">₹{totalRevenue.toLocaleString('en-IN')}</span>
      </p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs font-sans capitalize transition-colors ${
              filter === s ? 'bg-gold-500 text-ink-900 font-semibold' : 'border border-ink-600 text-parchment-300/60 hover:border-ink-400'}`}>
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-ink-800 shimmer"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">📬</div>
          <h2 className="font-display text-parchment-100 text-2xl mb-3">No orders {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h2>
          <p className="text-parchment-300/40 font-sans text-sm">Keep listing great art to attract buyers</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="card-dark p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-parchment-300/30 text-[10px] font-sans">Order ID</p>
                  <p className="font-mono text-gold-500/60 text-xs">{order._id}</p>
                  <p className="text-parchment-300/40 font-sans text-xs mt-1">
                    by <span className="text-parchment-200">{order.buyerId?.name}</span> · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 border text-xs font-sans capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="input-dark py-1.5 text-xs w-36 disabled:opacity-50">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => {
                  const imgSrc = item.image
                    ? (item.image.startsWith('http') ? item.image : `${IMG_BASE}${item.image}`)
                    : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60';
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <img src={imgSrc} alt={item.title} className="w-10 h-10 object-cover bg-ink-700 shrink-0"
                        onError={(e) => { e.target.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-parchment-100 font-sans text-sm truncate">{item.title}</p>
                        <p className="text-parchment-300/40 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gold-400 font-display font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  );
                })}
              </div>

              {/* Shipping */}
              <div className="gold-line mb-3" />
              <div className="flex justify-between items-end text-xs font-sans">
                <div className="text-parchment-300/40">
                  <p>Ship to: {order.shippingAddress?.fullName}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.zip}</p>
                </div>
                <p className="font-display text-gold-400 text-base">
                  ₹{order.items.reduce((s,i) => s+i.price*i.quantity, 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
