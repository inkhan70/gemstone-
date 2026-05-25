import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="text-luxury-gold font-serif text-xl animate-pulse">Loading...</div>
    </div>;
  }

  if (!session) return null;

  return (
    <>
      <Head><title>Dashboard — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      <div className="pt-28 pb-16 min-h-screen bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome */}
          <div className="flex items-center gap-5 mb-10">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-16 h-16 rounded-full border-2 border-luxury-gold" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-2xl font-serif">
                {session.user?.name?.[0]}
              </div>
            )}
            <div>
              <p className="text-luxury-cream/50 text-xs uppercase tracking-widest">Welcome back</p>
              <h1 className="font-serif text-3xl text-luxury-cream">{session.user?.name}</h1>
              <p className="text-luxury-cream/40 text-sm">{session.user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Active Bids', value: '0', icon: '⚡' },
              { label: 'Watchlist', value: '0', icon: '👁' },
              { label: 'Won Auctions', value: '0', icon: '🏆' },
              { label: 'Total Spent', value: '$0', icon: '💰' },
            ].map((s) => (
              <div key={s.label} className="luxury-card rounded-xl p-5 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="font-serif text-2xl text-luxury-gold">{s.value}</p>
                <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="luxury-card rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">💎</div>
            <h2 className="font-serif text-2xl text-luxury-cream mb-2">No Activity Yet</h2>
            <p className="text-luxury-cream/50 mb-6">Start bidding on gemstones to see your activity here.</p>
            <button onClick={() => router.push('/marketplace')} className="btn-gold px-8 py-3 rounded text-sm">
              BROWSE AUCTIONS →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
