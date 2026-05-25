import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleFacebookSignIn = () => {
    signIn('facebook', { callbackUrl: '/' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (form.password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        const res = await axios.post('/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setSuccess('Account created! Please sign in.');
        setTimeout(() => { setMode('signin'); setSuccess(''); }, 1500);
      } else {
        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        if (result?.error) {
          setError(result.error);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center auth-overlay" onClick={onClose}>
      <div
        className="relative w-full max-w-md mx-4 luxury-card rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-luxury-cream/50 hover:text-luxury-gold transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center text-luxury-black font-bold text-2xl font-serif mx-auto mb-3">
            G
          </div>
          <h2 className="font-serif text-2xl text-luxury-cream">
            {mode === 'signin' ? 'Welcome Back' : 'Join The Sanctuary'}
          </h2>
          <p className="text-luxury-cream/50 text-sm mt-1">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your collector account'}
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-white/20 text-luxury-cream hover:bg-white/5 transition-all text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleFacebookSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-white/20 text-luxury-cream hover:bg-white/5 transition-all text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="gold-divider flex-1"></div>
          <span className="text-luxury-cream/40 text-xs uppercase tracking-widest">or</span>
          <div className="gold-divider flex-1"></div>
        </div>

        {/* Error/Success */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-luxury-cream/60 text-xs uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="luxury-input w-full px-4 py-3 rounded-lg text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-luxury-cream/60 text-xs uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className="luxury-input w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-luxury-cream/60 text-xs uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="luxury-input w-full px-4 py-3 pr-10 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-luxury-cream/40 hover:text-luxury-gold"
              >
                {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-luxury-cream/60 text-xs uppercase tracking-wider mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="luxury-input w-full px-4 py-3 rounded-lg text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 rounded-lg text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-luxury-cream/50 text-sm mt-6">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            className="text-luxury-gold hover:underline"
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
