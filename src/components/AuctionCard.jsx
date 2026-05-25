import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = endTime ? new Date(endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const tick = () => {
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}

export default function AuctionCard({ gem, onAuthRequired }) {
  const { data: session } = useSession();
  const timeLeft = useCountdown(gem.auctionEnd);
  const [bidding, setBidding] = useState(false);
  const [showBidInput, setShowBidInput] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(gem.currentBid || gem.startingBid);

  const pad = (n) => String(n).padStart(2, '0');

  const handleBid = async () => {
    if (!session) {
      onAuthRequired();
      return;
    }
    if (!bidAmount || parseFloat(bidAmount) <= currentBid) {
      alert(`Bid must be higher than $${currentBid.toLocaleString()}`);
      return;
    }
    setBidding(true);
    // Simulate bid placement
    await new Promise(r => setTimeout(r, 800));
    setCurrentBid(parseFloat(bidAmount));
    setShowBidInput(false);
    setBidAmount('');
    setBidding(false);
  };

  const categoryColors = {
    ruby: 'text-red-400',
    sapphire: 'text-blue-400',
    emerald: 'text-green-400',
    diamond: 'text-white',
    other: 'text-luxury-gold',
  };

  return (
    <div className="luxury-card rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-luxury-charcoal to-luxury-dark overflow-hidden">
        {gem.images?.[0] ? (
          <img src={gem.images[0]} alt={gem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-30">💎</div>
          </div>
        )}
        
        {/* Live badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-luxury-black/80 px-2 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 bid-live block"></span>
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>

        {/* Countdown */}
        <div className="absolute top-3 right-3 bg-luxury-black/90 px-3 py-1.5 rounded-lg border border-luxury-gold/30">
          <span className="text-luxury-gold font-mono text-sm font-bold">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs uppercase tracking-wider font-bold ${categoryColors[gem.category] || 'text-luxury-gold'}`}>
            {gem.category || 'Gemstone'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-lg text-luxury-cream mb-1">{gem.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-luxury-cream/50 bg-white/5 px-2 py-0.5 rounded">{gem.carats} CT</span>
          <span className="text-xs text-luxury-cream/50 bg-white/5 px-2 py-0.5 rounded">{gem.color}</span>
          <span className="text-xs text-luxury-cream/50 bg-white/5 px-2 py-0.5 rounded">{gem.clarity}</span>
          {gem.certification?.lab && (
            <span className="text-xs text-luxury-gold bg-luxury-gold/10 px-2 py-0.5 rounded">{gem.certification.lab}</span>
          )}
        </div>

        <div className="gold-divider mb-4"></div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-luxury-cream/40 uppercase tracking-wider mb-1">Current Bid</p>
            <p className="text-xl font-serif text-luxury-gold">${currentBid.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-luxury-cream/40 mb-0.5">Starting</p>
            <p className="text-sm text-luxury-cream/60">${(gem.startingBid || currentBid).toLocaleString()}</p>
          </div>
        </div>

        {showBidInput ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min $${(currentBid + 100).toLocaleString()}`}
              className="luxury-input flex-1 px-3 py-2 rounded text-sm"
            />
            <button
              onClick={handleBid}
              disabled={bidding}
              className="btn-gold px-4 py-2 rounded text-xs disabled:opacity-70"
            >
              {bidding ? '...' : 'BID'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowBidInput(true)}
              className="btn-gold py-2.5 rounded text-xs"
            >
              PLACE BID
            </button>
            <button className="btn-gold-outline py-2.5 rounded text-xs">
              VIEW DETAILS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
