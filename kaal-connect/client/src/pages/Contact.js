import React, { useState } from 'react';
import WhatsAppButton from '../components/WhatsAppButton';
import toast from 'react-hot-toast';

const CONTACTS = [
  { name: 'Niharika Sonkar', role: 'Artist Relations', email: 'Niharika.sonkar2006@gmail.com', phone: '+91 82867 71199', initials: 'NS', gradient: 'linear-gradient(135deg, #b8a9ff, #7bbbff)' },
  { name: 'Deep Thakare', role: 'Technology', email: 'deepthakare00@gmail.com', phone: '+91 93738 71217', initials: 'DT', gradient: 'linear-gradient(135deg, #7bbbff, #4a9eff)' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent! We\'ll get back to you soon 🎨');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #f5f0ff, #f2fdff)', padding: '60px 0', marginBottom: '60px' }}>
        <div className="page-container text-center">
          <p style={{ color: '#9b8aee', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>Get In Touch</p>
          <h1 className="section-title" style={{ marginBottom: '16px' }}>Contact Us</h1>
          <p style={{ color: '#6b4fbb', fontFamily: 'Inter', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
            Have a question, feedback, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>

          {/* Contact Form */}
          <div className="card-dark" style={{ padding: '40px', borderRadius: '20px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', color: '#3d1f8a', fontSize: '22px', fontWeight: '700', marginBottom: '28px' }}>
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label-dark">Your Name *</label>
                <input className="input-dark" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Arjun Sharma" />
              </div>
              <div>
                <label className="label-dark">Email Address *</label>
                <input className="input-dark" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label-dark">Subject</label>
                <input className="input-dark" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" />
              </div>
              <div>
                <label className="label-dark">Message *</label>
                <textarea className="input-dark" value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us what's on your mind..." rows={5} style={{ resize: 'none' }} />
              </div>
              <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '14px', fontSize: '15px', marginTop: '8px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Sending...
                  </span>
                ) : '✉️ Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '28px', background: '#f5f0ff', borderRadius: '16px', border: '1.5px solid #d4c5ff' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', color: '#3d1f8a', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                📍 Other Ways to Reach Us
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b4fbb', fontFamily: 'Inter', fontSize: '14px' }}>
                  <span>🕐</span> Response time: Within 24 hours
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b4fbb', fontFamily: 'Inter', fontSize: '14px' }}>
                  <span>📅</span> Mon–Sat, 10am–6pm IST
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b4fbb', fontFamily: 'Inter', fontSize: '14px' }}>
                  <span>🌏</span> Based in India
                </div>
              </div>
            </div>

            {CONTACTS.map((c) => (
              <div key={c.name} className="card-dark" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '18px' }}>{c.initials}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Space Grotesk', color: '#3d1f8a', fontWeight: '600', fontSize: '15px' }}>{c.name}</p>
                    <p style={{ color: '#9b8aee', fontSize: '11px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{c.role}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4a9eff', fontFamily: 'Inter', fontSize: '13px', textDecoration: 'none' }}>
                    ✉️ {c.email}
                  </a>
                  <a href={`tel:${c.phone.replace(/\s/g,'')}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b4fbb', fontFamily: 'Inter', fontSize: '13px', textDecoration: 'none' }}>
                    📞 {c.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
}