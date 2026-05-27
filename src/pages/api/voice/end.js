import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../lib/mongodb';
import { VoiceCall, User } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: 'Unauthorized' });

  await connectDB();
  const collector = await User.findOne({ email: session.user.email }).lean();
  const { sellerId, durationSeconds } = req.body;

  const costUSD = (durationSeconds / 60) * 0.004; // $0.004 per minute

  await VoiceCall.findOneAndUpdate(
    { seller: sellerId, collector: collector._id, status: 'active' },
    { status: 'ended', endedAt: new Date(), durationSeconds, costUSD },
    { sort: { startedAt: -1 } }
  );

  return res.status(200).json({ message: 'Call logged', durationSeconds, costUSD });
}
