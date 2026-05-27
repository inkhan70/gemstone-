import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TIER_LIMITS } from '../lib/subscriptionLimits';

export default function SellerStudio() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab]           = useState('inventory');
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ title: '', description: '', carats: '', color: '', clarity: '', price: '', isAuctionItem: false, images: [''] });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  const tier  = session?.user?.subscriptionTier || 'free';
  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated' && session?.user?.role !== 'seller') router.push('/dashboard');
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/seller/listings')
      .then(r => r.json())
      .then(d => setListings(d.listings || []))
      .finally(() => setLoading(false));
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setMsg('');
    const res = await fetch('/api/seller/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, carats: parseFloat(form.carats), price: parseFloat(form.price) }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('✅ Listing created successfully');
      setListings(prev => [data.gemstone, ...prev]);
      setForm({ title: '', description: '', carats: '', color: '', clarity: '', price: '', isAuctionItem: false, images: [''] });
    } else {
      setMsg(`❌ ${data.message}`);
    }
    setSaving(false);
  }

  if (status === 'loading') return <LoadingScreen />;
  if (!session) return null;

  return (
    <>
      <Head><title>Seller Studio — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => {}} />

      <div className="pt-24 pb-16 min-h-screen bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Private Studio</span>
              <h1 className="font-serif text-4xl text-luxury-cream mt-1">Seller Studio</h1>
            </div>
            <TierBadge tier={tier} limits={limits} count={listings.length} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-luxury-gold/10">
            {['inventory','upload','storefront','analytics'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-xs uppercase tracking-widest transition-all ${tab === t ? 'text-luxury-gold border-b-2 border-luxury-gold -mb-px' : 'text-luxury-cream/40 hover:text-luxury-cream/70'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── INVENTORY ── */}
          {tab === 'inventory' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-luxury-cream/60 text-sm">
                  {listings.length} / {limits.inventoryLimit === Infinity ? '∞' : limits.inventoryLimit} listings used
                </p>
                <button onClick={() => setTab('upload')} className="btn-gold px-5 py-2 rounded text-xs">+ NEW LISTING</button>
              </div>
              {loading ? <LoadingSkeleton /> : listings.length === 0 ? (
                <EmptyState message="No listings yet. Upload your first gemstone to get started." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listings.map(gem => <InventoryCard key={gem._id} gem={gem} />)}
                </div>
              )}
            </div>
          )}

          {/* ── UPLOAD ── */}
          {tab === 'upload' && (
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl text-luxury-cream mb-6">Upload Gemstone</h2>
              {msg && <div className={`mb-4 p-3 rounded text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{msg}</div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Title" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} required />
                  <FormField label="Color" value={form.color} onChange={v => setForm(p => ({ ...p, color: v }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Weight (carats)" type="number" value={form.carats} onChange={v => setForm(p => ({ ...p, carats: v }))} required />
                  <FormField label="Clarity" value={form.clarity} onChange={v => setForm(p => ({ ...p, clarity: v }))} required />
                </div>
                <FormField label="Description" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} textarea />
                <div className="luxury-card rounded-xl p-4">
                  <label className="text-luxury-cream/60 text-xs uppercase tracking-widest block mb-3">
                    Image URLs (max {limits.imagesPerItem} for {tier} plan)
                  </label>
                  {form.images.slice(0, limits.imagesPerItem).map((url, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        className="flex-1 bg-luxury-black/50 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-cream text-sm focus:outline-none focus:border-luxury-gold/50"
                        placeholder={`Image URL ${i + 1}`}
                        value={url}
                        onChange={e => {
                          const imgs = [...form.images];
                          imgs[i] = e.target.value;
                          setForm(p => ({ ...p, images: imgs }));
                        }}
                      />
                      {i === form.images.length - 1 && form.images.length < limits.imagesPerItem && (
                        <button type="button" onClick={() => setForm(p => ({ ...p, images: [...p.images, ''] }))}
                          className="text-luxury-gold border border-luxury-gold/30 px-3 py-2 rounded text-xs hover:bg-luxury-gold/10">
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Price (USD)" type="number" value={form.price} onChange={v => setForm(p => ({ ...p, price: v }))} required />
                  <div className="luxury-card rounded-xl p-4 flex items-center gap-3">
                    <input type="checkbox" id="isAuction" checked={form.isAuctionItem}
                      onChange={e => setForm(p => ({ ...p, isAuctionItem: e.target.checked }))}
                      disabled={tier === 'free'}
                      className="w-4 h-4 accent-luxury-gold"
                    />
                    <label htmlFor="isAuction" className="text-luxury-cream/70 text-sm cursor-pointer">
                      List as Auction {tier === 'free' && <span className="text-luxury-gold/50 text-xs">(requires Starter+)</span>}
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={saving}
                  className="btn-gold w-full py-4 rounded text-sm disabled:opacity-50">
                  {saving ? 'UPLOADING...' : 'UPLOAD TO MARKETPLACE →'}
                </button>
              </form>
            </div>
          )}

          {/* ── STOREFRONT ── */}
          {tab === 'storefront' && (
            <div className="text-center py-16 luxury-card rounded-xl">
              <div className="text-5xl mb-4">🏪</div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-2">Custom Storefront</h2>
              <p className="text-luxury-cream/50 mb-6">Your public atelier page where collectors discover your gems.</p>
              <a href="/sellers" className="btn-gold px-8 py-3 rounded text-sm inline-block">VIEW MY STOREFRONT →</a>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Listings', value: listings.length, icon: '💎' },
                { label: 'Live Auctions',  value: listings.filter(g => g.status === 'live').length, icon: '⚡' },
                { label: 'Total Views',    value: listings.reduce((s, g) => s + (g.views || 0), 0), icon: '👁' },
                { label: 'Items Sold',     value: listings.filter(g => g.status === 'sold').length, icon: '✅' },
              ].map(s => (
                <div key={s.label} className="luxury-card rounded-xl p-6 text-center">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="font-serif text-3xl text-luxury-gold">{s.value}</p>
                  <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function TierBadge({ tier, limits, count }) {
  const pct = limits.inventoryLimit === Infinity ? 0 : Math.min((count / limits.inventoryLimit) * 100, 100);
  return (
    <div className="luxury-card rounded-xl px-5 py-3 text-right">
      <p className="text-luxury-gold text-xs uppercase tracking-widest">{tier} Plan</p>
      {limits.inventoryLimit !== Infinity && (
        <>
          <p className="text-luxury-cream/60 text-xs mt-1">{count} / {limits.inventoryLimit} listings</p>
          <div className="w-32 h-1 bg-luxury-gold/10 rounded-full mt-2">
            <div className="h-1 bg-luxury-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </>
      )}
    </div>
  );
}

function InventoryCard({ gem }) {
  const statusColors = { live: 'text-green-400', upcoming: 'text-yellow-400', sold: 'text-luxury-cream/30', fixed: 'text-blue-400' };
  return (
    <div className="luxury-card rounded-xl overflow-hidden">
      <div className="h-36 overflow-hidden relative">
        <img src={gem.images?.[0] || 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=400'} alt={gem.title} className="w-full h-full object-cover" />
        <div className={`absolute top-2 right-2 text-xs font-semibold uppercase ${statusColors[gem.status] || 'text-luxury-cream/50'}`}>
          {gem.status}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-luxury-cream text-sm truncate">{gem.title}</h3>
        <p className="text-luxury-cream/40 text-xs mt-1">{gem.carats} ct · {gem.color}</p>
        <p className="text-luxury-gold text-sm mt-2">${(gem.price || gem.currentBid || gem.startingBid || 0).toLocaleString()}</p>
        <p className="text-luxury-cream/30 text-xs mt-1">{gem.views || 0} views</p>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', required, textarea }) {
  const cls = "w-full bg-luxury-black/50 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-cream text-sm focus:outline-none focus:border-luxury-gold/50";
  return (
    <div>
      <label className="text-luxury-cream/60 text-xs uppercase tracking-widest block mb-2">{label}</label>
      {textarea
        ? <textarea className={cls + ' h-20 resize-none'} value={value} onChange={e => onChange(e.target.value)} />
        : <input type={type} className={cls} value={value} onChange={e => onChange(e.target.value)} required={required} />
      }
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-16 luxury-card rounded-xl">
      <div className="text-4xl mb-4">💎</div>
      <p className="text-luxury-cream/50">{message}</p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="text-luxury-gold font-serif text-xl animate-pulse">Loading Studio...</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="luxury-card rounded-xl h-52 animate-pulse bg-luxury-charcoal/50" />
      ))}
    </div>
  );
}
