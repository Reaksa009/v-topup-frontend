import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
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
  Moon
} from 'lucide-react';
import { Dropdown } from 'antd';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile" className="font-semibold text-xs text-slate-200 hover:text-cyan-400">{t('profile')}</Link>,
      icon: <User size={14} className="text-slate-400" />,
    },
    {
      key: 'orders',
      label: <Link to="/orders" className="font-semibold text-xs text-slate-200 hover:text-cyan-400">{t('my_orders')}</Link>,
      icon: <ListOrdered size={14} className="text-slate-400" />,
    },
    ...(isAdmin()
      ? [
          {
            key: 'admin',
            label: <Link to="/admin" className="font-bold text-xs text-cyan-400 hover:text-cyan-300">{t('admin_dashboard')}</Link>,
            icon: <LayoutDashboard size={14} className="text-cyan-400" />,
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span className="font-bold text-xs text-red-400 hover:text-red-300 cursor-pointer">{t('logout')}</span>,
      icon: <LogOut size={14} className="text-red-400" />,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-850 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-wider select-none group">
            <div className="bg-blue-600 p-2.5 rounded-lg text-white">
              <Gamepad2 size={24} />
            </div>
            <span className="text-white font-bold tracking-wider text-xl uppercase">
              V-TOPUP-STORE
            </span>
          </Link>

          {/* Desktop Links with active glowing dot indicators */}
          <div className="hidden md:flex items-center gap-8">
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
                className={({ isActive }) =>
                  `relative py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-[#070a1a]/60 border border-slate-900/60 rounded-xl p-1 shrink-0 select-none">
              <Globe size={14} className="text-slate-500 mx-2" />
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[10px] font-black tracking-wider px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/10'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('kh')}
                className={`text-[10px] font-black tracking-wider px-2.5 py-1.5 rounded-lg transition-all ml-1 cursor-pointer ${
                  language === 'kh'
                    ? 'bg-gradient-to-r from-blue-650 to-indigo-650 text-white shadow-md shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-250 hover:bg-slate-900/10'
                }`}
              >
                ខ្មែរ
              </button>
            </div>

            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-450 hover:text-white hover:border-slate-800 transition-smooth hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer select-none"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-450 animate-pulse" />
              ) : (
                <Moon size={16} className="text-indigo-400" />
              )}
            </button>

            {/* Shopping Cart Indicator */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-400 hover:text-white hover:border-slate-800 transition-smooth hover:shadow-lg hover:shadow-blue-500/5 select-none"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile dropdown or Login actions */}
            {isAuthenticated ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="bg-slate-900 border border-slate-850 rounded-xl shadow-2xl p-1"
              >
                <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-350 hover:text-white transition-smooth cursor-pointer select-none">
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-500/10">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 shadow-emerald-500/30"></span>
                  </div>
                  <span className="max-w-[90px] truncate text-xs font-bold">{user?.name}</span>
                  <ChevronDown size={12} className="text-slate-500" />
                </button>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-smooth"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/15 active:scale-95 transition-all border border-blue-500/10"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-3 select-none">
            {/* Theme Toggle Switch mobile */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-400 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-450" />
              ) : (
                <Moon size={18} className="text-indigo-400" />
              )}
            </button>

            {/* Cart on mobile */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-400"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-955 text-[8.5px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-450 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glassmorphism-dark border-t border-white/5 px-6 py-6 flex flex-col gap-5 animate-fadeIn select-none">
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
                    isActive ? 'text-cyan-400 font-black' : 'text-slate-350 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="h-px bg-slate-900"></div>

          {/* Language Switcher mobile */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold text-xs flex items-center gap-2">
              <Globe size={14} /> Language
            </span>
            <div className="flex bg-[#070a1a]/60 border border-slate-900 rounded-xl p-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en' ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('kh')}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ml-1 ${
                  language === 'kh' ? 'bg-gradient-to-r from-blue-650 to-indigo-650 text-white' : 'text-slate-400'
                }`}
              >
                ខ្មែរ
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-900"></div>

          {/* Auth options mobile */}
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-extrabold text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{user?.name}</h4>
                  <p className="text-slate-500 text-[10px] truncate max-w-[200px]">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 mt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-slate-300 text-xs font-bold hover:text-white"
                >
                  {t('profile')}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-slate-300 text-xs font-bold hover:text-white"
                >
                  {t('my_orders')}
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 bg-slate-950/40 border border-slate-900 rounded-xl text-cyan-400 text-xs font-bold hover:text-cyan-300"
                  >
                    {t('admin_dashboard')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-bold"
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
                className="w-full py-3 text-center text-xs font-extrabold bg-slate-950/40 border border-slate-900 text-slate-300 rounded-xl uppercase tracking-wider"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-650 text-white rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/10"
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
