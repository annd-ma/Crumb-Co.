import "./globals.css";
import { CartProvider } from "../lib/CartContext";
import Navbar          from "../components/Navbar";
import CartDrawer      from "../components/CartDrawer";
import SiteFooter      from "../components/SiteFooter";

export const metadata = {
  title:       "Crumb & Co. — Artisan Bakery Jakarta",
  description: "Roti artisan premium dari bahan organik lokal. Dipanggang segar setiap hari.",
};

/**
 * The top-level component for the app.
 *
 * It wraps the entire app with the CartProvider, which
 * provides the cart state and functions to update it.
 *
 * It also renders the Navbar, CartDrawer, and SiteFooter
 * components.
 *
 * @param {ReactNode} children - The content of the app.
 *
 * @returns {ReactNode} The wrapped app.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}