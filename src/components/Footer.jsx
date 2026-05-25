import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-luxury-black border-t border-luxury-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-xl font-serif">G</div>
              <span className="font-serif text-lg text-luxury-cream">The Gilded Sanctuary</span>
            </div>
            <p className="text-luxury-cream/50 text-sm leading-relaxed">
              The world's premier marketplace for rare and certified gemstones. Connecting collectors and dealers globally.
            </p>
            <div className="flex gap-3 mt-4">
              {['twitter', 'instagram', 'linkedin'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 border border-luxury-gold/30 rounded flex items-center justify-center text-luxury-cream/50 hover:text-luxury-gold hover:border-luxury-gold transition-colors">
                  <span className="sr-only">{s}</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={s === 'twitter' ? "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" : s === 'instagram' ? "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" : "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-luxury-gold text-sm uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Browse Gemstones', 'Live Auctions', 'Seller Directory', 'My Account', 'Watchlist'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-luxury-cream/50 text-sm hover:text-luxury-gold transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-serif text-luxury-gold text-sm uppercase tracking-widest mb-4">Information</h4>
            <ul className="space-y-2">
              {['About Us', 'Certification Process', 'How Auctions Work', 'Shipping & Returns', 'Privacy Policy', 'Terms of Service'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-luxury-cream/50 text-sm hover:text-luxury-gold transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-luxury-gold text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3 text-luxury-cream/50 text-sm">
              <li>✉ info@gildedsanctuary.com</li>
              <li>☎ +1 (234) 567-890</li>
              <li>📍 International Gemstone District</li>
            </ul>
            <div className="mt-6">
              <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mb-2">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="luxury-input flex-1 px-3 py-2 rounded-l text-xs"
                />
                <button className="btn-gold px-3 py-2 rounded-r text-xs">→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="gold-divider mb-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-luxury-cream/30 text-xs">
          <p>© 2026 The Gilded Sanctuary. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-luxury-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-luxury-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxury-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
