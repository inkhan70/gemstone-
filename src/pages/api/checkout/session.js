import connectDB from '../../../lib/mongodb';
import { Gemstone, Order, User } from '../../../lib/models';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// Subscription plan price IDs — set these in Stripe dashboard + env vars
const PLAN_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  medium:  process.env.STRIPE_PRICE_MEDIUM  || 'price_medium',
  ultimate:process.env.STRIPE_PRICE_ULTIMATE|| 'price_ultimate',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { gemstoneId, planTier, address, amount } = req.body;
  const session = await getServerSession(req, res, authOptions);

  await connectDB();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ message: 'Stripe not configured. Add STRIPE_SECRET_KEY to environment.' });

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeKey);

  const baseUrl = process.env.NEXTAUTH_URL || 'https://gilded-sanctuary.vercel.app';

  try {
    // ── Subscription plan purchase ──
    if (planTier) {
      const priceId = PLAN_PRICES[planTier];
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/dashboard?tab=overview&upgraded=true`,
        cancel_url:  `${baseUrl}/dashboard?tab=upgrade`,
        customer_email: session?.user?.email,
        metadata: { planTier, userId: session?.user?.id || '' },
      });
      return res.status(200).json({ url: checkoutSession.url });
    }

    // ── One-time gemstone purchase ──
    if (gemstoneId) {
      const gem = await Gemstone.findById(gemstoneId).lean();
      if (!gem) return res.status(404).json({ message: 'Gemstone not found' });

      const totalAmount = Math.round((gem.price || amount || 0) * 1.05 * 100); // +5% platform fee in cents

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: gem.title, images: gem.images?.slice(0,1) || [] },
            unit_amount: totalAmount,
          },
          quantity: 1,
        }],
        shipping_address_collection: { allowed_countries: ['US','GB','AE','PK','IN','AU','CA','DE','FR','SG'] },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${baseUrl}/marketplace`,
        customer_email: session?.user?.email || req.body.address?.email,
        metadata: { gemstoneId: gemstoneId.toString(), buyerEmail: address?.email || '' },
      });

      // Pre-create pending order
      await Order.create({
        gemstone: gemstoneId,
        buyer: session?.user?.id || undefined,
        buyerEmail: address?.email,
        amount: gem.price,
        stripeSessionId: checkoutSession.id,
        status: 'pending',
        deliveryAddress: address,
      });

      return res.status(200).json({ url: checkoutSession.url });
    }

    return res.status(400).json({ message: 'gemstoneId or planTier required' });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ message: err.message });
  }
}
