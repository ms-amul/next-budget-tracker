'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'authenticated') {
    router.push('/dashboard'); // Redirect to dashboard after signing in
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Budget Tracker</h1>
      <button
        onClick={() => signIn('google')}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
      >
        <img
          src="/google-logo.png" // Add the Google logo in public directory
          alt="Google"
          className="w-6 h-6 mr-2"
        />
        Sign in with Google
      </button>
    </div>
  );
}
