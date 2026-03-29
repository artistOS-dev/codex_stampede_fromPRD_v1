import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stampede Signup',
  description: 'Web + mobile signup powered by Supabase'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
