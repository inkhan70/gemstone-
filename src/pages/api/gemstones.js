import connectDB from '../../lib/mongodb';
import { Gemstone } from '../../lib/models';

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
    try {
      const gemstone = await Gemstone.create(req.body);
      return res.status(201).json(gemstone);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
