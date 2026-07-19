import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Gamepad2, Heart, Send, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#070b13] border-t border-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-wider">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-xl text-white">
                <Gamepad2 size={20} />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                V-TOPUP-STORE
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Premium instant top-up service for your favorite mobile and PC games. Safe, reliable, and convenient.
            </p>
            {/* Accepted Payments mock */}
            <div className="mt-2">
              <h4 className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-2">Supported Payments</h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-[10px] font-black tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded">
                  KHQR
                </span>
                <span className="px-2 py-1 text-[10px] font-black tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded">
                  ABA PAY
                </span>
                <span className="px-2 py-1 text-[10px] font-black tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded">
                  WING
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">{t('games')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">Mobile Legends</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">Free Fire</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">PUBG Mobile</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">Honor of Kings</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">Steam Wallet</Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-smooth">{t('home')}</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-smooth">{t('games')}</Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-blue-400 transition-smooth">{t('promotions')}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-blue-400 transition-smooth">{t('news')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-smooth">{t('contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500 shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500 shrink-0" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span>support@vtopup.com</span>
              </li>
              <li className="pt-2 flex items-center gap-3">
                <a
                  href="https://t.me/vtopup_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-md"
                >
                  <Send size={16} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-slate-900 my-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>{t('footer_text')}</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-current" /> in Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
