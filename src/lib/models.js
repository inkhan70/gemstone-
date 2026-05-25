import mongoose from 'mongoose';

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // null for OAuth users
  image: { type: String },
  provider: { type: String, default: 'credentials' }, // credentials | google | facebook
  providerId: { type: String },
  role: { type: String, enum: ['collector', 'seller', 'admin'], default: 'collector' },
  isVerified: { type: Boolean, default: false },
  bio: { type: String },
  phone: { type: String },
  address: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Gemstone/Lot Model
const GemstoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  carats: { type: Number, required: true },
  color: { type: String, required: true },
  clarity: { type: String, required: true },
  cut: { type: String },
  origin: { type: String },
  certification: {
    lab: { type: String }, // GIA, AIGS, SSEF
    reportNumber: { type: String },
    grade: { type: String },
  },
  images: [{ type: String }],
  startingBid: { type: Number, required: true },
  currentBid: { type: Number },
  reservePrice: { type: Number },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['ruby', 'sapphire', 'emerald', 'diamond', 'other'], default: 'other' },
  status: { type: String, enum: ['upcoming', 'live', 'ended', 'sold'], default: 'upcoming' },
  auctionStart: { type: Date },
  auctionEnd: { type: Date },
  bids: [{
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    timestamp: { type: Date, default: Date.now },
  }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Seller/Atelier Model
const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  tagline: { type: String },
  description: { type: String },
  logo: { type: String },
  banner: { type: String },
  rating: { type: Number, default: 5.0 },
  totalSales: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  specialties: [{ type: String }],
  socialLinks: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

// Contact/Inquiry Model
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Gemstone = mongoose.models.Gemstone || mongoose.model('Gemstone', GemstoneSchema);
export const Seller = mongoose.models.Seller || mongoose.model('Seller', SellerSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
