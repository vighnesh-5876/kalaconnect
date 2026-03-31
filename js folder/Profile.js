import React, { useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import API from './axios';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:5000';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      formData.append('location', form.location);
      formData.append('website', form.website);
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = avatarPreview || (user?.avatar ? `${IMG_BASE}${user.avatar}` : null);

  return (
    <div className="pt-24 pb-20 page-container max-w-2xl">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">Account</p>
      <h1 className="section-title mb-8">My Profile</h1>

      <div className="card-dark p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-ink-700">
          <div className="relative">
            <div className="w-20 h-20 bg-ink-600 border-2 border-ink-500 overflow-hidden flex items-center justify-center">
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-parchment-300 text-3xl font-semibold">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-gold-500 flex items-center justify-center hover:bg-gold-400 transition-colors">
              <svg className="w-3.5 h-3.5 text-ink-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div>
            <p className="font-display text-parchment-100 text-xl">{user?.name}</p>
            <p className="text-parchment-300/40 font-sans text-sm">{user?.email}</p>
            <span className="badge-gold mt-1.5">{user?.role === 'seller' ? 'Artist' : 'Collector'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-dark">Display Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={user?.role === 'seller' ? 'Tell collectors about your art and process...' : 'Tell us about yourself...'}
              className="input-dark resize-none h-28" maxLength={500} />
            <p className="text-parchment-300/20 text-xs font-sans mt-1 text-right">{form.bio.length}/500</p>
          </div>
          <div>
            <label className="label-dark">Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Mumbai, India" className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Website</label>
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yoursite.com" type="url" className="input-dark" />
          </div>

          {/* Read-only info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-ink-700/40 border border-ink-600">
            <div>
              <p className="label-dark mb-1">Email</p>
              <p className="text-parchment-300/60 font-sans text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="label-dark mb-1">Member Since</p>
              <p className="text-parchment-300/60 font-sans text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
            {user?.role === 'seller' && (
              <div>
                <p className="label-dark mb-1">Total Sales</p>
                <p className="text-gold-400 font-display text-sm">₹{(user?.totalSales || 0).toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
