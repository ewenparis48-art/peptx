import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { CartProvider } from '../components/CartProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GatePopup from '../components/GatePopup';

export const metadata = {
  title: 'PeptX — Catalogue de peptides de recherche',
  description: 'Peptides de recherche haute pureté. Commande ici, paiement sur Telegram.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <CartProvider>
            <GatePopup />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
