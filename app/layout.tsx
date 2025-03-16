import './globals.css';
import ClientNavbarWrapper from '../components/ClientNavbarWrapper';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <ClientNavbarWrapper />
        {children}
      </body>
    </html>
  );
}
