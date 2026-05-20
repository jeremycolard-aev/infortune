import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ma Coloc Solidaire',
  description:
    "Jeu pédagogique de gestion de colocations solidaires — inspiré de La Roue de l'Infortune de l'association Lien pour l'Autre",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div id="app-wrapper">{children}</div>
      </body>
    </html>
  );
}
