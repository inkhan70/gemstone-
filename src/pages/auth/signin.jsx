import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthModal from '../../components/AuthModal';

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) router.push('/');
  }, [session]);

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <AuthModal isOpen={true} onClose={() => router.push('/')} />
    </div>
  );
}
