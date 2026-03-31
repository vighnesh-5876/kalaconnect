import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from './axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {});
  }, [id]);

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center page-container">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-gold-500/10 border-2 border-gold-500/40 flex items-center justify-center mx-auto mb-6 animate-float">
          <svg className="w-10 h-10 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-4xl text-parchment-50 mb-3">Order Confirmed!</h1>
        <p className="text-parchment-300/60 font-body text-lg mb-2">
          Your artwork is on its way to you.
        </p>
        {order && (
          <p className="text-parchment-300/30 font-sans text-sm mb-8">
            Order ID: <span className="text-gold-500/60 font-mono">{order._id}</span>
          </p>
        )}

        {order && (
          <div className="card-dark p-5 text-left mb-8">
            <p className="label-dark mb-3">Items Ordered</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm font-sans">
                  <span className="text-parchment-200">{item.title} <span className="text-parchment-300/40">×{item.quantity}</span></span>
                  <span className="text-gold-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="gold-line my-3" />
            <div className="flex justify-between font-display text-parchment-100">
              <span>Total Paid</span>
              <span className="text-gold-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn-outline px-6 py-3">View Orders</Link>
          <Link to="/products" className="btn-gold px-6 py-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
