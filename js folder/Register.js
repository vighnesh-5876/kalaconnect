import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'seller') setForm((f) => ({ ...f, role: 'seller' }));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email || !form.password) { toast.error('Please fill all required fields'); return; }
    if (form.name.trim().length < 2) { toast.error('Name must be at least 2 characters'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    try {
      setLoading(true);
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Welcome to Kaal Connect, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-12 bg-ink-900">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #d4a843 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 border border-gold-500/60 flex items-center justify-center">
              <span className="text-gold-500 font-display font-bold text-xl">K</span>
            </div>
            <span className="font-display text-parchment-50 text-xl">Kaal Connect</span>
          </Link>
          <p className="text-parchment-300/40 font-sans text-sm mt-3">Create your account</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: 'buyer', label: 'Art Collector', desc: 'Browse & purchase art', emoji: '🎨' },
            { value: 'seller', label: 'Artist', desc: 'Sell your creations', emoji: '✍️' },
          ].map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setForm({ ...form, role: role.value })}
              className={`p-4 border-2 text-left transition-all duration-200 ${
                form.role === role.value
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-ink-600 bg-ink-800 hover:border-ink-400'
              }`}
            >
              <div className="text-2xl mb-1.5">{role.emoji}</div>
              <p className={`font-display text-sm font-medium mb-0.5 ${form.role === role.value ? 'text-gold-300' : 'text-parchment-100'}`}>
                {role.label}
              </p>
              <p className="text-parchment-300/40 text-xs font-sans">{role.desc}</p>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="input-dark"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="label-dark">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-dark"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-dark">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="input-dark pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-300/40 hover:text-parchment-300/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={showPassword
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="label-dark">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
                className="input-dark"
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-rust-400 text-xs font-sans mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Password strength */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = form.password.length >= 12 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 6 ? 2 : 1;
                    return (
                      <div key={level} className={`h-1 flex-1 transition-colors ${level <= strength
                        ? strength <= 1 ? 'bg-rust-500' : strength <= 2 ? 'bg-gold-600' : 'bg-sage-500'
                        : 'bg-ink-600'}`} />
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 text-base mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : `Join as ${form.role === 'seller' ? 'Artist' : 'Collector'}`}
            </button>
          </form>

          <div className="gold-line my-6" />

          <p className="text-center text-parchment-300/40 font-sans text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
