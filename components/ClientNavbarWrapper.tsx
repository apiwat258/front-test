'use client';

import { usePathname } from 'next/navigation';
import HomeNav from './HomeNav';
import FarmerNavbar from './FarmerNavbar';
import FactoryNavbar from './FactoryNav';
import LogisNav from './LogisNav';
import RetailNav from './RetailNav';

export default function ClientNavbarWrapper() {
  const pathname = usePathname().toLowerCase();

  if (pathname === '/' || pathname.startsWith('/signup') || pathname.startsWith('/tracking')) {
    return <HomeNav />;
  } else if (pathname.startsWith('/farmer')) {
    return <FarmerNavbar />;
  } else if (pathname.startsWith('/factory')) {
    return <FactoryNavbar />;
  } else if (pathname.startsWith('/logistic')) {
    return <LogisNav />;
  } else if (pathname.startsWith('/retail')) {
    return <RetailNav />;
  } else {
    return null;
  }
}
