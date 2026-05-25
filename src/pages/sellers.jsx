import { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import Footer from '../components/Footer';

const SELLERS = [
  { id: 1, name: "Wonderland Crafts", tag: "ALICE'S ARTISAN CORNER", rating: 4.9, specialty: "Colored Stones", sales: 142, joined: "2021", bio: "Specializing in rare colored stones from Southeast Asian mines with full certification." },
  { id: 2, name: "Silent Film Memorabilia", tag: "THE REEL VINTAGE", rating: 4.7, specialty: "Antique Jewels", sales: 89, joined: "2022", bio: "Curators of antique and estate jewelry featuring gemstones with storied provenance." },
  { id: 3, name: "Apex Minerals", tag: "APEX GEM ATELIER", rating: 5.0, specialty: "Investment Stones", sales: 217, joined: "2020", bio: "Premier investment-grade gemstone dealers with a focus on unheated natural gems." },
  { id: 4, name: "Blue Nile Heritage", tag: "NILE ATELIER", rating: 4.8, specialty: "Sapphires", sales: 165, joined: "2021", bio: "Kashmir, Ceylon, and Burma sapphires sourced directly from licensed mines." },
  { id: 5, name: "Crimson Earth", tag: "CRIMSON GEMS", rating: 4.6, specialty: "Rubies", sales: 103, joined: "2022", bio: "Burmese and Mozambican rubies with GRS and GIA certification." },
  { id: 6, name: "Verde Luxe", tag: "VERDE ATELIER", rating: 4.9, specialty: "Emeralds", sales: 78, joined: "2023", bio: "Colombian and Zambian emeralds with SSEF certification and low oil treatment." },
];

export default function Sellers() {
  const [authOpen, setAuthOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Head><title>Certified Ateliers — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => setAuthOpen(true)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <div className="pt-28 pb-12 bg-luxury-dark border-b border-luxury-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">The Network</span>
          <h1 className="font-serif text-5xl text-luxury-cream mt-2 mb-4">Certified Ateliers</h1>
          <p className="text-luxury-cream/50 max-w-xl">
            Each atelier has been rigorously vetted and approved to present their inventory to our global collector network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {SELLERS.map((seller) => (
            <div
              key={seller.id}
              onClick={() => setSelected(seller)}
              className="luxury-card rounded-xl p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex-shrink-0 flex items-center justify-center text-luxury-black font-bold text-2xl font-serif">
                  {seller.name[0]}
                </div>
                <div>
                  <p className="text-luxury-cream/40 text-xs tracking-widest uppercase">{seller.tag}</p>
                  <h3 className="font-serif text-xl text-luxury-cream mt-0.5">{seller.name}</h3>
                  <p className="text-luxury-gold/70 text-xs mt-0.5">{seller.specialty}</p>
                </div>
              </div>
              <p className="text-luxury-cream/50 text-sm leading-relaxed mb-4">{seller.bio}</p>
              <div className="gold-divider mb-4"></div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-luxury-gold">
                  <span>★</span>
                  <span className="font-semibold">{seller.rating}</span>
                  <span className="text-luxury-cream/30 text-xs ml-1">Rating</span>
                </div>
                <div className="text-luxury-cream/40 text-xs">
                  <span className="text-luxury-cream/70">{seller.sales}</span> lots sold
                </div>
                <div className="text-luxury-cream/40 text-xs">
                  Since <span className="text-luxury-cream/70">{seller.joined}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Seller CTA */}
        <div className="luxury-card rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a84c, transparent 70%)' }} />
          <div className="relative z-10">
            <span className="text-luxury-gold/60 text-xs uppercase tracking-[0.4em]">Join Our Network</span>
            <h2 className="font-serif text-4xl text-luxury-cream mt-3 mb-4">Apply as an Atelier</h2>
            <p className="text-luxury-cream/50 max-w-xl mx-auto mb-8">
              Present your certified gemstone inventory to a global audience of serious collectors.
              Our application process ensures only the finest dealers are accepted.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="btn-gold px-10 py-4 rounded text-sm"
            >
              APPLY NOW →
            </button>
          </div>
        </div>
      </div>

      {/* Seller Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center auth-overlay" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-lg mx-4 luxury-card rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-luxury-cream/50 hover:text-luxury-gold text-xl">✕</button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-3xl font-serif">
                {selected.name[0]}
              </div>
              <div>
                <p className="text-luxury-cream/40 text-xs tracking-widest uppercase">{selected.tag}</p>
                <h2 className="font-serif text-2xl text-luxury-cream">{selected.name}</h2>
                <div className="flex items-center gap-1 text-luxury-gold mt-1">
                  <span>★</span><span>{selected.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-luxury-cream/60 leading-relaxed mb-6">{selected.bio}</p>
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-luxury-gold font-serif text-xl">{selected.sales}</p>
                <p className="text-luxury-cream/40 text-xs">Lots Sold</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-luxury-gold font-serif text-xl">{selected.rating}</p>
                <p className="text-luxury-cream/40 text-xs">Rating</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-luxury-gold font-serif text-xl">{selected.joined}</p>
                <p className="text-luxury-cream/40 text-xs">Member Since</p>
              </div>
            </div>
            <button className="btn-gold w-full py-3 rounded text-sm">VIEW ACTIVE LOTS →</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
