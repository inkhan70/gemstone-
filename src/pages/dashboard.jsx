import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab]             = useState(router.query.tab || 'overview');
  const [vendors, setVendors]     = useState([]);
  const [bids, setBids]           = useState([]);
  const [callState, setCallState] = useState(null); // null | 'calling' | 'active' | 'ended'
  const [callTarget, setCallTarget] = useState(null);
  const callTimerRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated' && session?.user?.role === 'seller') router.push('/seller-studio');
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    // Fetch vendor directory
    fetch('/api/vendors').then(r => r.json()).then(d => setVendors(d.vendors || []));
    // Fetch user bids
    fetch('/api/collector/bids').then(r => r.json()).then(d => setBids(d.bids || []));
  }, [status]);

  // Voice call timer
  useEffect(() => {
    if (callState === 'active') {
      callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      clearInterval(callTimerRef.current);
      if (callState !== 'active') setCallDuration(0);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callState]);

  async function initiateVoiceCall(seller) {
    setCallTarget(seller);
    setCallState('calling');
    try {
      const res = await fetch('/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: seller._id }),
      });
      const data = await res.json();
      if (data.token) {
        // Agora SDK would use data.token and data.channelName here
        setTimeout(() => setCallState('active'), 1500); // simulated connect
      }
    } catch (e) {
      setCallState('ended');
    }
  }

  function endCall() {
    setCallState('ended');
    fetch('/api/voice/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId: callTarget?._id, durationSeconds: callDuration }),
    });
    setTimeout(() => { setCallState(null); setCallTarget(null); }, 2000);
  }

  const formatDuration = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (status === 'loading') return <div className="min-h-screen bg-luxury-black flex items-center justify-center"><div className="text-luxury-gold font-serif text-xl animate-pulse">Loading...</div></div>;
  if (!session) return null;

  return (
    <>
      <Head><title>Dashboard — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => {}} />

      {/* ── VOICE CALL OVERLAY ── */}
      {callState && (
        <div className="fixed inset-0 z-50 bg-luxury-black/90 flex items-center justify-center backdrop-blur-sm">
          <div className="luxury-card rounded-2xl p-10 text-center max-w-sm w-full mx-4">
            <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black text-3xl font-serif mx-auto mb-4">
              {callTarget?.name?.[0] || 'S'}
            </div>
            <h3 className="font-serif text-2xl text-luxury-cream mb-1">{callTarget?.name}</h3>
            <p className="text-luxury-cream/40 text-xs mb-6">
              {callState === 'calling' && 'Connecting...'}
              {callState === 'active'  && `Connected · ${formatDuration(callDuration)}`}
              {callState === 'ended'   && 'Call ended'}
            </p>
            {callState === 'calling' && (
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            )}
            {callState === 'active' && (
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                <span className="text-green-400 text-2xl">🎙</span>
              </div>
            )}
            {(callState === 'calling' || callState === 'active') && (
              <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center mx-auto text-white text-2xl transition-all">
                📵
              </button>
            )}
            {callState === 'ended' && <p className="text-luxury-cream/50 text-sm">Duration: {formatDuration(callDuration)}</p>}
          </div>
        </div>
      )}

      <div className="pt-24 pb-16 min-h-screen bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            {session.user?.image
              ? <img src={session.user.image} alt="" className="w-14 h-14 rounded-full border-2 border-luxury-gold" />
              : <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-xl font-serif">{session.user?.name?.[0]}</div>
            }
            <div>
              <p className="text-luxury-cream/50 text-xs uppercase tracking-widest">Collector Dashboard</p>
              <h1 className="font-serif text-3xl text-luxury-cream">{session.user?.name}</h1>
              <p className="text-luxury-cream/40 text-sm">{session.user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-luxury-gold/10">
            {['overview','bids','vendors','upgrade'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-xs uppercase tracking-widest transition-all ${tab === t ? 'text-luxury-gold border-b-2 border-luxury-gold -mb-px' : 'text-luxury-cream/40 hover:text-luxury-cream/70'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Active Bids',    value: bids.filter(b => b.status === 'live').length, icon: '⚡' },
                  { label: 'Auctions Won',   value: bids.filter(b => b.status === 'won').length,  icon: '🏆' },
                  { label: 'Total Spent',    value: `$${bids.filter(b => b.status === 'won').reduce((s,b) => s + (b.amount||0), 0).toLocaleString()}`, icon: '💰' },
                  { label: 'Watchlist',      value: '0', icon: '👁' },
                ].map(s => (
                  <div key={s.label} className="luxury-card rounded-xl p-5 text-center">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className="font-serif text-2xl text-luxury-gold">{s.value}</p>
                    <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="luxury-card rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">💎</div>
                <h2 className="font-serif text-2xl text-luxury-cream mb-2">Start Collecting</h2>
                <p className="text-luxury-cream/50 mb-6">Browse live auctions, place bids, or call sellers directly.</p>
                <Link href="/marketplace" className="btn-gold px-8 py-3 rounded text-sm inline-block">BROWSE AUCTIONS →</Link>
              </div>
            </div>
          )}

          {/* ── BIDS ── */}
          {tab === 'bids' && (
            <div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-6">Your Bids</h2>
              {bids.length === 0
                ? <div className="text-center py-16 luxury-card rounded-xl"><p className="text-luxury-cream/40">No bids placed yet</p></div>
                : (
                  <div className="space-y-4">
                    {bids.map((bid, i) => (
                      <div key={i} className="luxury-card rounded-xl p-5 flex items-center justify-between">
                        <div>
                          <p className="text-luxury-cream font-serif">{bid.gemstoneTitle || 'Gemstone'}</p>
                          <p className="text-luxury-cream/40 text-xs mt-1">Bid: ${bid.amount?.toLocaleString()}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border ${bid.isWinning ? 'border-green-500/40 text-green-400' : 'border-luxury-gold/20 text-luxury-cream/40'}`}>
                          {bid.isWinning ? '↑ Winning' : 'Outbid'}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {/* ── VENDOR DIRECTORY (geolocation + voice call) ── */}
          {tab === 'vendors' && (
            <div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-2">Premium Vendor Directory</h2>
              <p className="text-luxury-cream/40 text-sm mb-6">Tap the call button to connect with a seller via voice.</p>
              {vendors.length === 0
                ? <div className="text-center py-16 luxury-card rounded-xl"><p className="text-luxury-cream/40">Loading vendors...</p></div>
                : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {vendors.map(vendor => (
                      <VendorCard key={vendor._id} vendor={vendor} onCall={() => initiateVoiceCall(vendor)} />
                    ))}
                  </div>
                )
              }
            </div>
          )}

          {/* ── UPGRADE ── */}
          {tab === 'upgrade' && (
            <div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-6">Upgrade to Seller</h2>
              <p className="text-luxury-cream/50 mb-8">Become a verified seller and list your gemstones on the Sanctuary.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { tier: 'starter', price: '$14.99/mo', features: ['50 listings','1 live auction','3 images/item'] },
                  { tier: 'medium',  price: '$29.99/mo', features: ['100 listings','2 live auctions','5 images/item'], highlight: true },
                  { tier: 'ultimate',price: '$79.99/mo', features: ['Unlimited','10 live auctions','10 images/item'] },
                ].map(plan => (
                  <div key={plan.tier} className={`luxury-card rounded-xl p-7 ${plan.highlight ? 'border border-luxury-gold/40' : ''}`}>
                    <p className="text-luxury-gold text-xs uppercase tracking-widest mb-1">{plan.tier}</p>
                    <p className="font-serif text-3xl text-luxury-cream mb-4">{plan.price}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map(f => <li key={f} className="text-luxury-cream/60 text-sm flex gap-2"><span className="text-luxury-gold">✦</span>{f}</li>)}
                    </ul>
                    <Link href={`/checkout?plan=${plan.tier}`} className="btn-gold w-full py-3 rounded text-xs text-center block">SELECT PLAN →</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function VendorCard({ vendor, onCall }) {
  return (
    <div className="luxury-card rounded-xl overflow-hidden">
      <div className="h-28 overflow-hidden relative">
        <img src={vendor.banner || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80'} alt="" className="w-full h-full object-cover" />
        {vendor.isVerified && (
          <div className="absolute top-2 right-2 bg-luxury-gold text-luxury-black text-xs px-2 py-0.5 rounded font-semibold">✓ Verified</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-luxury-cream">{vendor.shopName}</h3>
            <p className="text-luxury-cream/40 text-xs mt-0.5">{vendor.tagline}</p>
            {vendor.geolocation?.city && (
              <p className="text-luxury-cream/30 text-xs mt-1">📍 {vendor.geolocation.city}, {vendor.geolocation.country}</p>
            )}
          </div>
          <button onClick={onCall}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold transition-all"
            title="Voice Call"
          >
            📞
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-luxury-gold text-xs">★ {vendor.rating?.toFixed(1)}</span>
          <span className="text-luxury-cream/30 text-xs">{vendor.totalSales} sales</span>
        </div>
      </div>
    </div>
  );
}
