import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from './axios';

const STATUS_COLORS = {
  pending:    'text-gold-400 bg-gold-500/10 border-gold-500/30',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  shipped:    'text-parchment-300 bg-parchment-300/10 border-parchment-300/20',
  delivered:  'text-sage-400 bg-sage-400/10 border-sage-400/30',
  cancelled:  'text-rust-400 bg-rust-400/10 border-rust-400/30',
};

const IMG_BASE = 'http://localhost:5000';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders').then(({ data }) => setOrders(data.orders || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-24 page-container">
      {[1,2,3].map(i=><div key={i} className="h-28 bg-ink-800 shimmer mb-3"/>)}
    </div>
  );

  return (
    <div className="pt-24 pb-20 page-container">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Your Purchases</p>
      <h1 className="section-title mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="font-display text-parchment-100 text-2xl mb-3">No orders yet</h2>
          <p className="text-parchment-300/40 font-sans text-sm mb-8">Start collecting art from independent artists</p>
          <Link to="/products" className="btn-gold px-8 py-3.5">Explore Artworks</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-dark p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-parchment-300/30 text-xs font-sans mb-1">Order ID</p>
                  <p className="font-mono text-gold-500/60 text-xs">{order._id}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 border text-xs font-sans capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                    {order.status}
                  </span>
                  <p className="text-parchment-300/30 text-xs font-sans mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {order.items.slice(0, 4).map((item, i) => {
                  const imgSrc = item.image
                    ? (item.image.startsWith('http') ? item.image : `${IMG_BASE}${item.image}`)
                    : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60';
                  return (
                    <div key={i} className="w-14 h-14 shrink-0 bg-ink-700 overflow-hidden">
                      <img src={imgSrc} alt={item.title} className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60'; }} />
                    </div>
                  );
                })}
                {order.items.length > 4 && (
                  <div className="w-14 h-14 bg-ink-700 flex items-center justify-center shrink-0">
                    <span className="text-parchment-300/40 text-xs font-sans">+{order.items.length - 4}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-parchment-300/40 text-xs font-sans">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  <p className="font-display text-gold-400 text-lg font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <Link to={`/orders/${order._id}`} className="btn-outline py-2 px-4 text-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
