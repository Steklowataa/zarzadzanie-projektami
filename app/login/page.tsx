'use client';

import { useState } from 'react';
import { auth, db } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getRoleByEmail } from '@/settings';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const userRef = doc(db, "users", fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const initialRole = getRoleByEmail(fbUser.email || '');
        await setDoc(userRef, {
          id: fbUser.uid,
          name: fbUser.displayName || 'Użytkownik',
          email: fbUser.email,
          role: initialRole,
          createdAt: new Date().toISOString()
        });
      }

      // ✅ SOFT REDIRECT (Next.js)
      router.push('/projects');

    } catch (err: any) {
      setError('Błąd logowania. Spróbuj ponownie.');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5]">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center min-w-[350px]">
        <h1 className="text-2xl font-bold mb-8">System Zarządzania</h1>
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 w-full"
        >
          {isLoggingIn ? 'Logowanie...' : 'Zaloguj się przez Google'}
        </button>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}