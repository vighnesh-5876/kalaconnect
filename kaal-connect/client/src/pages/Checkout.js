import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';

const PAYMENT_METHODS = [
  { value: 'razorpay', label: 'Razorpay (Cards, UPI, Wallets)', emoji: '💳' },
  { value: 'cod', label: 'Cash on Delivery', emoji: '💵' },
];

export default function Checkout() {
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', zip: '', country: 'India', phone: '',
  });
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    const required = ['fullName', 'address', 'city', 'state', 'zip', 'phone'];
    for (const field of required) {
      if (!form[field].trim()) { toast.error(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`); return false; }
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order
      const { data } = await API.post('/orders/razorpay/create-order', {
        shippingAddress: form,
      });

      setOrderData(data.order);

      const options = {
        key: 'rzp_test_SW0N3rLraNsj9l', // Your Razorpay Key ID
        amount: data.order.amount * 100, // Amount in paise
        currency: 'INR',
        name: 'KALA Connect',
        description: `Order for ${form.fullName}`,
        order_id: data.order.razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await API.post('/orders/razorpay/verify-payment', {
              orderId: data.order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            await fetchCart();
            toast.success('Payment successful! Order confirmed.');
            navigate(`/order-success/${verifyRes.data.order._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: form.fullName,
          email: localStorage.getItem('userEmail') || '',
          contact: form.phone,
        },
        theme: {
          color: '#D4AF37',
        },
        modal: {
          ondismiss: async () => {
            // Handle payment cancellation
            try {
              await API.post('/orders/razorpay/payment-failed', {
                orderId: data.order._id,
                reason: 'User cancelled payment',
              });
              toast.error('Payment cancelled. Order has been cancelled.');
            } catch (err) {
              console.error('Error handling payment failure:', err);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post('/orders', {
        shippingAddress: form,
        paymentMethod: 'cod',
      });
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else if (paymentMethod === 'cod') {
      await handleCODOrder();
    }
  };

  const gstAmount = Math.round(total * 0.18);
  const grandTotal = total + gstAmount;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-24 pb-20 page-container">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Final Step</p>
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-10">
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 flex items-center justify-center text-xs font-sans font-bold border ${
                step > i + 1 ? 'bg-gold-500 border-gold-500 text-ink-900' :
                step === i + 1 ? 'border-gold-500 text-gold-400' :
                'border-ink-600 text-parchment-300/30'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-sans hidden sm:block ${step === i + 1 ? 'text-parchment-100' : 'text-parchment-300/40'}`}>
                {label}
              </span>
            </div>
            {i < 2 && <div className={`flex-1 h-px max-w-16 ${step > i + 1 ? 'bg-gold-500/50' : 'bg-ink-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="card-dark p-6">
              <h2 className="font-display text-parchment-100 text-xl mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-dark">Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleFormChange} placeholder="As on ID" className="input-dark" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-dark">Address</label>
                  <input name="address" value={form.address} onChange={handleFormChange} placeholder="House, Street, Area" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">City</label>
                  <input name="city" value={form.city} onChange={handleFormChange} placeholder="Mumbai" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">State</label>
                  <input name="state" value={form.state} onChange={handleFormChange} placeholder="Maharashtra" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">PIN Code</label>
                  <input name="zip" value={form.zip} onChange={handleFormChange} placeholder="400001" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">Country</label>
                  <input name="country" value={form.country} disabled className="input-dark opacity-60" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-dark">Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} placeholder="+91 98765 43210" className="input-dark" />
                </div>
              </div>
              <button onClick={() => { if (validateStep1()) setStep(2); }} className="btn-gold mt-6 px-8 py-3">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card-dark p-6">
              <h2 className="font-display text-parchment-100 text-xl mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((pm) => (
                  <button key={pm.value} onClick={() => setPaymentMethod(pm.value)}
                    className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-all ${
                      paymentMethod === pm.value
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-ink-600 hover:border-ink-400'}`}>
                    <span className="text-2xl">{pm.emoji}</span>
                    <div>
                      <p className={`font-sans text-sm font-medium ${paymentMethod === pm.value ? 'text-gold-300' : 'text-parchment-100'}`}>
                        {pm.label}
                      </p>
                      {pm.value === 'razorpay' && <p className="text-parchment-300/30 text-xs font-sans mt-0.5">Secure payment via Razorpay</p>}
                      {pm.value === 'cod' && <p className="text-parchment-300/30 text-xs font-sans mt-0.5">Pay when order is delivered</p>}
                    </div>
                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === pm.value ? 'border-gold-500' : 'border-ink-500'}`}>
                      {paymentMethod === pm.value && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline px-6 py-3">← Back</button>
                <button onClick={() => setStep(3)} className="btn-gold px-8 py-3">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card-dark p-6">
              <h2 className="font-display text-parchment-100 text-xl mb-6">Review Your Order</h2>

              {/* Shipping summary */}
              <div className="mb-5">
                <p className="label-dark mb-2">Shipping to</p>
                <p className="text-parchment-200 font-sans text-sm">{form.fullName}</p>
                <p className="text-parchment-300/60 font-sans text-sm">{form.address}, {form.city}, {form.state} — {form.zip}</p>
                <p className="text-parchment-300/60 font-sans text-sm">{form.phone}</p>
              </div>

              <div className="mb-5">
                <p className="label-dark mb-2">Payment Method</p>
                <p className="text-parchment-200 font-sans text-sm">
                  {PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}
                </p>
              </div>

              <div className="gold-line mb-5" />

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const imgSrc = product.images?.[0]
                    ? (product.images[0].startsWith('http') ? product.images[0] : `${IMG_BASE}${product.images[0]}`)
                    : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=60';
                  return (
                    <div key={product._id} className="flex items-center gap-3">
                      <img src={imgSrc} alt={product.title} className="w-12 h-12 object-cover bg-ink-700"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=60'; }} />
                      <div className="flex-1">
                        <p className="text-parchment-100 font-sans text-sm line-clamp-1">{product.title}</p>
                        <p className="text-parchment-300/40 font-sans text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-parchment-200 font-sans text-sm font-medium">
                        ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-outline px-6 py-3">← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-gold flex-1 py-3 disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : `Complete Purchase — ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="card-dark p-5 sticky top-24">
            <h3 className="font-display text-parchment-100 text-base mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm font-sans mb-4">
              <div className="flex justify-between">
                <span className="text-parchment-300/60">Subtotal</span>
                <span className="text-parchment-200">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment-300/60">GST (18%)</span>
                <span className="text-parchment-200">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment-300/60">Shipping</span>
                <span className="text-sage-400 text-xs">Free</span>
              </div>
            </div>
            <div className="gold-line mb-4" />
            <div className="flex justify-between items-center">
              <span className="font-display text-parchment-100">Total</span>
              <span className="font-display text-gold-400 text-xl font-semibold">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-4 p-3 bg-ink-700/50 border border-ink-600">
              <p className="text-parchment-300/40 text-xs font-sans text-center">🔒 Secure checkout powered by Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
