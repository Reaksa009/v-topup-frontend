import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import api from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageSkeleton from './components/PageSkeleton';
import ScrollToTop from './components/ScrollToTop';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const Games = lazy(() => import('./pages/Games'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const Promotions = lazy(() => import('./pages/Promotions'));
const News = lazy(() => import('./pages/News'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const NotFound = lazy(() => import('./pages/NotFound'));

import './App.css';

function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.success) {
          setMaintenanceMode(res.data.data.maintenance_mode);
          setAlertMessage(res.data.data.alert_message || '');
        }
      } catch (err) {
        console.error('Error loading system settings:', err);
      }
    };
    fetchSettings();
    // Poll settings every 15 seconds to keep dynamic notices updated
    const interval = setInterval(fetchSettings, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-slate-950 text-slate-350 transition-colors duration-300">
                {/* Global Broadcast/Alert Notices */}
                {alertMessage && (
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-650 to-blue-700 text-white text-xs font-bold py-2.5 px-4 text-center select-none relative z-50 flex items-center justify-center gap-2">
                    <span className="bg-indigo-900/60 px-2 py-0.5 rounded text-[10px] font-black uppercase">Notice</span>
                    <span>{alertMessage}</span>
                  </div>
                )}
                {maintenanceMode && (
                  <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 text-xs font-extrabold py-2 px-4 text-center uppercase tracking-wider select-none relative z-50 flex items-center justify-center gap-2">
                    <span>⚠️ System Mode: Manual Verification active. Top-up payments processed manually.</span>
                  </div>
                )}

                <Navbar />
                
                <main className="flex-grow">
                  <Suspense fallback={<PageSkeleton />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/games" element={<Games />} />
                      <Route path="/games/:slug" element={<GameDetail />} />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/success" element={<Success />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>

                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
