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
  const { sellerId } = req.body;

  const channelName = `gs_${sellerId}_${collector._id}_${Date.now()}`;

  // Log the call attempt
  await VoiceCall.create({ seller: sellerId, collector: collector._id, channelName, status: 'active' });

  // When Agora App ID is configured, generate real RTC token here:
  // const { RtcTokenBuilder, RtcRole } = require('agora-token');
  // const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, 0, RtcRole.PUBLISHER, expiry);

  return res.status(200).json({
    token: `mock_rtc_token_${channelName}`,  // Replace with real Agora token
    channelName,
    appId: process.env.AGORA_APP_ID || 'configure_agora_app_id',
  });
}
