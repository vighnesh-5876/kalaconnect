import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS = {
  pending: 'text-gold-400', processing: 'text-blue-400',
  shipped: 'text-parchment-300', delivered: 'text-sage-400', cancelled: 'text-rust-400',
};
const IMG_BASE = 'http://localhost:5000';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24 page-container"><div className="h-64 bg-ink-800 shimmer" /></div>;
  if (!order) return <div className="pt-24 page-container text-center"><p className="text-parchment-300/40">Order not found</p></div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="pt-24 pb-20 page-container max-w-4xl">
      <Link to="/orders" className="text-parchment-300/40 hover:text-gold-400 text-sm font-sans transition-colors mb-6 inline-flex items-center gap-1">
        ← Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-1">Order</p>
          <h1 className="font-display text-2xl text-parchment-50">{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-parchment-300/30 font-sans text-xs mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <span className={`text-sm font-sans capitalize font-medium ${STATUS_COLORS[order.status]}`}>
          ● {order.status}
        </span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="card-dark p-5 mb-6">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                    i < stepIdx ? 'bg-gold-500 border-gold-500 text-ink-900' :
                    i === stepIdx ? 'border-gold-500 text-gold-400' :
                    'border-ink-600 text-parchment-300/20'}`}>
                    {i < stepIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-sans capitalize hidden sm:block ${i <= stepIdx ? 'text-parchment-300/70' : 'text-parchment-300/20'}`}>
                    {step}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < stepIdx ? 'bg-gold-500/50' : 'bg-ink-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card-dark p-5">
          <h2 className="font-display text-parchment-100 text-base mb-4">Items ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => {
              const imgSrc = item.image
                ? (item.image.startsWith('http') ? item.image : `${IMG_BASE}${item.image}`)
                : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60';
              return (
                <div key={i} className="flex gap-3 items-center">
                  <img src={imgSrc} alt={item.title} className="w-12 h-12 object-cover bg-ink-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&q=60'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-parchment-100 font-sans text-sm line-clamp-1">{item.title}</p>
                    <p className="text-parchment-300/40 text-xs font-sans">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="text-gold-400 font-sans text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>
          <div className="gold-line my-4" />
          <div className="flex justify-between font-display text-parchment-100">
            <span>Total</span>
            <span className="text-gold-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="space-y-4">
          <div className="card-dark p-5">
            <h2 className="font-display text-parchment-100 text-base mb-3">Shipping Address</h2>
            <div className="space-y-1 text-sm font-sans">
              <p className="text-parchment-200 font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-parchment-300/60">{order.shippingAddress.address}</p>
              <p className="text-parchment-300/60">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.zip}</p>
              <p className="text-parchment-300/60">{order.shippingAddress.country}</p>
              <p className="text-parchment-300/60">{order.shippingAddress.phone}</p>
            </div>
          </div>
          <div className="card-dark p-5">
            <h2 className="font-display text-parchment-100 text-base mb-3">Payment</h2>
            <div className="text-sm font-sans space-y-1">
              <div className="flex justify-between">
                <span className="text-parchment-300/40">Method</span>
                <span className="text-parchment-200 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment-300/40">Status</span>
                <span className={order.paymentStatus === 'paid' ? 'text-sage-400' : 'text-rust-400'}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between">
                  <span className="text-parchment-300/40">Payment ID</span>
                  <span className="text-parchment-300/60 font-mono text-xs">{order.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
