import { Poppins } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import { AuthProvider } from "./Context/AuthContext";
import NextTopLoader from "nextjs-toploader";
import CartProvider from "./redux/CartProvider";
import ReportButton from "./Components/ReportButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata = {
  title: "Restaurant Dashboard",
  description: "Baksish Restaurant Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-poppins`}>
        <NextTopLoader
          showSpinner={false}
          color="#fbbf24"
          crawlSpeed={100}
          height={3}
        />
        
        <AuthProvider>
        <ReportButton/>
          <CartProvider>
          {children}</CartProvider></AuthProvider>
      </body>
    </html>
  );
}
