import mongoose from 'mongoose';

const user = 'agentAdmin';
const pass = encodeURIComponent('GildedPass2026');
const MONGODB_URI = `mongodb+srv://${user}:${pass}@cluster0.7zyrhjt.mongodb.net/gilded-sanctuary?retryWrites=true&w=majority&appName=gemsdb`;

// ── Schemas ──────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true, lowercase: true },
  password: String, image: String, provider: { type: String, default: 'credentials' },
  role: { type: String, default: 'collector' }, isVerified: { type: Boolean, default: false },
  bio: String, createdAt: { type: Date, default: Date.now },
});
const GemstoneSchema = new mongoose.Schema({
  title: String, description: String, carats: Number, color: String,
  clarity: String, cut: String, origin: String,
  certification: { lab: String, reportNumber: String, grade: String },
  images: [String], startingBid: Number, currentBid: Number, reservePrice: Number,
  seller: mongoose.Schema.Types.ObjectId,
  category: { type: String, enum: ['ruby','sapphire','emerald','diamond','other'], default: 'other' },
  status: { type: String, enum: ['upcoming','live','ended','sold'], default: 'upcoming' },
  auctionStart: Date, auctionEnd: Date,
  bids: [{ bidder: mongoose.Schema.Types.ObjectId, amount: Number, timestamp: { type: Date, default: Date.now } }],
  views: { type: Number, default: 0 }, createdAt: { type: Date, default: Date.now },
});
const SellerSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId, shopName: String, tagline: String,
  description: String, logo: String, banner: String,
  rating: { type: Number, default: 5.0 }, totalSales: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  specialties: [String], socialLinks: Object, createdAt: { type: Date, default: Date.now },
});
const InquirySchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  status: { type: String, default: 'new' }, createdAt: { type: Date, default: Date.now },
});

const User     = mongoose.models.User     || mongoose.model('User', UserSchema);
const Gemstone = mongoose.models.Gemstone || mongoose.model('Gemstone', GemstoneSchema);
const Seller   = mongoose.models.Seller   || mongoose.model('Seller', SellerSchema);
const Inquiry  = mongoose.models.Inquiry  || mongoose.model('Inquiry', InquirySchema);

await mongoose.connect(MONGODB_URI);
console.log('✅ Connected to MongoDB');

await Promise.all([User.deleteMany({}), Gemstone.deleteMany({}), Seller.deleteMany({}), Inquiry.deleteMany({})]);
console.log('🧹 Cleared old data');

const now = new Date();
const users = await User.insertMany([
  { name: 'Amir Rashid',    email: 'amir@example.com',   provider: 'credentials', role: 'seller',    isVerified: true,  bio: 'Third-generation gem dealer from Peshawar, specialising in Himalayan rubies and sapphires.' },
  { name: 'Sofia Laurent',  email: 'sofia@example.com',  provider: 'google',      role: 'seller',    isVerified: true,  bio: 'Parisian gemologist with 20 years sourcing Colombian emeralds and African diamonds.' },
  { name: 'Tariq Hussain',  email: 'tariq@example.com',  provider: 'credentials', role: 'seller',    isVerified: true,  bio: 'Certified GIA gemologist and auction specialist based in Lahore.' },
  { name: 'Mei Lin Chen',   email: 'mei@example.com',    provider: 'google',      role: 'collector', isVerified: true,  bio: 'Private collector with a passion for rare padparadscha sapphires.' },
  { name: 'James Whitmore', email: 'james@example.com',  provider: 'credentials', role: 'collector', isVerified: false, bio: 'Enthusiast collector focusing on estate jewellery and certified diamonds.' },
]);
console.log(`👤 Seeded ${users.length} users`);

const sellers = await Seller.insertMany([
  {
    user: users[0]._id, shopName: 'Himalayan Gem House', isVerified: true,
    tagline: 'Rare stones from the roof of the world',
    description: 'Three generations of sourcing the finest rubies, sapphires, and spinels directly from Himalayan mines. Every stone comes with full provenance documentation.',
    logo:   'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=400&fit=crop',
    rating: 4.9, totalSales: 142, specialties: ['Ruby','Sapphire','Spinel'],
    socialLinks: { instagram: 'himalayan_gems', website: 'himalayangemhouse.com' },
  },
  {
    user: users[1]._id, shopName: 'Maison Laurent Gemmes', isVerified: true,
    tagline: "L'art des pierres précieuses",
    description: 'Curated selection of investment-grade emeralds and diamonds sourced directly from Colombia, Zambia, and Botswana. GIA-certified every piece.',
    logo:   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    rating: 4.8, totalSales: 89, specialties: ['Emerald','Diamond','Alexandrite'],
    socialLinks: { instagram: 'maison_laurent', website: 'maisonlaurent.fr' },
  },
  {
    user: users[2]._id, shopName: "Tariq's Gem Atelier", isVerified: true,
    tagline: 'GIA-certified excellence from Lahore',
    description: 'Premium auction-grade gemstones with complete GIA certification. Specialising in rare colour-change stones and collector-grade spinels.',
    logo:   'https://images.unsplash.com/photo-1573408301185-9519f94cca51?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=400&fit=crop',
    rating: 4.7, totalSales: 67, specialties: ['Spinel','Colour-change Garnet','Tanzanite'],
    socialLinks: { instagram: 'tariq_gems' },
  },
]);
console.log(`🏪 Seeded ${sellers.length} sellers`);

const inTwoHours  = new Date(now.getTime() + 2  * 3600000);
const inSixHours  = new Date(now.getTime() + 6  * 3600000);
const inTwoDays   = new Date(now.getTime() + 2  * 86400000);
const inFiveDays  = new Date(now.getTime() + 5  * 86400000);
const inSevenDays = new Date(now.getTime() + 7  * 86400000);
const oneDayAgo   = new Date(now.getTime() - 1  * 86400000);

const gemstones = await Gemstone.insertMany([
  {
    title: 'Burmese Pigeon Blood Ruby — 4.32 ct',
    description: "An exceptional unheated Burmese ruby of the coveted 'pigeon blood' colour, displaying intense red with a slight blue fluorescence. Direct mine provenance from Mogok Valley, Myanmar. GIA certified — no heat treatment.",
    carats: 4.32, color: 'Vivid Red (Pigeon Blood)', clarity: 'Eye Clean', cut: 'Oval Brilliant',
    origin: 'Mogok Valley, Myanmar',
    certification: { lab: 'GIA', reportNumber: 'GIA-2186754321', grade: 'Unheated' },
    images: ['https://images.unsplash.com/photo-1583842761844-e96eb5e1bfa3?w=800&h=600&fit=crop'],
    startingBid: 18000, currentBid: 27500, reservePrice: 35000,
    seller: users[0]._id, category: 'ruby', status: 'live',
    auctionStart: oneDayAgo, auctionEnd: inTwoHours,
    bids: [
      { bidder: users[3]._id, amount: 20000, timestamp: new Date(now.getTime() - 20*3600000) },
      { bidder: users[4]._id, amount: 24000, timestamp: new Date(now.getTime() - 10*3600000) },
      { bidder: users[3]._id, amount: 27500, timestamp: new Date(now.getTime() - 2*3600000) },
    ],
    views: 834,
  },
  {
    title: 'Kashmir Blue Sapphire — 6.18 ct',
    description: 'A magnificent Kashmir sapphire with the legendary velvety cornflower blue. Exceptional transparency and saturation. SSEF certified with Kashmir origin confirmation.',
    carats: 6.18, color: 'Cornflower Blue (Kashmir)', clarity: 'VVS', cut: 'Cushion Mixed',
    origin: 'Kashmir, India',
    certification: { lab: 'SSEF', reportNumber: 'SSEF-87234109', grade: 'Kashmir Origin Confirmed' },
    images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&h=600&fit=crop'],
    startingBid: 45000, currentBid: 68000, reservePrice: 80000,
    seller: users[0]._id, category: 'sapphire', status: 'live',
    auctionStart: oneDayAgo, auctionEnd: inSixHours,
    bids: [
      { bidder: users[4]._id, amount: 48000, timestamp: new Date(now.getTime() - 18*3600000) },
      { bidder: users[3]._id, amount: 58000, timestamp: new Date(now.getTime() - 8*3600000) },
      { bidder: users[4]._id, amount: 68000, timestamp: new Date(now.getTime() - 1*3600000) },
    ],
    views: 1247,
  },
  {
    title: 'Colombian Muzo Emerald — 5.44 ct',
    description: "Rare Muzo emerald with the deep green and warm glow that defines the world's finest emeralds. Minor oil treatment only. Gübelin certified.",
    carats: 5.44, color: 'Deep Vivid Green', clarity: 'Eye Clean', cut: 'Rectangular Step Cut',
    origin: 'Muzo Mine, Colombia',
    certification: { lab: 'Gübelin', reportNumber: 'GUB-2025-4421', grade: 'Minor Oil Only' },
    images: ['https://images.unsplash.com/photo-1564530537918-57a4c7a5f006?w=800&h=600&fit=crop'],
    startingBid: 22000, currentBid: 31000, reservePrice: 40000,
    seller: users[1]._id, category: 'emerald', status: 'live',
    auctionStart: oneDayAgo, auctionEnd: inSixHours,
    bids: [
      { bidder: users[3]._id, amount: 23000, timestamp: new Date(now.getTime() - 15*3600000) },
      { bidder: users[4]._id, amount: 31000, timestamp: new Date(now.getTime() - 3*3600000) },
    ],
    views: 612,
  },
  {
    title: 'D-Flawless Round Diamond — 3.01 ct',
    description: 'Exceptional investment-grade diamond graded D-Flawless by GIA. Triple Excellent — Cut, Polish, Symmetry. Zero fluorescence.',
    carats: 3.01, color: 'D (Colourless)', clarity: 'Flawless', cut: 'Round Brilliant (Ideal)',
    origin: 'Botswana',
    certification: { lab: 'GIA', reportNumber: 'GIA-6178234560', grade: 'Triple Excellent' },
    images: ['https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=800&h=600&fit=crop'],
    startingBid: 55000, currentBid: 55000, reservePrice: 70000,
    seller: users[1]._id, category: 'diamond', status: 'upcoming',
    auctionStart: inTwoDays, auctionEnd: inFiveDays,
    bids: [], views: 423,
  },
  {
    title: 'Padparadscha Sapphire — 3.87 ct',
    description: 'Extremely rare padparadscha sapphire with the signature pink-orange blend. Sri Lankan origin, AIGS certified — unheated.',
    carats: 3.87, color: 'Padparadscha (Pink-Orange)', clarity: 'Eye Clean', cut: 'Oval Mixed',
    origin: 'Sri Lanka',
    certification: { lab: 'AIGS', reportNumber: 'AIGS-TH-2025-9912', grade: 'Padparadscha — Unheated' },
    images: ['https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=600&fit=crop'],
    startingBid: 28000, currentBid: 28000, reservePrice: 38000,
    seller: users[2]._id, category: 'sapphire', status: 'upcoming',
    auctionStart: inFiveDays, auctionEnd: inSevenDays,
    bids: [], views: 389,
  },
  {
    title: 'Mahenge Spinel — 4.55 ct',
    description: 'Vibrant neon-red spinel from the legendary Mahenge deposit in Tanzania. Electric fluorescence under UV. One of the finest examples of this increasingly rare variety.',
    carats: 4.55, color: 'Neon Red-Pink', clarity: 'Eye Clean', cut: 'Cushion Brilliant',
    origin: 'Mahenge, Tanzania',
    certification: { lab: 'GIA', reportNumber: 'GIA-5492817643', grade: 'Unheated' },
    images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop'],
    startingBid: 15000, currentBid: 15000, reservePrice: 22000,
    seller: users[2]._id, category: 'other', status: 'upcoming',
    auctionStart: inFiveDays, auctionEnd: inSevenDays,
    bids: [], views: 277,
  },
  {
    title: 'Alexandrite — 2.12 ct (Colour Change)',
    description: 'Exceptional Russian alexandrite showing dramatic colour change from vivid green in daylight to purplish-red under incandescent light. GIA certified.',
    carats: 2.12, color: 'Green / Purplish-Red (Colour Change)', clarity: 'Eye Clean', cut: 'Round Brilliant',
    origin: 'Ural Mountains, Russia',
    certification: { lab: 'GIA', reportNumber: 'GIA-2093847561', grade: 'Natural Alexandrite' },
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=600&fit=crop'],
    startingBid: 12000, currentBid: 19800, reservePrice: 15000,
    seller: users[1]._id, category: 'other', status: 'sold',
    auctionStart: new Date(now.getTime() - 7*86400000),
    auctionEnd:   new Date(now.getTime() - 2*86400000),
    winner: users[3]._id,
    bids: [
      { bidder: users[3]._id, amount: 14000 },
      { bidder: users[4]._id, amount: 17000 },
      { bidder: users[3]._id, amount: 19800 },
    ],
    views: 1089,
  },
]);
console.log(`💎 Seeded ${gemstones.length} gemstones`);

const inquiries = await Inquiry.insertMany([
  { name: 'James Whitmore', email: 'james@example.com', subject: 'Provenance documentation for Kashmir Sapphire', message: 'I would like to request additional provenance documentation before placing a bid. Can you provide the full chain of custody?', status: 'new' },
  { name: 'Mei Lin Chen',   email: 'mei@example.com',   subject: 'Private viewing — Padparadscha Sapphire',       message: 'Is it possible to arrange a private viewing via video call with the seller before the auction opens?', status: 'read' },
  { name: 'Robert Ashford', email: 'robert.a@collectors.net', subject: 'Consignment enquiry', message: 'I have a collection of 12 certified gemstones I am looking to consign for auction. Who would I contact to discuss terms?', status: 'replied' },
]);
console.log(`📬 Seeded ${inquiries.length} inquiries`);

await mongoose.disconnect();
console.log('\n🎉 All done! Database is fully seeded.');
console.log(`\n📊 Summary:`);
console.log(`   👤 ${users.length} users (3 sellers, 2 collectors)`);
console.log(`   🏪 ${sellers.length} seller ateliers`);
console.log(`   💎 ${gemstones.length} gemstones (3 live, 3 upcoming, 1 sold)`);
console.log(`   📬 ${inquiries.length} contact inquiries`);
