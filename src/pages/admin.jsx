import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TABS = ['overview','users','listings','settings','logs'];

const ROLE_COLORS = {
  admin:     'text-red-400 border-red-400/40',
  seller:    'text-luxury-gold border-luxury-gold/40',
  collector: 'text-blue-400 border-blue-400/40',
};

const TIER_COLORS = {
  ultimate: 'text-purple-400',
  medium:   'text-green-400',
  starter:  'text-yellow-400',
  free:     'text-luxury-cream/40',
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab]           = useState('overview');
  const [stats, setStats]       = useState(null);
  const [users, setUsers]       = useState([]);
  const [listings, setListings] = useState([]);
  const [settings, setSettings] = useState({});
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/dashboard');
  }, [status, session]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    loadAll();
  }, [status]);

  async function loadAll() {
    setLoading(true);
    const [s, u, l, cfg] = await Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/gemstones?limit=50').then(r => r.json()),
      fetch('/api/admin/settings').then(r => r.json()),
    ]);
    setStats(s);
    setUsers(u.users || []);
    setListings(l.gemstones || []);
    setSettings(cfg.settings || {
      platformName: 'The Gilded Sanctuary',
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireSellerVerification: true,
      platformFeePercent: 5,
      featuredAuctionsEnabled: true,
      maxGuestCheckout: true,
      supportEmail: 'support@gildedsanctuary.com',
    });
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function updateUser(userId, patch) {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...patch }),
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(prev => prev.map(u => u._id === userId ? data.user : u));
      showToast('✅ User updated');
    } else {
      showToast('❌ ' + data.message);
    }
  }

  async function deleteUser(userId) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u._id !== userId));
      showToast('✅ User removed');
    } else {
      const d = await res.json();
      showToast('❌ ' + d.message);
    }
    setConfirmDelete(null);
  }

  async function saveSettings() {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    showToast(res.ok ? '✅ Settings saved' : '❌ Failed to save');
  }

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole   = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (status === 'loading' || loading) return <LoadingScreen />;
  if (!session || session.user.role !== 'admin') return null;

  return (
    <>
      <Head><title>Admin — The Gilded Sanctuary</title></Head>
      <Navbar onAuthClick={() => {}} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-luxury-charcoal border border-luxury-gold/30 text-luxury-cream px-5 py-3 rounded-lg text-sm shadow-xl transition-all">
          {toast}
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-luxury-black/80 flex items-center justify-center">
          <div className="luxury-card rounded-xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-serif text-xl text-luxury-cream mb-2">Delete User?</h3>
            <p className="text-luxury-cream/50 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-gold-outline flex-1 py-3 rounded text-xs">CANCEL</button>
              <button onClick={() => deleteUser(confirmDelete)} className="flex-1 py-3 rounded text-xs bg-red-600 hover:bg-red-700 text-white transition-all">DELETE</button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 pb-16 min-h-screen bg-luxury-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                <span className="text-red-400 text-xs uppercase tracking-[0.3em]">Admin Access</span>
              </div>
              <h1 className="font-serif text-4xl text-luxury-cream">Control Panel</h1>
              <p className="text-luxury-cream/40 text-sm mt-1">Signed in as {session.user.email}</p>
            </div>
            <div className="luxury-card rounded-xl px-5 py-3 text-center">
              <p className="text-red-400 text-xs uppercase tracking-widest">Platform Admin</p>
              <p className="text-luxury-cream font-serif text-lg mt-0.5">{session.user.name}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-luxury-gold/10 overflow-x-auto">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-xs uppercase tracking-widest whitespace-nowrap transition-all ${tab === t ? 'text-luxury-gold border-b-2 border-luxury-gold -mb-px' : 'text-luxury-cream/40 hover:text-luxury-cream/70'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && stats && (
            <div className="space-y-8">
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users',    value: stats.users?.total,         icon: '👥', color: 'text-blue-400' },
                  { label: 'Sellers',        value: stats.users?.sellers,        icon: '🏪', color: 'text-luxury-gold' },
                  { label: 'Live Auctions',  value: stats.listings?.live,        icon: '⚡', color: 'text-green-400' },
                  { label: 'Total Revenue',  value: `$${(stats.orders?.revenue||0).toLocaleString()}`, icon: '💰', color: 'text-purple-400' },
                  { label: 'Total Listings', value: stats.listings?.total,       icon: '💎', color: 'text-luxury-cream' },
                  { label: 'Items Sold',     value: stats.listings?.sold,        icon: '✅', color: 'text-green-400' },
                  { label: 'Total Orders',   value: stats.orders?.total,         icon: '📦', color: 'text-yellow-400' },
                  { label: 'Voice Calls',    value: stats.calls?.total,          icon: '📞', color: 'text-blue-400' },
                ].map(s => (
                  <div key={s.label} className="luxury-card rounded-xl p-5 text-center">
                    <div className="text-2xl mb-2">{s.icon}</div>
                    <p className={`font-serif text-2xl ${s.color}`}>{s.value ?? 0}</p>
                    <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tier breakdown */}
              <div className="luxury-card rounded-xl p-6">
                <h3 className="font-serif text-luxury-cream text-lg mb-4">Subscription Tiers</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['free','starter','medium','ultimate'].map(tier => {
                    const found = stats.tiers?.find(t => t._id === tier);
                    return (
                      <div key={tier} className="text-center">
                        <p className={`font-serif text-2xl ${TIER_COLORS[tier]}`}>{found?.count || 0}</p>
                        <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{tier}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick user breakdown */}
              <div className="luxury-card rounded-xl p-6">
                <h3 className="font-serif text-luxury-cream text-lg mb-4">User Roles</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Admins',     value: stats.users?.admins,     color: 'text-red-400' },
                    { label: 'Sellers',    value: stats.users?.sellers,    color: 'text-luxury-gold' },
                    { label: 'Collectors', value: stats.users?.collectors, color: 'text-blue-400' },
                  ].map(r => (
                    <div key={r.label}>
                      <p className={`font-serif text-3xl ${r.color}`}>{r.value ?? 0}</p>
                      <p className="text-luxury-cream/40 text-xs uppercase tracking-wider mt-1">{r.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div>
              {/* Search + filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  className="flex-1 bg-luxury-black/50 border border-luxury-gold/20 rounded px-4 py-2.5 text-luxury-cream text-sm focus:outline-none focus:border-luxury-gold/50"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select
                  className="bg-luxury-black/50 border border-luxury-gold/20 rounded px-4 py-2.5 text-luxury-cream text-sm focus:outline-none"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="collector">Collector</option>
                </select>
              </div>

              <p className="text-luxury-cream/40 text-xs mb-4">{filteredUsers.length} users</p>

              {/* Users table */}
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div key={user._id} className="luxury-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black text-sm font-bold font-serif flex-shrink-0">
                        {user.name?.[0] || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-luxury-cream text-sm font-medium truncate">{user.name}</p>
                        <p className="text-luxury-cream/50 text-xs truncate">{user.email}</p>
                        <p className="text-luxury-cream/30 text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded border ${ROLE_COLORS[user.role] || 'text-luxury-cream/40 border-luxury-cream/10'}`}>
                        {user.role}
                      </span>
                      <span className={`text-xs ${TIER_COLORS[user.subscriptionTier] || 'text-luxury-cream/30'}`}>
                        {user.subscriptionTier || 'free'}
                      </span>
                      {user.isVerified && <span className="text-green-400 text-xs">✓ verified</span>}
                      {user.provider && user.provider !== 'credentials' && (
                        <span className="text-luxury-cream/30 text-xs">{user.provider}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Grant / revoke admin */}
                      {user.role !== 'admin' ? (
                        <button onClick={() => updateUser(user._id, { role: 'admin' })}
                          className="text-xs px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                          Make Admin
                        </button>
                      ) : (
                        <button onClick={() => updateUser(user._id, { role: 'collector' })}
                          className="text-xs px-3 py-1.5 rounded border border-luxury-cream/10 text-luxury-cream/40 hover:bg-luxury-cream/5 transition-all">
                          Revoke Admin
                        </button>
                      )}

                      {/* Toggle seller */}
                      {user.role !== 'admin' && (
                        <button onClick={() => updateUser(user._id, { role: user.role === 'seller' ? 'collector' : 'seller' })}
                          className="text-xs px-3 py-1.5 rounded border border-luxury-gold/20 text-luxury-gold/70 hover:bg-luxury-gold/10 transition-all">
                          {user.role === 'seller' ? 'To Collector' : 'To Seller'}
                        </button>
                      )}

                      {/* Subscription tier */}
                      <select
                        className="text-xs bg-luxury-black border border-luxury-gold/15 rounded px-2 py-1.5 text-luxury-cream/60 focus:outline-none"
                        value={user.subscriptionTier || 'free'}
                        onChange={e => updateUser(user._id, { subscriptionTier: e.target.value })}
                      >
                        {['free','starter','medium','ultimate'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>

                      {/* Verify toggle */}
                      <button onClick={() => updateUser(user._id, { isVerified: !user.isVerified })}
                        className={`text-xs px-3 py-1.5 rounded border transition-all ${user.isVerified ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-luxury-cream/10 text-luxury-cream/30 hover:bg-luxury-cream/5'}`}>
                        {user.isVerified ? '✓ Verified' : 'Verify'}
                      </button>

                      {/* Delete */}
                      {user.role !== 'admin' && (
                        <button onClick={() => setConfirmDelete(user._id)}
                          className="text-xs px-3 py-1.5 rounded border border-red-900/40 text-red-600/70 hover:bg-red-900/20 transition-all">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LISTINGS ── */}
          {tab === 'listings' && (
            <div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-6">All Listings ({listings.length})</h2>
              <div className="space-y-2">
                {listings.map(gem => (
                  <div key={gem._id} className="luxury-card rounded-xl p-4 flex items-center gap-4">
                    <img src={gem.images?.[0] || 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=60'} alt=""
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-luxury-cream text-sm truncate">{gem.title}</p>
                      <p className="text-luxury-cream/40 text-xs">{gem.carats} ct · {gem.status}</p>
                    </div>
                    <p className="text-luxury-gold text-sm">${(gem.price || gem.currentBid || 0).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      gem.status === 'live' ? 'border-green-500/40 text-green-400' :
                      gem.status === 'sold' ? 'border-luxury-cream/10 text-luxury-cream/30' :
                      'border-luxury-gold/20 text-luxury-gold/60'}`}>
                      {gem.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <h2 className="font-serif text-2xl text-luxury-cream">Platform Settings</h2>

              <SettingsSection title="General">
                <SettingField label="Platform Name"
                  value={settings.platformName || ''}
                  onChange={v => setSettings(s => ({ ...s, platformName: v }))} />
                <SettingField label="Support Email" type="email"
                  value={settings.supportEmail || ''}
                  onChange={v => setSettings(s => ({ ...s, supportEmail: v }))} />
                <SettingField label="Platform Fee (%)" type="number"
                  value={settings.platformFeePercent ?? 5}
                  onChange={v => setSettings(s => ({ ...s, platformFeePercent: parseFloat(v) }))} />
              </SettingsSection>

              <SettingsSection title="Access Control">
                <ToggleSetting label="Allow New Registrations"
                  value={settings.allowNewRegistrations !== false}
                  onChange={v => setSettings(s => ({ ...s, allowNewRegistrations: v }))} />
                <ToggleSetting label="Require Seller Verification"
                  value={settings.requireSellerVerification !== false}
                  onChange={v => setSettings(s => ({ ...s, requireSellerVerification: v }))} />
                <ToggleSetting label="Allow Guest Checkout"
                  value={settings.maxGuestCheckout !== false}
                  onChange={v => setSettings(s => ({ ...s, maxGuestCheckout: v }))} />
                <ToggleSetting label="Maintenance Mode"
                  value={settings.maintenanceMode === true}
                  onChange={v => setSettings(s => ({ ...s, maintenanceMode: v }))}
                  danger />
              </SettingsSection>

              <SettingsSection title="Marketplace">
                <ToggleSetting label="Featured Auctions Enabled"
                  value={settings.featuredAuctionsEnabled !== false}
                  onChange={v => setSettings(s => ({ ...s, featuredAuctionsEnabled: v }))} />
                <SettingField label="Max Items Per Page" type="number"
                  value={settings.maxItemsPerPage ?? 24}
                  onChange={v => setSettings(s => ({ ...s, maxItemsPerPage: parseInt(v) }))} />
                <SettingField label="Default Auction Duration (hours)" type="number"
                  value={settings.defaultAuctionHours ?? 48}
                  onChange={v => setSettings(s => ({ ...s, defaultAuctionHours: parseInt(v) }))} />
              </SettingsSection>

              <SettingsSection title="Announcements">
                <SettingField label="Site-wide Banner Message (leave blank to hide)"
                  value={settings.bannerMessage || ''}
                  onChange={v => setSettings(s => ({ ...s, bannerMessage: v }))}
                  textarea />
              </SettingsSection>

              <button onClick={saveSettings} disabled={saving}
                className="btn-gold w-full py-4 rounded text-sm disabled:opacity-50">
                {saving ? 'SAVING...' : 'SAVE ALL SETTINGS →'}
              </button>
            </div>
          )}

          {/* ── LOGS ── */}
          {tab === 'logs' && (
            <div>
              <h2 className="font-serif text-2xl text-luxury-cream mb-6">Recent Activity</h2>
              <div className="space-y-2">
                {users.slice(0,20).map(u => (
                  <div key={u._id} className="luxury-card rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-luxury-cream/20 text-xs w-24 flex-shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
                    <span className="text-luxury-cream/60 text-xs flex-1">New {u.role} registered: <span className="text-luxury-cream">{u.name}</span> ({u.email})</span>
                    <span className={`text-xs ${ROLE_COLORS[u.role]?.split(' ')[0]}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────
function SettingsSection({ title, children }) {
  return (
    <div className="luxury-card rounded-xl p-6">
      <h3 className="font-serif text-luxury-gold text-sm uppercase tracking-widest mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingField({ label, value, onChange, type = 'text', textarea }) {
  const cls = "w-full bg-luxury-black/50 border border-luxury-gold/20 rounded px-3 py-2 text-luxury-cream text-sm focus:outline-none focus:border-luxury-gold/50";
  return (
    <div>
      <label className="text-luxury-cream/60 text-xs uppercase tracking-widest block mb-2">{label}</label>
      {textarea
        ? <textarea className={cls + ' h-16 resize-none'} value={value} onChange={e => onChange(e.target.value)} />
        : <input type={type} className={cls} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function ToggleSetting({ label, value, onChange, danger }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${danger ? 'text-red-400' : 'text-luxury-cream/70'}`}>{label}</span>
      <button onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all ${value ? (danger ? 'bg-red-500' : 'bg-luxury-gold') : 'bg-luxury-cream/10'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="text-luxury-gold font-serif text-xl animate-pulse">Loading Admin Panel...</div>
    </div>
  );
}
