import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ma Coloc Solidaire',
  description: 'Jeu pédagogique de gestion de colocation solidaire — inspiré de La Roue de l\'Infortune (LpL)',
  keywords: ['colocation solidaire', 'précarité', 'jeu pédagogique', 'insertion'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3d6b8f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
