import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Navbar({ onAuthClick }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin  = session?.user?.role === 'admin';
  const isSeller = session?.user?.role === 'seller';

  const dashboardLink = isAdmin ? '/admin' : isSeller ? '/seller-studio' : '/dashboard';
  const dashboardLabel = isAdmin ? 'Admin' : isSeller ? 'Studio' : 'Dashboard';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-luxury-black/80 backdrop-blur-md border-b border-luxury-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-luxury-black text-xs font-bold">GS</span>
            </div>
            <span className="font-serif text-luxury-gold text-sm tracking-widest uppercase hidden sm:block">The Gilded Sanctuary</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/marketplace" active={router.pathname === '/marketplace'}>Auctions</NavLink>
            <NavLink href="/sellers"     active={router.pathname === '/sellers'}>Ateliers</NavLink>
            <NavLink href="/contact"     active={router.pathname === '/contact'}>Contact</NavLink>
            {isAdmin  && <NavLink href="/admin"          active={router.pathname === '/admin'}          special>⚙ Admin</NavLink>}
            {isSeller && <NavLink href="/seller-studio"  active={router.pathname === '/seller-studio'}>Studio</NavLink>}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href={dashboardLink}
                  className={`text-xs uppercase tracking-widest transition-colors hidden sm:block ${isAdmin ? 'text-red-400 hover:text-red-300' : 'text-luxury-cream/70 hover:text-luxury-cream'}`}>
                  {dashboardLabel}
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-luxury-cream/40 hover:text-luxury-cream/70 text-xs uppercase tracking-widest transition-colors">
                  Sign Out
                </button>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${isAdmin ? 'bg-red-500 text-white' : 'bg-gold-gradient text-luxury-black'}`}>
                  {session.user?.name?.[0]}
                </div>
              </div>
            ) : (
              <button onClick={onAuthClick} className="btn-gold px-5 py-2 rounded text-xs">SIGN IN</button>
            )}
            <button className="md:hidden text-luxury-cream/60 ml-2" onClick={() => setMenuOpen(m => !m)}>☰</button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-luxury-black border-t border-luxury-gold/10 px-4 py-4 space-y-3">
          {[
            { href: '/marketplace',   label: 'Auctions' },
            { href: '/sellers',       label: 'Ateliers' },
            { href: '/contact',       label: 'Contact' },
            ...(isAdmin  ? [{ href: '/admin',         label: '⚙ Admin Panel' }] : []),
            ...(isSeller ? [{ href: '/seller-studio', label: 'My Studio' }] : []),
            ...(session  ? [{ href: dashboardLink,    label: dashboardLabel }] : []),
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block text-luxury-cream/60 hover:text-luxury-cream text-sm py-1">{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children, active, special }) {
  return (
    <Link href={href} className={`text-xs uppercase tracking-widest transition-colors ${
      special ? 'text-red-400 hover:text-red-300' :
      active  ? 'text-luxury-gold' :
                'text-luxury-cream/60 hover:text-luxury-cream'
    }`}>
      {children}
    </Link>
  );
}
