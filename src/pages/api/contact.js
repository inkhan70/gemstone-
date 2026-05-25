import connectDB from '../../lib/mongodb';
import { Inquiry } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Required fields missing' });

  try {
    await connectDB();
    await Inquiry.create({ name, email, subject, message });
    return res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
