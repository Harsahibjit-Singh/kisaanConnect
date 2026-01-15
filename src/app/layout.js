import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider"; 

// Using Plus Jakarta Sans for a modern, tech-forward look
const fontSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Kisaan Connect | Smart Mandi Management System for Arthiyas & Farmers",
    template: "%s | Kisaan Connect"
  },
  description: "India's #1 Digital Mandi Platform. Automate sale receipts, track farmer loans, calculate commissions, and manage mandi operations effortlessly with Kisaan Connect.",
  keywords: ["Digital Mandi", "Kisaan Connect", "Arthiya Software", "Farmer Accounting App", "Mandi Commission Calculator", "Agriculture Billing Software India", "J-Form Software"],
  authors: [{ name: "Kisaan Connect Team", url: "https://kisaanconnect.com" }],
  creator: "Kisaan Connect Pvt Ltd",
  publisher: "Kisaan Connect",
  metadataBase: new URL('https://kisaanconnect.com'), // Replace with actual domain
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-in',
      'hi-IN': '/hi-in',
    },
  },
  openGraph: {
    title: "Kisaan Connect | The Future of Agri-Tech",
    description: "Manage sales, loans, and farmer records in one place. The smartest way to run your Mandi business.",
    url: "https://kisaanconnect.com",
    siteName: "Kisaan Connect",
    images: [
      {
        url: "/images/og-kisaan-connect.jpg", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "Kisaan Connect Dashboard Interface",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kisaan Connect | Digital Mandi System",
    description: "Simplify your Mandi accounting. Generate bills and track loans instantly.",
    creator: "@kisaanconnect",
    images: ["/images/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Add your console code here
  },
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kisaan Connect",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "A full-stack web application for managing Mandi operations, farmer sales, and loans.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <html lang="en" className={`scroll-smooth ${fontSans.variable}`}>
      <head>
        <meta name="theme-color" content="#22c55e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-gray-950 text-gray-100 antialiased selection:bg-green-500 selection:text-white">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {/* Navbar is sticky and aware of scroll */}
            <Navbar />
            
            {/* Main Content Area */}
            <main className="flex-grow">
              {children}
            </main>
            
            {/* SEO-Rich Footer */}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}