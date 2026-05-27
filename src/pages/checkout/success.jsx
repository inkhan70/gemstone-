import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function CheckoutSuccess() {
  return (
    <>
      <Head><title>Order Confirmed — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => {}} />
      <div className="min-h-screen bg-luxury-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">💎</div>
          <h1 className="font-serif text-4xl text-luxury-cream mb-4">Order Confirmed</h1>
          <p className="text-luxury-cream/50 mb-8">Your gemstone acquisition is confirmed. You will receive a confirmation email shortly with tracking and provenance documentation.</p>
          <Link href="/dashboard" className="btn-gold px-8 py-3 rounded text-sm inline-block">VIEW YOUR ORDERS →</Link>
        </div>
      </div>
    </>
  );
}
