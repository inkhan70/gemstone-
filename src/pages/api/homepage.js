import connectDB from '../../lib/mongodb';
import { Gemstone, User } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  await connectDB();

  const { section } = req.query;

  try {
    // ── SECTION 1: Live auctions from paid sellers (isPaidSellerItem = true), max 15
    if (section === 'live') {
      const items = await Gemstone.find({ status: 'live', isPaidSellerItem: true })
        .sort({ auctionEnd: 1 })   // soonest ending first = urgency
        .limit(15)
        .lean();
      // fallback: also include any live items if paid seller pool < 15
      if (items.length < 15) {
        const extra = await Gemstone.find({ status: 'live', _id: { $nin: items.map(i => i._id) } })
          .sort({ auctionEnd: 1 })
          .limit(15 - items.length)
          .lean();
        items.push(...extra);
      }
      return res.status(200).json({ items });
    }

    // ── SECTION 2: Fresh members — newest seller's FIRST product only, max 12
    // Logic: find sellers ordered by registration date DESC, get their first-ever upload
    if (section === 'fresh') {
      const sellers = await User.find({ role: 'seller', isFirstProductConfigured: true })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean();

      const items = [];
      for (const seller of sellers) {
        const firstProduct = await Gemstone.findOne({ seller: seller._id })
          .sort({ createdAt: 1 })   // oldest listing = first upload
          .lean();
        if (firstProduct) items.push({ ...firstProduct, sellerName: seller.name });
      }
      return res.status(200).json({ items: items.slice(0, 12) });
    }

    // ── SECTION 3: Standard fixed-price grid sorted by upload time then relevance
    if (section === 'standard') {
      const items = await Gemstone.find({ isAuctionItem: false, status: { $in: ['fixed', 'upcoming'] } })
        .sort({ relevanceScore: -1, createdAt: -1 })
        .limit(24)
        .lean();
      return res.status(200).json({ items });
    }

    return res.status(400).json({ message: 'Invalid section' });
  } catch (error) {
    console.error('Homepage API error:', error);
    return res.status(500).json({ message: error.message });
  }
}
