'use client'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function ClientToolbar() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    console.log('pathname', pathname);
    if (typeof window !== 'undefined') {
      const checkToken = () => {
        const token = Cookies.get('access-token');
        setAccessToken(token);
      };

      checkToken();

      const handlePathChange = () => {
        checkToken();
      };

      window.addEventListener('popstate', handlePathChange);

      return () => {
        window.removeEventListener('popstate', handlePathChange);
      };
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('access-token');
      window.location.reload();
    }
  };

  if (!accessToken) {
    return null;
  }

  return (
    <div className="toolbar flex justify-between w-full bg-blue-500 p-2">
        <Typography variant="h6">{`שלום ${Cookies.get('user-name')}`}</Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>התנתק</Button>
    </div>
  );
} 