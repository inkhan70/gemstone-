import connectDB from '../../lib/mongodb';
import { Seller } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  await connectDB();
  const vendors = await Seller.find({}).sort({ rating: -1 }).limit(50).lean();
  return res.status(200).json({ vendors });
}
