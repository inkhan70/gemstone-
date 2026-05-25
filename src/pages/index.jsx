import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AuctionCard from '../components/AuctionCard';
import Footer from '../components/Footer';

const MOCK_GEMS = [
  { id: 1, title: 'Royal Blue Sapphire', carats: 3.25, color: 'Royal Blue', clarity: 'VVS1', category: 'sapphire', currentBid: 15500, startingBid: 12000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80'] },
  { id: 2, title: 'Vivid Red Ruby', carats: 2.01, color: 'Vivid Red', clarity: 'VS2', category: 'ruby', currentBid: 22000, startingBid: 18000, certification: { lab: 'AIGS' }, images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&q=80'] },
  { id: 3, title: 'Colombian Emerald', carats: 4.1, color: 'Vivid Green', clarity: 'SI1', category: 'emerald', currentBid: 18750, startingBid: 15000, certification: { lab: 'SSEF' }, images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80'] },
  { id: 4, title: 'Paraiba Tourmaline', carats: 1.55, color: 'Neon Blue', clarity: 'IF', category: 'other', currentBid: 28000, startingBid: 22000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80'] },
  { id: 5, title: 'Pink Spinel', carats: 3.8, color: 'Hot Pink', clarity: 'VVS2', category: 'other', currentBid: 7200, startingBid: 5000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=80'] },
  { id: 6, title: 'Alexandrite', carats: 0.98, color: 'Color Change', clarity: 'VS1', category: 'other', currentBid: 35000, startingBid: 28000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'] },
];

const STATS = [
  { value: '2,400+', label: 'Certified Lots' },
  { value: '$48M+', label: 'Total Sold' },
  { value: '140+', label: 'Countries' },
  { value: '98%', label: 'Satisfaction' },
];

export default function Home() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const heroRef = useRef(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const handleScroll = () => setParallax(window.scrollY * 0.3);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>The Gilded Sanctuary — Rare Minerals. Absolute Trust.</title>
      </Head>

      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at center, #2a2a1a 0%, #0d0d0b 70%)' }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-luxury-gold opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${parallax * (0.1 + Math.random() * 0.5)}px)`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Gold texture lines */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(201,168,76,0.03) 80px, rgba(201,168,76,0.03) 81px)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Brand label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-luxury-gold/60"></div>
            <span className="text-luxury-gold/80 text-xs uppercase tracking-[0.4em] font-medium">The Gilded Sanctuary</span>
            <div className="h-px w-16 bg-luxury-gold/60"></div>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-luxury-cream leading-[0.9] mb-4">
            Rare Minerals.
          </h1>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl italic text-gold-gradient leading-[0.9] mb-10">
            Absolute Trust.
          </h1>

          <p className="text-luxury-cream/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The premier international auction house for certified, investment-grade gemstones.
            Curated for the discerning collector.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace" className="btn-gold px-10 py-4 rounded text-sm inline-block">
              ENTER THE AUCTION →
            </Link>
            <Link href="/sellers" className="btn-gold-outline px-10 py-4 rounded text-sm inline-block">
              VIEW ATELIERS
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-luxury-cream/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-luxury-gold/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* THE STANDARD */}
      <section className="py-24 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Our Philosophy</span>
            <h2 className="font-serif text-5xl text-luxury-cream mt-3 mb-4">The Standard</h2>
            <p className="text-luxury-cream/50 max-w-2xl mx-auto">
              We do not merely list stones; we curate legacies. Every facet of our platform is engineered
              to provide an uncompromising environment of security, transparency, and luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏛',
                title: 'Rigorous Certification',
                desc: 'Every gemstone is accompanied by verified documentation from GIA, AIGS, and SSEF. We mandate absolute transparency in origin, treatment, and grading.',
              },
              {
                icon: '🔐',
                title: 'Vetted Ateliers',
                desc: 'Our sellers are vetted partners, not merely users. We conduct stringent background checks and require proof of industry standing before granting storefront privileges.',
              },
              {
                icon: '⚡',
                title: 'The Bully Engine',
                desc: 'Experience acquisition through our proprietary real-time auction engine with millisecond-precise countdowns and automated, irrevocable winner selection.',
              },
            ].map((feature) => (
              <div key={feature.title} className="luxury-card rounded-xl p-8 text-center group hover:bg-luxury-charcoal/50 transition-all">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="font-serif text-xl text-luxury-gold mb-3">{feature.title}</h3>
                <p className="text-luxury-cream/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE AUCTIONS */}
      <section className="py-24 bg-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Curated Selection</span>
              <h2 className="font-serif text-5xl text-luxury-cream mt-2">Live Auctions</h2>
            </div>
            <Link href="/marketplace" className="btn-gold-outline px-6 py-2 rounded text-xs hidden md:block">
              VIEW ALL LOTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_GEMS.map((gem) => (
              <AuctionCard
                key={gem.id}
                gem={gem}
                onAuthRequired={() => setAuthOpen(true)}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/marketplace" className="btn-gold-outline px-8 py-3 rounded text-xs inline-block">
              VIEW ALL LOTS →
            </Link>
          </div>
        </div>
      </section>

      {/* SELLERS */}
      <section className="py-24 bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">The Network</span>
            <h2 className="font-serif text-5xl text-luxury-cream mt-3">Certified Ateliers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { name: "Wonderland Crafts", tag: "ALICE'S ARTISAN CORNER", rating: 4.9, specialty: "Colored Stones", sales: 142 },
              { name: "Silent Film", tag: "THE REEL VINTAGE", rating: 4.7, specialty: "Antique Jewels", sales: 89 },
              { name: "Apex Minerals", tag: "APEX GEM ATELIER", rating: 5.0, specialty: "Investment Stones", sales: 217 },
            ].map((seller) => (
              <div key={seller.name} className="luxury-card rounded-xl p-6 flex items-start gap-4 group hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center text-luxury-black font-bold text-xl font-serif">
                  {seller.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-luxury-cream/40 text-xs tracking-widest uppercase mb-0.5">{seller.tag}</p>
                  <h3 className="font-serif text-lg text-luxury-cream">{seller.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-luxury-gold text-sm">★ {seller.rating}</span>
                    <span className="text-luxury-cream/30 text-xs">|</span>
                    <span className="text-luxury-cream/40 text-xs">{seller.sales} sales</span>
                    <span className="text-luxury-cream/30 text-xs">|</span>
                    <span className="text-luxury-gold/70 text-xs">{seller.specialty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/sellers" className="btn-gold-outline px-8 py-3 rounded text-xs inline-block">
              EXPLORE ALL ATELIERS →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-luxury-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a84c, transparent 70%)' }}
        />
        <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
          <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Join The Sanctuary</span>
          <h2 className="font-serif text-5xl text-luxury-cream mt-4 mb-6">Acquire the Exceptional</h2>
          <p className="text-luxury-cream/50 text-lg mb-10">
            Register as a collector to participate in live auctions, or apply as a shopkeeper
            to present your inventory to a global audience of connoisseurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setAuthOpen(true)}
              className="btn-gold px-10 py-4 rounded text-sm"
            >
              ENTER THE MARKETPLACE
            </button>
            <Link href="/contact" className="btn-gold-outline px-10 py-4 rounded text-sm inline-block">
              BECOME A SELLER
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
