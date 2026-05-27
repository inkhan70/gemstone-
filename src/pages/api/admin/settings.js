import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { User } from '../../../lib/models';
import mongoose from 'mongoose';

// Simple key-value settings collection
const SettingsSchema = new mongoose.Schema({
  key:       { type: String, unique: true, required: true },
  value:     { type: mongoose.Schema.Types.Mixed },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

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

  if (req.method === 'GET') {
    const all = await Settings.find({}).lean();
    const map = {};
    all.forEach(s => { map[s.key] = s.value; });
    return res.status(200).json({ settings: map });
  }

  if (req.method === 'POST') {
    const { settings } = req.body; // { key: value, ... }
    const ops = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { value, updatedBy: admin.email, updatedAt: new Date() } },
        upsert: true,
      },
    }));
    await Settings.bulkWrite(ops);
    return res.status(200).json({ message: 'Settings saved' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
