import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AuctionCard from '../components/AuctionCard';
import Footer from '../components/Footer';

const STATS = [
  { value: '2,400+', label: 'Certified Lots' },
  { value: '$48M+',  label: 'Total Sold' },
  { value: '140+',   label: 'Countries' },
  { value: '98%',    label: 'Satisfaction' },
];

export default function Home() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen]         = useState(false);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [freshMembers, setFreshMembers] = useState([]);
  const [standardGrid, setStandardGrid] = useState([]);
  const [loading, setLoading]           = useState(true);
  const heroRef   = useRef(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => setParallax(window.scrollY * 0.3);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        // Section 1: Live auctions from paid sellers — max 15
        const liveRes = await fetch('/api/homepage?section=live');
        const liveData = await liveRes.json();
        setLiveAuctions(liveData.items || []);

        // Section 2: Fresh members — newest seller's first product, max 12
        const freshRes = await fetch('/api/homepage?section=fresh');
        const freshData = await freshRes.json();
        setFreshMembers(freshData.items || []);

        // Section 3: Standard fixed-price grid
        const stdRes = await fetch('/api/homepage?section=standard');
        const stdData = await stdRes.json();
        setStandardGrid(stdData.items || []);
      } catch (e) {
        console.error('Homepage fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchHomepageData();
  }, []);

  return (
    <>
      <Head>
        <title>The Gilded Sanctuary — Rare Minerals. Absolute Trust.</title>
      </Head>

      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(13,13,11,0.96) 0%, rgba(13,13,11,0.78) 42%, rgba(13,13,11,0.34) 100%), url('/gilded-hero.png')", backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-luxury-gold opacity-20"
              style={{
                left: `${(i * 37) % 100}%`,
                top:  `${(i * 53) % 100}%`,
                transform: `translateY(${parallax * (0.1 + (i % 5) * 0.1)}px)`,
                animation: `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(201,168,76,0.03) 80px, rgba(201,168,76,0.03) 81px)' }}
        />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-luxury-gold/60"></div>
            <span className="text-luxury-gold/80 text-xs uppercase tracking-[0.4em] font-medium">The Gilded Sanctuary</span>
            <div className="h-px w-16 bg-luxury-gold/60"></div>
          </div>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-luxury-cream leading-[0.9] mb-4">Rare Minerals.</h1>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl italic text-gold-gradient leading-[0.9] mb-10">Absolute Trust.</h1>
          <p className="text-luxury-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The premier international auction house for certified, investment-grade gemstones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace" className="btn-gold px-10 py-4 rounded text-sm inline-block">ENTER THE AUCTION →</Link>
            <Link href="/sellers"     className="btn-gold-outline px-10 py-4 rounded text-sm inline-block">VIEW ATELIERS</Link>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-luxury-cream/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-luxury-gold/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-luxury-charcoal border-y border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-luxury-gold mb-1">{s.value}</p>
                <p className="text-luxury-cream/40 text-xs uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 1: BIDDING CAROUSEL — live auctions from paid sellers (max 15) ── */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>
                <span className="text-red-400 text-xs uppercase tracking-[0.3em]">Live Now</span>
              </div>
              <h2 className="font-serif text-5xl text-luxury-cream">Active Auctions</h2>
              <p className="text-luxury-cream/40 text-sm mt-1">Premium seller listings · Real-time bidding</p>
            </div>
            <Link href="/marketplace?status=live" className="btn-gold-outline px-6 py-2 rounded text-xs hidden md:block">
              ALL LIVE LOTS →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="luxury-card rounded-xl h-80 animate-pulse bg-luxury-charcoal/50" />
              ))}
            </div>
          ) : liveAuctions.length === 0 ? (
            <div className="text-center py-16 luxury-card rounded-xl">
              <p className="text-luxury-cream/40 font-serif text-xl">No live auctions at this moment</p>
              <p className="text-luxury-cream/30 text-sm mt-2">Check back soon — new lots are added daily</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAuctions.map((gem) => (
                <AuctionCard key={gem._id} gem={gem} onAuthRequired={() => setAuthOpen(true)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 2: FRESH MEMBERS REGISTRY — newest seller's first product (max 12) ── */}
      <section className="py-24 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">New to the Sanctuary</span>
            <h2 className="font-serif text-5xl text-luxury-cream mt-3 mb-2">Fresh Members</h2>
            <p className="text-luxury-cream/40 text-sm">Newly registered ateliers · First listings only · Chronological order</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="luxury-card rounded-xl h-64 animate-pulse bg-luxury-charcoal/50" />
              ))}
            </div>
          ) : freshMembers.length === 0 ? (
            <div className="text-center py-12 luxury-card rounded-xl">
              <p className="text-luxury-cream/40 font-serif text-lg">No new members yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freshMembers.map((item) => (
                <FreshMemberCard key={item._id} item={item} onAuthRequired={() => setAuthOpen(true)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: STANDARD MARKET GRID — fixed-price items ── */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Buy Now</span>
              <h2 className="font-serif text-5xl text-luxury-cream mt-2">Standard Market</h2>
              <p className="text-luxury-cream/40 text-sm mt-1">Fixed-price listings · Instant purchase</p>
            </div>
            <Link href="/marketplace?type=fixed" className="btn-gold-outline px-6 py-2 rounded text-xs hidden md:block">
              ALL LISTINGS →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="luxury-card rounded-xl h-52 animate-pulse bg-luxury-charcoal/50" />
              ))}
            </div>
          ) : standardGrid.length === 0 ? (
            <div className="text-center py-12 luxury-card rounded-xl">
              <p className="text-luxury-cream/40 font-serif text-lg">No fixed-price listings yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {standardGrid.map((item) => (
                <StandardCard key={item._id} item={item} onAuthRequired={() => setAuthOpen(true)} session={session} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SUBSCRIPTION PLANS ── */}
      <section className="py-24 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Sell on the Sanctuary</span>
            <h2 className="font-serif text-5xl text-luxury-cream mt-3 mb-4">Seller Plans</h2>
            <p className="text-luxury-cream/50 max-w-xl mx-auto">Choose the tier that matches your inventory. Upgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tier: 'starter', price: '$14.99', label: 'Starter', features: ['50 products','3 images / item','1 live auction','500 MB storage','Voice calling'] },
              { tier: 'medium',  price: '$29.99', label: 'Medium',  features: ['100 products','5 images / item','2 live auctions','2 GB storage','Voice calling'], highlight: true },
              { tier: 'ultimate',price: '$79.99', label: 'Ultimate',features: ['Unlimited products','10 images / item','10 live auctions','25 GB storage','Voice calling'] },
            ].map((plan) => (
              <div key={plan.tier} className={`luxury-card rounded-xl p-8 text-center relative ${plan.highlight ? 'border border-luxury-gold/40' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-black text-xs px-4 py-1 rounded-full font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <p className="text-luxury-gold/60 text-xs uppercase tracking-widest mb-2">{plan.label}</p>
                <p className="font-serif text-5xl text-luxury-cream mb-1">{plan.price}</p>
                <p className="text-luxury-cream/40 text-xs mb-8">per month</p>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-luxury-cream/70 text-sm">
                      <span className="text-luxury-gold text-xs">✦</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={session ? '/dashboard?tab=upgrade' : '#'} onClick={!session ? () => setAuthOpen(true) : undefined}
                  className="btn-gold w-full py-3 rounded text-xs text-center block">
                  GET STARTED →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ── Fresh Member Card ─────────────────────────────────────────────────────────
function FreshMemberCard({ item, onAuthRequired }) {
  const img = item.images?.[0] || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&q=80';
  return (
    <div className="luxury-card rounded-xl overflow-hidden group cursor-pointer hover:border-luxury-gold/30 transition-all">
      <div className="relative h-40 overflow-hidden">
        <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 bg-luxury-gold/90 text-luxury-black text-xs px-2 py-0.5 rounded font-semibold">NEW</div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-luxury-cream text-sm truncate">{item.title}</h3>
        <p className="text-luxury-cream/40 text-xs mt-1">{item.carats} ct · {item.color}</p>
        <p className="text-luxury-gold text-sm font-semibold mt-2">
          {item.price ? `$${item.price.toLocaleString()}` : item.startingBid ? `From $${item.startingBid.toLocaleString()}` : 'Enquire'}
        </p>
      </div>
    </div>
  );
}

// ── Standard Market Card ──────────────────────────────────────────────────────
function StandardCard({ item, onAuthRequired, session }) {
  const img = item.images?.[0] || 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=400&q=80';
  return (
    <div className="luxury-card rounded-xl overflow-hidden group cursor-pointer hover:border-luxury-gold/30 transition-all">
      <div className="relative h-36 overflow-hidden">
        <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-3">
        <h3 className="font-serif text-luxury-cream text-xs truncate">{item.title}</h3>
        <p className="text-luxury-cream/40 text-xs mt-0.5">{item.carats} ct</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-luxury-gold text-sm font-semibold">${(item.price || 0).toLocaleString()}</p>
          <button
            onClick={() => session ? window.location.href = `/checkout?id=${item._id}` : onAuthRequired()}
            className="bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold text-xs px-2 py-1 rounded transition-all border border-luxury-gold/20"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
