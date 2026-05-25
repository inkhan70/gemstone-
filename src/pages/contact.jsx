import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';
import axios from 'axios';

export default function Contact() {
  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Contact — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div className="pt-28 pb-12 bg-luxury-dark border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Reach Out</span>
          <h1 className="font-serif text-5xl text-luxury-cream mt-2 mb-4">Contact Us</h1>
          <p className="text-luxury-cream/50 max-w-xl">
            Our team of gemological experts and customer liaison specialists are available to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="font-serif text-3xl text-luxury-cream mb-8">Send a Message</h2>

            {success ? (
              <div className="luxury-card rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-serif text-2xl text-luxury-gold mb-2">Message Sent</h3>
                <p className="text-luxury-cream/60">Our team will respond within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="btn-gold px-6 py-2 rounded text-sm mt-6">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-1 block">Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="luxury-input w-full px-4 py-3 rounded-lg text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-1 block">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="luxury-input w-full px-4 py-3 rounded-lg text-sm" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-1 block">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="luxury-input w-full px-4 py-3 rounded-lg text-sm">
                    <option value="" className="bg-luxury-dark">Select a topic</option>
                    <option value="auction" className="bg-luxury-dark">Auction Inquiry</option>
                    <option value="certification" className="bg-luxury-dark">Certification</option>
                    <option value="seller" className="bg-luxury-dark">Become a Seller</option>
                    <option value="shipping" className="bg-luxury-dark">Shipping & Returns</option>
                    <option value="other" className="bg-luxury-dark">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-1 block">Message *</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="luxury-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                    placeholder="Tell us how we can help..."></textarea>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-gold px-8 py-3 rounded text-sm disabled:opacity-70">
                  {loading ? 'Sending...' : 'SEND MESSAGE →'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 className="font-serif text-3xl text-luxury-cream mb-8">Get In Touch</h2>
            <div className="space-y-6 mb-10">
              {[
                { icon: '✉', label: 'Email', value: 'info@gildedsanctuary.com' },
                { icon: '☎', label: 'Phone', value: '+1 (234) 567-890' },
                { icon: '📍', label: 'Address', value: 'International Gemstone District, Suite 1200' },
                { icon: '🕐', label: 'Hours', value: 'Mon-Fri 9AM-6PM EST' },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg border border-luxury-gold/30 flex items-center justify-center text-lg flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-luxury-cream/40 text-xs uppercase tracking-wider">{c.label}</p>
                    <p className="text-luxury-cream text-sm mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="luxury-card rounded-xl p-6">
              <h3 className="font-serif text-xl text-luxury-gold mb-3">Emergency Lot Support</h3>
              <p className="text-luxury-cream/50 text-sm leading-relaxed mb-4">
                For urgent matters related to active auctions, use our priority hotline available 24/7 during live bidding events.
              </p>
              <button className="btn-gold-outline px-5 py-2 rounded text-xs">PRIORITY CONTACT →</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
