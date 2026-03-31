import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Paintings', 'Sculptures', 'Handmade Crafts', 'Photography', 'Digital Art', 'Jewelry', 'Textiles', 'Ceramics', 'Other'];
const IMG_BASE = 'http://localhost:5000';

export default function ProductForm({ product = null, isEdit = false }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState(
    product?.images?.map(img => img.startsWith('http') ? img : `${IMG_BASE}${img}`) || []
  );
  const [imageFiles, setImageFiles] = useState([]);

  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    stock: product?.stock || 1,
    tags: product?.tags?.join(', ') || '',
    dimensions: product?.dimensions || '',
    medium: product?.medium || '',
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed'); return;
    }
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    // Only remove from files if it's a new file (not existing URL)
    const existingCount = (product?.images?.length || 0);
    if (index >= existingCount) {
      const fileIndex = index - existingCount;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) { toast.error('Valid price is required'); return; }
    if (!form.category) { toast.error('Category is required'); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      imageFiles.forEach((file) => formData.append('images', file));

      if (isEdit) {
        await API.put(`/products/${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Artwork updated!');
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Artwork listed successfully!');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save artwork');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 page-container max-w-3xl">
      <p className="text-gold-500/60 text-xs font-sans tracking-[0.3em] uppercase mb-2">
        {isEdit ? 'Edit' : 'New'} Artwork
      </p>
      <h1 className="section-title mb-8">
        {isEdit ? `Edit: ${product?.title}` : 'List Your Artwork'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="card-dark p-6">
          <label className="label-dark mb-3">Images (up to 5)</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group w-24 h-24">
                <img src={src} alt="" className="w-full h-full object-cover bg-ink-700" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-ink-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-rust-400 text-xs font-sans">✕ Remove</span>
                </button>
                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-gold-500/80 text-ink-900 text-[9px] text-center font-sans py-0.5">Main</span>}
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-ink-600 hover:border-gold-500/50 flex flex-col items-center justify-center gap-1 transition-colors">
                <span className="text-parchment-300/30 text-2xl">+</span>
                <span className="text-parchment-300/30 text-[10px] font-sans">Add Image</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          <p className="text-parchment-300/20 text-xs font-sans">JPEG, PNG, WEBP — max 5MB each. First image is the main display.</p>
        </div>

        {/* Basic Info */}
        <div className="card-dark p-6 space-y-4">
          <h2 className="font-display text-parchment-100 text-lg">Artwork Details</h2>
          <div>
            <label className="label-dark">Title *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g. Dancing in the Rain, Oil on Canvas" className="input-dark" maxLength={150} />
          </div>
          <div>
            <label className="label-dark">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Tell collectors about this piece — the inspiration, technique, story behind it..."
              className="input-dark resize-none h-36" maxLength={2000} />
            <p className="text-parchment-300/20 text-xs font-sans mt-1 text-right">{form.description.length}/2000</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Category *</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-dark">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-dark">Price (₹) *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                placeholder="5000" className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Stock / Quantity</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                placeholder="1" className="input-dark" />
            </div>
            <div>
              <label className="label-dark">Medium</label>
              <input value={form.medium} onChange={(e) => setForm({...form, medium: e.target.value})}
                placeholder="Oil on Canvas" className="input-dark" />
            </div>
          </div>
          <div>
            <label className="label-dark">Dimensions</label>
            <input value={form.dimensions} onChange={(e) => setForm({...form, dimensions: e.target.value})}
              placeholder='24" × 36" (61cm × 91cm)' className="input-dark" />
          </div>
          <div>
            <label className="label-dark">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})}
              placeholder="abstract, blue, modern, landscape" className="input-dark" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/seller/products')}
            className="btn-outline flex-1 py-3.5">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-gold flex-1 py-3.5 disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                {isEdit ? 'Saving...' : 'Listing...'}
              </span>
            ) : isEdit ? 'Save Changes' : 'List Artwork'}
          </button>
        </div>
      </form>
    </div>
  );
}
