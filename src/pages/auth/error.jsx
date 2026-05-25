import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const errorMessages = {
    Configuration: 'Server configuration error. Please contact support.',
    AccessDenied: 'Access was denied. Please try again.',
    Verification: 'The verification link has expired.',
    Default: 'An authentication error occurred.',
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <div className="luxury-card rounded-2xl p-10 text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="font-serif text-3xl text-luxury-cream mb-3">Authentication Error</h1>
        <p className="text-luxury-cream/60 mb-8">
          {errorMessages[error] || errorMessages.Default}
        </p>
        <Link href="/" className="btn-gold px-8 py-3 rounded text-sm inline-block">
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}
