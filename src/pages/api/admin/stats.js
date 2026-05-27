import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { User, Gemstone, Order, VoiceCall } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });
  await connectDB();
  const admin = await User.findOne({ email: session.user.email }).lean();
  if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const [
    totalUsers, sellers, collectors, admins,
    totalListings, liveAuctions, soldItems,
    totalOrders, pendingOrders,
    totalCalls,
    tierBreakdown,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'collector' }),
    User.countDocuments({ role: 'admin' }),
    Gemstone.countDocuments({}),
    Gemstone.countDocuments({ status: 'live' }),
    Gemstone.countDocuments({ status: 'sold' }),
    Order.countDocuments({}),
    Order.countDocuments({ status: 'pending' }),
    VoiceCall.countDocuments({}),
    User.aggregate([{ $group: { _id: '$subscriptionTier', count: { $sum: 1 } } }]),
  ]);

  const revenue = await Order.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return res.status(200).json({
    users:    { total: totalUsers, sellers, collectors, admins },
    listings: { total: totalListings, live: liveAuctions, sold: soldItems },
    orders:   { total: totalOrders, pending: pendingOrders, revenue: revenue[0]?.total || 0 },
    calls:    { total: totalCalls },
    tiers:    tierBreakdown,
  });
}
