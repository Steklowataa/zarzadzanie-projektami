'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { getRoleByEmail } from '@/settings';


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const parseJwt = (token: string) => {
    try {
      const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64Payload)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };


  // Wewnątrz handleCallbackResponse w LoginPage.tsx

const handleCallbackResponse = (response: any) => {
  try {
    const payload = parseJwt(response.credential);
    if (!payload || !payload.email) throw new Error('Błąd danych');

    const storedUsersRaw = localStorage.getItem('app_users');
    const users = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    let currentUser = users.find((u: any) => u.email === payload.email);

    if (!currentUser) {
      const initialRole = getRoleByEmail(payload.email);
      currentUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        role: initialRole,
      };
      users.push(currentUser);
      localStorage.setItem('app_users', JSON.stringify(users));
    }

    sessionStorage.setItem('gsi_credential', response.credential);
    sessionStorage.setItem('user_role', currentUser.role);
    sessionStorage.setItem('user_name', currentUser.name);

    // Jeśli konto jest zablokowane
    if (currentUser.role === 'blocked') {
      setError('Twoje konto jest zablokowane.');
    return;
    }

  if (currentUser.role === 'guest') {
    router.push('/login/authorisation');
  } else {
  // Tutaj wpadnie: admin, super-admin, developer, devops
  router.push('/projects');
}
  } catch (err) {
    setError('Błąd logowania.');
  }
};

  const onGoogleScriptLoad = () => {
    if (typeof window !== 'undefined' && (window as any).google) {
      const google = (window as any).google;
      
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
        auto_select: false,
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInBtn'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: '300',
          text: 'signin_with',
          shape: 'rectangular' 
        }
      );
      
      setLoading(false);
    }
  };

  // Sprawdzenie, czy użytkownik ma już aktywną sesję przy wejściu na stronę
  useEffect(() => {
    const storedToken = sessionStorage.getItem('gsi_credential');
    const storedRole = sessionStorage.getItem('user_role');

    if (storedToken && storedRole) {
      const payload = parseJwt(storedToken);
      // Sprawdzamy czy token nie wygasł (exp jest w sekundach)
      if (payload && payload.exp * 1000 > Date.now()) {
        if (storedRole === 'super-admin') {
          router.push('/projects');
        } else {
          router.push('/login/authorisation');
        }
      } else {
        sessionStorage.clear();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2f5] font-sans">
      {/* Skrypt Google załadowany bezpiecznie przez Next.js */}
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={onGoogleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="bg-white p-10 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] text-center min-w-[350px]">
        <h1 className="text-[#333] text-2xl font-bold mb-2">Google OAuth</h1>
        <p className="text-[#888] text-sm mb-8">Zaloguj się, aby uzyskać dostęp</p>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Tutaj Google wyrenderuje swój oficjalny przycisk */}
            <div id="googleSignInBtn" className="min-h-[40px]"></div>
            
            {error && (
              <p className="text-red-600 text-sm mt-4 bg-red-50 p-2 rounded border border-red-100 w-full">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            System Autoryzacji v1.0
          </p>
        </div>
      </div>
    </div>
  );
}