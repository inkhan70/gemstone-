import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { Gemstone, User } from '../../../lib/models';
import { canCreateListing, canCreateAuction, enforceImageLimit } from '../../../lib/subscriptionLimits';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user || user.role !== 'seller') return res.status(403).json({ message: 'Seller access required' });

  const tier = user.subscriptionTier || 'free';

  if (req.method === 'GET') {
    const listings = await Gemstone.find({ seller: user._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ listings });
  }

  if (req.method === 'POST') {
    const currentCount = await Gemstone.countDocuments({ seller: user._id });
    const listingCheck = canCreateListing(tier, currentCount);
    if (!listingCheck.allowed) return res.status(403).json({ message: listingCheck.reason });

    const { isAuctionItem, images = [], ...rest } = req.body;

    // If auction, check concurrent live limit
    if (isAuctionItem) {
      const liveCount = await Gemstone.countDocuments({ seller: user._id, status: 'live' });
      const auctionCheck = canCreateAuction(tier, liveCount);
      if (!auctionCheck.allowed) return res.status(403).json({ message: auctionCheck.reason });
    }

    const safeImages = enforceImageLimit(tier, images.filter(Boolean));
    const isPaidSellerItem = tier !== 'free';

    const gemstone = await Gemstone.create({
      ...rest,
      seller: user._id,
      images: safeImages,
      isAuctionItem: isAuctionItem || false,
      status: isAuctionItem ? 'upcoming' : 'fixed',
      isPaidSellerItem,
      currentBid: rest.startingBid || rest.price || 0,
    });

    // Mark first product flag
    if (!user.isFirstProductConfigured) {
      await User.findByIdAndUpdate(user._id, { isFirstProductConfigured: true });
    }

    return res.status(201).json({ gemstone });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
