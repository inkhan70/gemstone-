import connectDB from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { Gemstone, User } from '../../lib/models';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { status, category, limit = 10, page = 1 } = req.query;
      const query = {};
      if (status) query.status = status;
      if (category) query.category = category;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const gemstones = await Gemstone.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Gemstone.countDocuments(query);

      return res.status(200).json({ gemstones, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !['seller', 'admin'].includes(session.user?.role)) {
      return res.status(403).json({ message: 'Seller or admin access required' });
    }
    try {
      const user = await User.findById(session.user.id).lean();
      const allowedFields = ['title', 'description', 'carats', 'color', 'clarity', 'cut', 'origin', 'certification', 'gemstoneDetails', 'images', 'price', 'startingBid', 'currentBid', 'reservePrice', 'category', 'isAuctionItem', 'status', 'auctionStart', 'auctionEnd'];
      const data = Object.fromEntries(allowedFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
      const gemstone = await Gemstone.create({ ...data, seller: user?._id });
      return res.status(201).json(gemstone);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid gemstone payload' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
