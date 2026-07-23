import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Gamepad2,
  ListOrdered,
  Sun,
  Moon,
  Search,
  Grid,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { Dropdown } from 'antd';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const megaMenuRef = useRef(null);
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Mock list of popular games for Mega Menu and Search
  const POPULAR_GAMES = [
    { name: 'Mobile Legends', slug: 'mobile-legends', category: 'MOBA', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', active: true },
    { name: 'Free Fire', slug: 'free-fire', category: 'Battle Royale', image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', active: true },
    { name: 'PUBG Mobile', slug: 'pubg-mobile', category: 'Battle Royale', image: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', active: true },
    { name: 'Valorant', slug: 'valorant', category: 'FPS', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', active: true },
    { name: 'Roblox', slug: 'roblox', category: 'Entertainment', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', active: true },
    { name: 'Steam Wallet', slug: 'steam-wallet', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80', active: true }
  ];

  const filteredGames = searchQuery.trim() === ''
    ? []
    : POPULAR_GAMES.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile" className="font-semibold text-xs text-slate-200 hover:text-blue-400">{t('profile')}</Link>,
      icon: <User size={14} className="text-slate-400" />,
    },
    {
      key: 'orders',
      label: <Link to="/orders" className="font-semibold text-xs text-slate-200 hover:text-blue-400">{t('my_orders')}</Link>,
      icon: <ListOrdered size={14} className="text-slate-400" />,
    },
    ...(isAdmin()
      ? [
          {
            key: 'admin',
            label: <Link to="/admin" className="font-bold text-xs text-blue-450 hover:text-blue-400">{t('admin_dashboard')}</Link>,
            icon: <LayoutDashboard size={14} className="text-blue-400" />,
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span className="font-bold text-xs text-red-500 hover:text-red-400 cursor-pointer">{t('logout')}</span>,
      icon: <LogOut size={14} className="text-red-500" />,
      onClick: handleLogout,
    },
  ];

  const themeMenuItems = [
    {
      key: 'dark',
      label: <span className="font-semibold text-xs text-slate-200">Dark Mode (Default)</span>,
      icon: <Moon size={14} className="text-blue-500" />,
      onClick: () => setTheme('dark'),
    },
    {
      key: 'light',
      label: <span className="font-semibold text-xs text-slate-400">Light Mode (Coming Soon)</span>,
      icon: <Sun size={14} className="text-slate-500" />,
      onClick: () => {},
    }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#050816]/75 backdrop-blur-md border-b border-white/8 shadow-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 select-none group">
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Gamepad2 size={22} className="animate-pulse-glow" />
            </div>
            <div className="text-left leading-none">
              <span className="text-white font-extrabold tracking-wider text-lg uppercase block">
                V-TOPUP
              </span>
              <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">
                Partner Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Mega Menu Toggle Trigger */}
            <div className="relative" ref={megaMenuRef}>
              <button
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                className={`flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  showMegaMenu ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid size={14} />
                Explore Games
                <ChevronDown size={12} className={`transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                    className="absolute top-12 left-[-100px] w-[580px] bg-[#0b1023]/95 backdrop-blur-2xl border border-white/8 rounded-2xl p-5 shadow-2xl z-50 grid grid-cols-3 gap-4"
                  >
                    <div className="col-span-3 border-b border-white/5 pb-2 mb-1 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Sparkles size={11} /> Top Popular Games
                      </span>
                      <Link to="/games" onClick={() => setShowMegaMenu(false)} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5">
                        View All <ArrowRight size={10} />
                      </Link>
                    </div>
                    {POPULAR_GAMES.map((g) => (
                      <Link
                        key={g.slug}
                        to={`/games/${g.slug}`}
                        onClick={() => setShowMegaMenu(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200"
                      >
                        <img src={g.image} alt={g.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="text-left">
                          <h4 className="text-white font-bold text-xs line-clamp-1">{g.name}</h4>
                          <span className="text-[9px] text-slate-500 font-medium">{g.category}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {[
              { path: '/games', label: t('games') },
              { path: '/promotions', label: t('promotions') },
              { path: '/news', label: t('news') },
              { path: '/contact', label: t('contact') }
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'text-blue-400 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3B82F6] animate-pulse"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Autocomplete Search input */}
          <div className="hidden md:block flex-1 max-w-sm relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search games or gift cards..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full h-10 bg-white/5 hover:bg-white/8 focus:bg-[#0b1023]/60 border border-white/8 focus:border-blue-500/50 rounded-xl pl-10 pr-4 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <AnimatePresence>
              {showSearchDropdown && searchQuery.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 right-0 bg-[#0b1023]/95 backdrop-blur-2xl border border-white/8 rounded-2xl p-2 shadow-2xl z-50"
                >
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                      <Link
                        key={game.slug}
                        to={`/games/${game.slug}`}
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchDropdown(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left"
                      >
                        <img src={game.image} alt={game.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-white font-bold text-xs">{game.name}</p>
                          <p className="text-[9px] text-slate-500 font-semibold">{game.category}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-4 text-center text-slate-500 text-xs font-bold">
                      No matching games found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action elements */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Language switch */}
            <div className="hidden sm:flex items-center bg-white/5 border border-white/5 rounded-xl p-1 shrink-0 select-none">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[9px] font-black tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('kh')}
                className={`text-[9px] font-black tracking-wider px-2.5 py-1.5 rounded-lg transition-all ml-1 cursor-pointer ${
                  language === 'kh'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                KH
              </button>
            </div>

            {/* Theme indicator */}
            <Dropdown
              menu={{ items: themeMenuItems }}
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="bg-[#0b1023]/95 border border-white/8 rounded-xl shadow-2xl p-1"
            >
              <button className="hidden sm:flex p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer select-none items-center justify-center">
                <Moon size={16} className="text-blue-400" />
              </button>
            </Dropdown>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all select-none"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-[#050816] shadow-[0_0_8px_#3B82F6] animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown with stats */}
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="bg-[#0b1023]/95 border border-white/8 rounded-xl shadow-2xl p-1"
              >
                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer select-none">
                  <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#050816]"></span>
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-white font-bold text-xs block max-w-[80px] truncate">{user?.name}</span>
                    <span className="text-[8px] text-cyan-400 font-semibold block mt-0.5">$25.80 Wallet</span>
                  </div>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>
              </Dropdown>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 transition-all border border-blue-500/10"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Sidebar Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050816]/95 backdrop-blur-2xl border-t border-white/5 px-6 py-6 flex flex-col gap-5 animate-fadeIn select-none">
          {/* Mobile Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search game top-ups..."
              className="w-full h-9 bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            {[
              { path: '/', label: t('home') },
              { path: '/games', label: t('games') },
              { path: '/promotions', label: t('promotions') },
              { path: '/news', label: t('news') },
              { path: '/contact', label: t('contact') }
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-bold transition-all duration-300 ${
                    isActive ? 'text-blue-400 font-black' : 'text-slate-350 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Language selection mobile */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold text-xs flex items-center gap-2">
              <Globe size={14} /> Language
            </span>
            <div className="flex bg-white/5 border border-white/5 rounded-xl p-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-450'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('kh')}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg transition-all ml-1 ${
                  language === 'kh' ? 'bg-blue-600 text-white' : 'text-slate-455'
                }`}
              >
                KH
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* User profiles or authentication actions */}
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-extrabold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-sm">{user?.name}</h4>
                  <p className="text-[10px] text-cyan-400 font-semibold">$25.80 wallet balance</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center bg-white/5 border border-white/5 text-slate-200 rounded-xl text-xs font-bold"
                >
                  {t('profile')}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center bg-white/5 border border-white/5 text-slate-200 rounded-xl text-xs font-bold"
                >
                  {t('my_orders')}
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs font-bold"
                  >
                    {t('admin_dashboard')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 text-center bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-bold"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-extrabold bg-white/5 border border-white/5 text-slate-300 rounded-xl uppercase tracking-wider"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-black bg-blue-600 text-white rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/10"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
