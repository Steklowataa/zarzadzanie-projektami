'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthorisationPage() {
  const router = useRouter();

  // Opcjonalnie: jeśli admin zmieni rolę w locie, a użytkownik odświeży stronę
  // można tu dodać sprawdzenie, czy nadal jest GUEST-em.

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-200 flex flex-col items-center justify-center cursor-not-allowed">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-700">Oczekiwanie na autoryzację</h1>
        <p className="text-gray-500 mt-2">Twój status to: <span className="font-bold">Gość</span></p>
        <p className="text-gray-400 text-sm mt-4">Poczekaj, aż administrator nada Ci uprawnienia do korzystania z aplikacji.</p>
        
        <button 
          onClick={() => {
            sessionStorage.clear();
            router.push('/'); // Powrót do logowania (wylogowanie)
          }}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Zaloguj się na inne konto
        </button>
      </div>
    </div>
  );
}