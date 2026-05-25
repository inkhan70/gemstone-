# 🏛 The Gilded Sanctuary — Enhanced Full-Stack Site

A premium luxury gemstone auction marketplace — enhanced and rebuilt as a full-stack Next.js app.

## 🚀 Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth.js (Google OAuth + Facebook OAuth + Email/Password)
- **Styling**: Tailwind CSS with custom luxury design system

## 📦 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (get from https://developers.facebook.com/)
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gilded-sanctuary
```

### 3. Set up OAuth Apps

**Google:**
1. Go to https://console.cloud.google.com/
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**Facebook:**
1. Go to https://developers.facebook.com/
2. Create a new app → Consumer
3. Add Facebook Login product
4. Add Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### 4. Run development server
```bash
npm run dev
```
Visit http://localhost:3000

### 5. Build for production
```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Add your environment variables in Vercel dashboard.

### Other Platforms
- Railway, Render, Heroku — all support Next.js
- Ensure MongoDB Atlas is used for production database

## 📁 Project Structure
```
src/
├── components/
│   ├── Navbar.jsx       # Navigation with auth
│   ├── AuthModal.jsx    # Sign in/Sign up modal
│   ├── AuctionCard.jsx  # Gemstone auction card with live countdown
│   └── Footer.jsx       # Site footer
├── pages/
│   ├── index.jsx        # Homepage
│   ├── marketplace.jsx  # Auction marketplace with filters
│   ├── sellers.jsx      # Certified ateliers directory
│   ├── contact.jsx      # Contact form
│   ├── dashboard.jsx    # User dashboard (protected)
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth].js  # NextAuth config
│       │   └── register.js       # User registration
│       ├── gemstones.js          # Gemstone CRUD API
│       ├── sellers.js            # Sellers API
│       └── contact.js            # Contact form API
├── lib/
│   ├── mongodb.js       # DB connection
│   └── models.js        # Mongoose schemas
└── styles/
    └── globals.css      # Global styles + design tokens
```

## ✨ Features
- 🔐 **Full Auth**: Google, Facebook, Email/Password
- 🏛 **Luxury UI**: Dark theme, gold accents, Playfair Display typography
- ⚡ **Live Auctions**: Real-time countdown timers, bid placement
- 🔍 **Marketplace Filters**: Category, price range, carats, certification
- 👤 **User Dashboard**: Protected route, activity tracking
- 📱 **Fully Responsive**: Mobile-first design
- 🗄 **MongoDB Backend**: Full CRUD APIs for gemstones, sellers, contacts
- 🎨 **Enhanced Design**: Animated hero, parallax effects, hover transitions
