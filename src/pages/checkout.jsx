import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Checkout() {
  const router   = useRouter();
  const { id, plan } = router.query;
  const { data: session } = useSession();

  const [gem, setGem]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep]     = useState(1); // 1=address, 2=payment, 3=confirm
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({ name: session?.user?.name || '', email: session?.user?.email || '', street: '', city: '', state: '', zip: '', country: '' });

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/gemstones?id=${id}`)
      .then(r => r.json())
      .then(d => setGem(d.gemstones?.[0] || null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (session?.user) setAddress(a => ({ ...a, name: a.name || session.user.name, email: a.email || session.user.email }));
  }, [session]);

  async function handleCheckout(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemstoneId: id, planTier: plan, address, amount: gem?.price || 0 }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(data.message || 'Checkout failed'); setSubmitting(false); }
  }

  const fields = (obj, onChange) => [
    { key: 'name',    label: 'Full Name',       col: 2 },
    { key: 'email',   label: 'Email Address',   col: 2, type: 'email' },
    { key: 'street',  label: 'Street Address',  col: 2 },
    { key: 'city',    label: 'City',            col: 1 },
    { key: 'state',   label: 'State / Province',col: 1 },
    { key: 'zip',     label: 'Postal Code',     col: 1 },
    { key: 'country', label: 'Country',         col: 1 },
  ];

  return (
    <>
      <Head><title>Checkout — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => {}} />

      <div className="pt-24 pb-16 min-h-screen bg-luxury-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Secure Purchase</span>
            <h1 className="font-serif text-4xl text-luxury-cream mt-2">Checkout</h1>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {['Delivery','Payment','Confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i ? 'bg-luxury-gold text-luxury-black' : step === i+1 ? 'border border-luxury-gold text-luxury-gold' : 'border border-luxury-cream/20 text-luxury-cream/30'}`}>
                  {step > i ? '✓' : i+1}
                </div>
                <span className={`text-xs uppercase tracking-widest ${step === i+1 ? 'text-luxury-gold' : 'text-luxury-cream/30'}`}>{s}</span>
                {i < 2 && <div className="w-8 h-px bg-luxury-gold/20 mx-1" />}
              </div>
            ))}
          </div>

          <div className="luxury-card rounded-xl p-8">
            {/* Item summary */}
            {gem && (
              <div className="flex gap-4 mb-8 pb-8 border-b border-luxury-gold/10">
                <img src={gem.images?.[0]} alt={gem.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h3 className="font-serif text-luxury-cream">{gem.title}</h3>
                  <p className="text-luxury-cream/40 text-sm">{gem.carats} ct · {gem.color}</p>
                  <p className="text-luxury-gold text-lg font-serif mt-1">${(gem.price || 0).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <h2 className="font-serif text-xl text-luxury-cream mb-6">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {fields().map(({ key, label, col, type }) => (
                    <div key={key} className={col === 2 ? 'col-span-2' : 'col-span-1'}>
                      <label className="text-luxury-cream/60 text-xs uppercase tracking-widest block mb-2">{label}</label>
                      <input type={type || 'text'} required
                        className="w-full bg-luxury-black/50 border border-luxury-gold/20 rounded px-3 py-2.5 text-luxury-cream text-sm focus:outline-none focus:border-luxury-gold/50"
                        value={address[key]}
                        onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-gold w-full py-4 rounded text-sm mt-6">CONTINUE TO PAYMENT →</button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-xl text-luxury-cream mb-4">Payment</h2>
                <p className="text-luxury-cream/50 text-sm mb-8">You will be redirected to our secure payment processor (Stripe) to complete your purchase.</p>
                <div className="luxury-card rounded-xl p-5 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-luxury-cream/60">Item</span>
                    <span className="text-luxury-cream">${(gem?.price || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-luxury-cream/60">Platform fee (5%)</span>
                    <span className="text-luxury-cream">${((gem?.price || 0) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-luxury-gold/10">
                    <span className="text-luxury-gold font-semibold">Total</span>
                    <span className="text-luxury-gold font-semibold">${((gem?.price || 0) * 1.05).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-gold-outline flex-1 py-4 rounded text-sm">← BACK</button>
                  <button onClick={handleCheckout} disabled={submitting} className="btn-gold flex-1 py-4 rounded text-sm disabled:opacity-50">
                    {submitting ? 'REDIRECTING...' : 'PAY WITH STRIPE →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
