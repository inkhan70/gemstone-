import mongoose from 'mongoose';

// ── User ──────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  image:    { type: String },
  provider: { type: String, default: 'credentials' },
  providerId: { type: String },
  role:     { type: String, enum: ['collector','seller','admin'], default: 'collector' },
  isVerified: { type: Boolean, default: false },
  bio:      { type: String },
  phone:    { type: String },
  address: {
    street:  { type: String },
    city:    { type: String },
    country: { type: String },
  },
  subscriptionTier: { type: String, enum: ['free','starter','medium','ultimate'], default: 'free' },
  subscriptionExpiresAt: { type: Date },
  isFirstProductConfigured: { type: Boolean, default: false },
  voiceCallToken: { type: String },
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
});

// ── Gemstone / Product ────────────────────────────────────────────────────────
const GemstoneSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  carats:      { type: Number, required: true },
  color:       { type: String, required: true },
  clarity:     { type: String, required: true },
  cut:         { type: String },
  origin:      { type: String },
  certification: {
    lab:          { type: String },
    reportNumber: { type: String },
    grade:        { type: String },
  },
  gemstoneDetails: {
    type:          { type: String, enum: ['raw_pyrite','quartz','mica','ruby','sapphire','emerald','diamond','other'], default: 'other' },
    weightCarats:  { type: Number },
    description:   { type: String },
  },
  images:       [{ type: String }],
  price:        { type: Number },
  startingBid:  { type: Number },
  currentBid:   { type: Number },
  reservePrice: { type: Number },
  seller:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category:     { type: String, enum: ['ruby','sapphire','emerald','diamond','other'], default: 'other' },
  isAuctionItem: { type: Boolean, default: true },
  status:       { type: String, enum: ['upcoming','live','ended','sold','fixed'], default: 'upcoming' },
  auctionStart: { type: Date },
  auctionEnd:   { type: Date },
  bids: [{
    bidder:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount:    { type: Number },
    timestamp: { type: Date, default: Date.now },
  }],
  winner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views:        { type: Number, default: 0 },
  relevanceScore: { type: Number, default: 0 },
  isPaidSellerItem: { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

// ── Seller Atelier ────────────────────────────────────────────────────────────
const SellerSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName:    { type: String, required: true },
  tagline:     { type: String },
  description: { type: String },
  logo:        { type: String },
  banner:      { type: String },
  rating:      { type: Number, default: 5.0 },
  totalSales:  { type: Number, default: 0 },
  isVerified:  { type: Boolean, default: false },
  specialties: [{ type: String }],
  socialLinks: { type: Object },
  geolocation: {
    lat:     { type: Number },
    lng:     { type: Number },
    city:    { type: String },
    country: { type: String },
  },
  createdAt:   { type: Date, default: Date.now },
});

// ── Contact / Inquiry ─────────────────────────────────────────────────────────
const InquirySchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status:  { type: String, enum: ['new','read','replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

// ── Bid ───────────────────────────────────────────────────────────────────────
const BidSchema = new mongoose.Schema({
  gemstone:  { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone', required: true },
  bidder:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:    { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// ── Order / Checkout ──────────────────────────────────────────────────────────
const OrderSchema = new mongoose.Schema({
  gemstone:       { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone', required: true },
  buyer:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerEmail:     { type: String },
  amount:         { type: Number, required: true },
  currency:       { type: String, default: 'usd' },
  stripeSessionId: { type: String },
  stripePaymentIntent: { type: String },
  status:         { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  deliveryAddress: {
    name:    { type: String },
    street:  { type: String },
    city:    { type: String },
    state:   { type: String },
    zip:     { type: String },
    country: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

// ── Voice Call Log ────────────────────────────────────────────────────────────
const VoiceCallSchema = new mongoose.Schema({
  seller:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collector:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channelName:  { type: String, required: true },
  startedAt:    { type: Date, default: Date.now },
  endedAt:      { type: Date },
  durationSeconds: { type: Number, default: 0 },
  costUSD:      { type: Number, default: 0 },
  status:       { type: String, enum: ['active','ended','missed'], default: 'active' },
});

// ── Subscription ──────────────────────────────────────────────────────────────
const SubscriptionSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier:            { type: String, enum: ['free','starter','medium','ultimate'], required: true },
  stripeCustomerId: { type: String },
  stripeSubId:     { type: String },
  status:          { type: String, enum: ['active','cancelled','past_due'], default: 'active' },
  startDate:       { type: Date, default: Date.now },
  endDate:         { type: Date },
  createdAt:       { type: Date, default: Date.now },
});

export const User         = mongoose.models.User         || mongoose.model('User', UserSchema);
export const Gemstone     = mongoose.models.Gemstone     || mongoose.model('Gemstone', GemstoneSchema);
export const Seller       = mongoose.models.Seller       || mongoose.model('Seller', SellerSchema);
export const Inquiry      = mongoose.models.Inquiry      || mongoose.model('Inquiry', InquirySchema);
export const Bid          = mongoose.models.Bid          || mongoose.model('Bid', BidSchema);
export const Order        = mongoose.models.Order        || mongoose.model('Order', OrderSchema);
export const VoiceCall    = mongoose.models.VoiceCall    || mongoose.model('VoiceCall', VoiceCallSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
