import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { User } from '../../../lib/models';

async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return null;
  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return res.status(403).json({ message: 'Admin access required' });

  // GET — list all users with full details
  if (req.method === 'GET') {
    const { search, role, page = 1, limit = 50 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(query),
    ]);
    return res.status(200).json({ users, total });
  }

  // PATCH — update user role / tier / verified status
  if (req.method === 'PATCH') {
    const { userId, role, subscriptionTier, isVerified, isBanned } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ message: 'User not found' });
    // Prevent removing the last admin
    if (target.role === 'admin' && role && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) return res.status(400).json({ message: 'Cannot demote the last admin' });
    }

    const update = {};
    if (role              !== undefined) update.role              = role;
    if (subscriptionTier  !== undefined) update.subscriptionTier  = subscriptionTier;
    if (isVerified        !== undefined) update.isVerified        = isVerified;
    if (isBanned          !== undefined) update.isBanned          = isBanned;

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password').lean();
    return res.status(200).json({ user: updated });
  }

  // DELETE — remove user account
  if (req.method === 'DELETE') {
    const { userId } = req.body;
    const target = await User.findById(userId);
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin accounts' });
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: 'User deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
