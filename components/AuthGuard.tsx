'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('user_role');
    const isLoginPage = pathname.startsWith('/login');
    if (!role && !isLoginPage) {
      router.push('/login');
    } 

    else if (role && isLoginPage) {
       if (role === 'SUPER_ADMIN') router.push('/projects');
       else router.push('/login/authorisation');
    }
    
    setIsChecking(false);
  }, [pathname, router]);
  if (isChecking && pathname !== '/login') {
    return <div className="bg-gray-100 min-h-screen" />; 
  }

  return <>{children}</>;
}