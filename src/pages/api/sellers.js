import connectDB from '../../lib/mongodb';
import { Seller } from '../../lib/models';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const sellers = await Seller.find({ isVerified: true })
        .populate('user', 'name email image')
        .sort({ rating: -1 })
        .lean();
      return res.status(200).json({ sellers });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
