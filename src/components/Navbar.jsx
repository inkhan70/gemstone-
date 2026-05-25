import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCartIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar({ onAuthClick }) {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur ${
      scrolled ? 'bg-luxury-black/95 shadow-2xl border-b border-luxury-gold/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-xl font-serif">
              G
            </div>
            <span className="font-serif text-xl text-luxury-cream tracking-wide group-hover:text-luxury-gold transition-colors">
              The Gilded Sanctuary
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Marketplace', 'Sellers', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-luxury-cream/80 hover:text-luxury-gold transition-colors text-sm tracking-widest uppercase font-medium"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-luxury-cream/70 hover:text-luxury-gold transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 text-luxury-cream/70 hover:text-luxury-gold transition-colors"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-luxury-gold/40" />
                  ) : (
                    <UserCircleIcon className="w-7 h-7" />
                  )}
                  <span className="text-sm">{session.user?.name?.split(' ')[0]}</span>
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-12 w-48 luxury-card rounded-lg shadow-2xl py-2">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-luxury-cream/80 hover:text-luxury-gold hover:bg-white/5 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-luxury-cream/80 hover:text-luxury-gold hover:bg-white/5 transition-colors">
                      Profile
                    </Link>
                    <hr className="border-luxury-gold/20 my-1" />
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="btn-gold px-5 py-2 rounded text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-luxury-cream"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-luxury-dark border-t border-luxury-gold/20 px-4 py-6 space-y-4">
          {['Home', 'Marketplace', 'Sellers', 'Contact'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="block text-luxury-cream/80 hover:text-luxury-gold text-sm tracking-widest uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          {!session && (
            <button
              onClick={() => { onAuthClick(); setMenuOpen(false); }}
              className="btn-gold px-5 py-2 rounded text-sm w-full mt-4"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
