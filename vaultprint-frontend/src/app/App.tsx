import { useState, useEffect } from 'react';
import { KioskDisplay } from '@/app/components/kiosk-display';
import { MobileApp } from '@/app/components/mobile-app';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is accessing from mobile device
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
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
