import React from 'react';
import { Link } from 'react-router-dom';

const TEAM = [
  {
    name: 'Niharika Sonkar',
    role: 'Co-Founder & Artist Relations',
    email: 'Niharika.sonkar2006@gmail.com',
    phone: '+91 82867 71199',
    bio: 'Passionate about connecting artists with the right audience. Niharika leads artist onboarding and community building at KALACONNECT.',
    initials: 'NS',
    gradient: 'linear-gradient(135deg, #b8a9ff, #7bbbff)',
  },
  {
    name: 'Deep Thakare',
    role: 'Co-Founder & Technology',
    email: 'deepthakare00@gmail.com',
    phone: '+91 93738 71217',
    bio: 'Tech enthusiast and creative thinker. Deep handles the platform development and ensures every artist and buyer has a seamless experience.',
    initials: 'DT',
    gradient: 'linear-gradient(135deg, #7bbbff, #4a9eff)',
  },
];

const VALUES = [
  { emoji: '🎨', title: 'Artist First', desc: 'We believe every artist deserves a platform to showcase their work without barriers.' },
  { emoji: '🤝', title: 'Direct Connection', desc: 'We eliminate middlemen so artists earn more and buyers pay fair prices.' },
  { emoji: '🌏', title: 'Made in India', desc: 'Proudly supporting Indian artists and taking their craft to the world.' },
  { emoji: '✨', title: 'Quality Curation', desc: 'Every artwork on KALACONNECT is reviewed to ensure authenticity and quality.' },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #f2fdff 100%)', padding: '80px 0', marginBottom: '80px' }}>
        <div className="page-container text-center">
          <p style={{ color: '#9b8aee', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Story
          </p>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: '800', color: '#3d1f8a', lineHeight: 1.1, marginBottom: '24px' }}>
            Art Deserves a<br />
            <span style={{ background: 'linear-gradient(135deg, #7bbbff, #b8a9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Better Home
            </span>
          </h1>
          <p style={{ color: '#6b4fbb', fontFamily: 'Inter', fontSize: '18px', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 40px' }}>
            KALACONNECT was born from a simple belief — that independent artists deserve a beautiful, fair, and powerful marketplace to share their creations with the world.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn-gold" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Explore Artworks
            </Link>
            <Link to="/register?role=seller" className="btn-outline" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="page-container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '40px', background: 'linear-gradient(135deg, #3d1f8a, #6b4fbb)', borderRadius: '20px', color: '#fff' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎯</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Our Mission</h2>
            <p style={{ fontFamily: 'Inter', fontSize: '15px', lineHeight: '1.8', opacity: 0.85 }}>
              To democratize the art world by giving every independent artist — regardless of background or resources — a world-class platform to sell, connect, and grow.
            </p>
          </div>
          <div style={{ padding: '40px', background: 'linear-gradient(135deg, #1a3d63, #4a7fa7)', borderRadius: '20px', color: '#fff' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👁️</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Our Vision</h2>
            <p style={{ fontFamily: 'Inter', fontSize: '15px', lineHeight: '1.8', opacity: 0.85 }}>
              A world where every home has original art, every artist is fairly compensated, and creativity is celebrated as a profession — not just a hobby.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-container" style={{ marginBottom: '80px' }}>
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p style={{ color: '#9b8aee', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>What We Stand For</p>
          <h2 className="section-title">Our Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {VALUES.map((v) => (
            <div key={v.title} className="card-dark" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{v.emoji}</div>
              <h3 style={{ fontFamily: 'Space Grotesk', color: '#3d1f8a', fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#6b4fbb', fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="page-container" style={{ marginBottom: '80px' }}>
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p style={{ color: '#9b8aee', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>The People Behind It</p>
          <h2 className="section-title">Meet the Team</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          {TEAM.map((member) => (
            <div key={member.name} className="card-dark" style={{ padding: '36px', borderRadius: '20px', textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: member.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(123,187,255,0.3)' }}>
                <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: '800', fontSize: '28px' }}>{member.initials}</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', color: '#3d1f8a', fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{member.name}</h3>
              <p style={{ color: '#9b8aee', fontSize: '12px', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>{member.role}</p>
              <p style={{ color: '#6b4fbb', fontFamily: 'Inter', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>{member.bio}</p>
              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#7bbbff', fontFamily: 'Inter', fontSize: '13px', textDecoration: 'none', padding: '8px 16px', background: '#f2fdff', borderRadius: '8px', border: '1px solid #d4eeff' }}>
                  ✉️ {member.email}
                </a>
                <a href={`tel:${member.phone.replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6b4fbb', fontFamily: 'Inter', fontSize: '13px', textDecoration: 'none', padding: '8px 16px', background: '#f5f0ff', borderRadius: '8px', border: '1px solid #d4c5ff' }}>
                  📞 {member.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #f5f0ff, #f2fdff)', padding: '80px 0', borderTop: '1.5px solid #d4c5ff' }}>
        <div className="page-container text-center">
          <h2 className="section-title" style={{ marginBottom: '16px' }}>Ready to Join KALACONNECT?</h2>
          <p style={{ color: '#6b4fbb', fontFamily: 'Inter', fontSize: '17px', marginBottom: '36px' }}>
            Whether you're an artist or a collector — there's a place for you here.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=seller" className="btn-gold" style={{ padding: '14px 36px', fontSize: '15px' }}>🎨 Start Selling</Link>
            <Link to="/register" className="btn-outline" style={{ padding: '14px 36px', fontSize: '15px' }}>🛍️ Start Collecting</Link>
          </div>
        </div>
      </section>

    </div>
  );
}