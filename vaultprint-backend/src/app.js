import { useState, useEffect } from 'react';
import { KioskDisplay } from '@/app/components/kiosk-display';
import { MobileApp } from '@/app/components/mobile-app';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen">
      {isMobile ? <MobileApp /> : <KioskDisplay />}
    </div>
  );
}
