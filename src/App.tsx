
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { NavigationControl } from "@/components/NavigationControl";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sell from "./pages/Sell";
import Returns from "./pages/Returns";
import NewReturn from "./pages/NewReturn";
import OrderTrackingPage from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Helmet>
                <title>Snorty Thrifts Marketplace - Buy & Sell Quality Pre-loved Items</title>
                <meta name="description" content="Discover amazing deals on quality pre-loved items at Snorty Thrifts Marketplace. Buy and sell electronics, fashion, furniture, and more at unbeatable prices." />
                <meta name="keywords" content="thrift, marketplace, buy, sell, second hand, pre-loved, electronics, fashion, furniture, Kenya" />
                <meta name="author" content="Snorty Thrifts" />
                <link rel="canonical" href="https://snorty-thrifts-marketplace.vercel.app" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://snorty-thrifts-marketplace.vercel.app" />
                <meta property="og:title" content="Snorty Thrifts Marketplace - Buy & Sell Quality Pre-loved Items" />
                <meta property="og:description" content="Discover amazing deals on quality pre-loved items. Join thousands of buyers and sellers on Kenya's premier thrift marketplace." />
                <meta property="og:image" content="https://snorty-thrifts-marketplace.vercel.app/og-image.jpg" />
                <meta property="og:site_name" content="Snorty Thrifts Marketplace" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://snorty-thrifts-marketplace.vercel.app" />
                <meta property="twitter:title" content="Snorty Thrifts Marketplace - Buy & Sell Quality Pre-loved Items" />
                <meta property="twitter:description" content="Discover amazing deals on quality pre-loved items. Join thousands of buyers and sellers on Kenya's premier thrift marketplace." />
                <meta property="twitter:image" content="https://snorty-thrifts-marketplace.vercel.app/og-image.jpg" />

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Language" content="en" />
                <link rel="icon" type="image/png" href="/favicon.png" />
              </Helmet>
              
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <NavigationControl />
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Suspense fallback={<LoadingSpinner size="lg" text="Loading page..." />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected routes */}
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/sell" element={
                          <ProtectedRoute>
                            <Sell />
                          </ProtectedRoute>
                        } />
                        <Route path="/returns" element={
                          <ProtectedRoute>
                            <Returns />
                          </ProtectedRoute>
                        } />
                        <Route path="/returns/new" element={
                          <ProtectedRoute>
                            <NewReturn />
                          </ProtectedRoute>
                        } />
                        <Route path="/order/:orderId" element={
                          <ProtectedRoute>
                            <OrderTrackingPage />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/404" element={<NotFound />} />
                        {/* Catch-all route for unknown paths */}
                        <Route path="*" element={<Navigate to="/404" replace />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
