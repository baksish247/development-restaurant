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
  metadataBase: new URL("https://restaurant.baksish.in"),
  title: {
    default: "Baksish | Table to Kitchen tech",
    template: "%s - RestaurantBaksish",
  },
  alternates: {
    canonical: "https://www.restaurant.baksish.in",
  },
  description:
    "Efficient restaurant management system featuring scan and order, inventory control, billing, and analytics. Streamline operations effortlessly.",
  twitter: {
    card: "summary_large_image",
  },
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
