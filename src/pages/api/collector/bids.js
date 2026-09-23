import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { Bid, Gemstone, User } from '../../../lib/models';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });
  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (req.method === 'GET') {
    const bids = await Bid.find({ bidder: user._id }).sort({ timestamp: -1 }).lean();
    const enriched = await Promise.all(bids.map(async (b) => {
      const gem = await Gemstone.findById(b.gemstone).lean();
      return { ...b, gemstoneTitle: gem?.title, isWinning: gem?.currentBid === b.amount && gem?.status === 'live' };
    }));
    return res.status(200).json({ bids: enriched });
  }

  if (req.method === 'POST') {
    const { gemstoneId, amount } = req.body;
    const bidAmount = Number(amount);
    if (!gemstoneId || !Number.isFinite(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'A valid gemstone and positive bid amount are required' });
    }

    const gem = await Gemstone.findOneAndUpdate(
      { _id: gemstoneId, status: 'live', currentBid: { $lt: bidAmount } },
      { $set: { currentBid: bidAmount }, $push: { bids: { bidder: user._id, amount: bidAmount } } },
      { new: true }
    );
    if (!gem) return res.status(400).json({ message: 'Auction is inactive or bid is not high enough' });

    await Bid.create({ gemstone: gemstoneId, bidder: user._id, amount: bidAmount });
    return res.status(201).json({ message: 'Bid placed', currentBid: bidAmount });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
