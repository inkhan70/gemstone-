import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import AuctionCard from '../components/AuctionCard';
import Footer from '../components/Footer';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ALL_GEMS = [
  { id: 1, title: 'Royal Blue Sapphire', carats: 3.25, color: 'Royal Blue', clarity: 'VVS1', category: 'sapphire', currentBid: 15500, startingBid: 12000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80'] },
  { id: 2, title: 'Vivid Red Ruby', carats: 2.01, color: 'Vivid Red', clarity: 'VS2', category: 'ruby', currentBid: 22000, startingBid: 18000, certification: { lab: 'AIGS' }, images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&q=80'] },
  { id: 3, title: 'Colombian Emerald', carats: 4.1, color: 'Vivid Green', clarity: 'SI1', category: 'emerald', currentBid: 18750, startingBid: 15000, certification: { lab: 'SSEF' }, images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80'] },
  { id: 4, title: 'Paraiba Tourmaline', carats: 1.55, color: 'Neon Blue', clarity: 'IF', category: 'other', currentBid: 28000, startingBid: 22000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80'] },
  { id: 5, title: 'Pink Spinel', carats: 3.8, color: 'Hot Pink', clarity: 'VVS2', category: 'other', currentBid: 7200, startingBid: 5000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=80'] },
  { id: 6, title: 'Alexandrite', carats: 0.98, color: 'Color Change', clarity: 'VS1', category: 'other', currentBid: 35000, startingBid: 28000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80'] },
  { id: 7, title: 'Kashmir Sapphire', carats: 5.12, color: 'Cornflower Blue', clarity: 'VVS2', category: 'sapphire', currentBid: 89000, startingBid: 75000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=400&q=80'] },
  { id: 8, title: 'Burma Ruby', carats: 1.87, color: 'Pigeon Blood', clarity: 'VS1', category: 'ruby', currentBid: 45000, startingBid: 38000, certification: { lab: 'GRS' }, images: ['https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&q=80'] },
  { id: 9, title: 'D-Flawless Diamond', carats: 2.5, color: 'D', clarity: 'FL', category: 'diamond', currentBid: 125000, startingBid: 100000, certification: { lab: 'GIA' }, images: ['https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&q=80'] },
];

const CATEGORIES = ['all', 'ruby', 'sapphire', 'emerald', 'diamond', 'other'];
const SORT_OPTIONS = ['Current Bid (High)', 'Current Bid (Low)', 'Carats (High)', 'Carats (Low)', 'Newest First'];

export default function Marketplace() {
  const [authOpen, setAuthOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxBid, setMaxBid] = useState(200000);
  const [minCarats, setMinCarats] = useState(0);

  const filtered = ALL_GEMS
    .filter(g => category === 'all' || g.category === category)
    .filter(g => g.title.toLowerCase().includes(search.toLowerCase()))
    .filter(g => g.currentBid <= maxBid)
    .filter(g => g.carats >= minCarats)
    .sort((a, b) => {
      if (sortBy === 'Current Bid (High)') return b.currentBid - a.currentBid;
      if (sortBy === 'Current Bid (Low)') return a.currentBid - b.currentBid;
      if (sortBy === 'Carats (High)') return b.carats - a.carats;
      if (sortBy === 'Carats (Low)') return a.carats - b.carats;
      return b.id - a.id;
    });

  return (
    <>
      <Head><title>Marketplace — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Header */}
      <div className="pt-28 pb-12 bg-luxury-dark border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Live & Upcoming</span>
          <h1 className="font-serif text-5xl text-luxury-cream mt-2 mb-4">The Marketplace</h1>
          <p className="text-luxury-cream/50 max-w-xl">
            Bid on certified, investment-grade gemstones from vetted ateliers worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-luxury-cream/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gemstones..."
              className="luxury-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="luxury-input px-4 py-3 rounded-lg text-sm"
          >
            {SORT_OPTIONS.map(o => <option key={o} value={o} className="bg-luxury-dark">{o}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-gold-outline px-5 py-3 rounded-lg text-sm flex items-center gap-2"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="luxury-card rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-2 block">Max Bid: ${maxBid.toLocaleString()}</label>
              <input type="range" min="1000" max="200000" step="1000" value={maxBid}
                onChange={(e) => setMaxBid(parseInt(e.target.value))}
                className="w-full accent-luxury-gold" />
            </div>
            <div>
              <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-2 block">Min Carats: {minCarats}</label>
              <input type="range" min="0" max="10" step="0.1" value={minCarats}
                onChange={(e) => setMinCarats(parseFloat(e.target.value))}
                className="w-full accent-luxury-gold" />
            </div>
            <div>
              <label className="text-luxury-cream/50 text-xs uppercase tracking-wider mb-2 block">Certification</label>
              <div className="flex flex-wrap gap-2">
                {['GIA', 'AIGS', 'SSEF', 'GRS'].map(c => (
                  <button key={c} className="px-3 py-1 rounded text-xs btn-gold-outline">{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-5 py-2 rounded text-xs uppercase tracking-widest transition-all ${
                category === c ? 'btn-gold' : 'btn-gold-outline'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-luxury-cream/40 text-sm mb-6">
          Showing <span className="text-luxury-gold">{filtered.length}</span> lots
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((gem) => (
              <AuctionCard key={gem.id} gem={gem} onAuthRequired={() => setAuthOpen(true)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-luxury-cream/30">
            <div className="text-6xl mb-4">💎</div>
            <p className="text-lg">No gemstones match your filters</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
