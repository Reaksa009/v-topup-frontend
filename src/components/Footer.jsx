import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Gamepad2, Heart, Send, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050816] border-t border-white/5 text-slate-400 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4 text-left">
            <Link to="/" className="flex items-center gap-2.5 text-white font-extrabold text-2xl tracking-wider group">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/25">
                <Gamepad2 size={20} className="animate-pulse" />
              </div>
              <span className="text-white font-extrabold">
                V-TOPUP
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              World-class digital product for instant gaming top-up purchases. Secure, encrypted checkout, and automated 24/7 API integrations.
            </p>
            <div className="pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Partner Payment Channels</h4>
              <div className="flex items-center gap-3">
                <img src="/bakong_logo.jpg" alt="Bakong" className="h-6 rounded object-cover filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                <img src="/aba_logo.png" alt="ABA" className="h-6 rounded object-cover filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Catalog Titles Column */}
          <div className="text-left">
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-5">Supported Titles</h3>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link to="/games/mobile-legends" className="hover:text-blue-400 transition-all">Mobile Legends: Bang Bang</Link>
              </li>
              <li>
                <Link to="/games/free-fire" className="hover:text-blue-400 transition-all">Garena Free Fire</Link>
              </li>
              <li>
                <Link to="/games/pubg-mobile" className="hover:text-blue-400 transition-all">PUBG Mobile Global</Link>
              </li>
              <li>
                <Link to="/games/valorant" className="hover:text-blue-400 transition-all">Riot Games Valorant</Link>
              </li>
              <li>
                <Link to="/games/honor-of-kings" className="hover:text-blue-400 transition-all">Honor of Kings</Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div className="text-left">
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-5">Platform</h3>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-all">{t('home')}</Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-blue-400 transition-all">{t('games')}</Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-blue-400 transition-all">{t('promotions')}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-blue-400 transition-all">{t('news')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-all">{t('contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="text-left">
            <h3 className="text-white text-xs font-black uppercase tracking-widest mb-5">Customer Support</h3>
            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-center gap-3">
                <MapPin size={15} className="text-blue-500 shrink-0" />
                <span>Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-blue-500 shrink-0" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-blue-500 shrink-0" />
                <span>support@vtopup.com</span>
              </li>
              <li className="pt-2 flex items-center gap-3">
                <a
                  href="https://t.me/vtopup_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 hover:border-blue-550 rounded-xl text-blue-400 transition-all duration-300 shadow-md flex items-center justify-center"
                  title="Telegram Bot Support"
                >
                  <Send size={15} />
                </a>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/5 hover:border-indigo-550 rounded-xl text-indigo-400 transition-all duration-300 shadow-md flex items-center justify-center"
                  title="Discord Community"
                >
                  <MessageSquare size={15} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 hover:border-blue-550 rounded-xl text-blue-450 transition-all duration-300 shadow-md flex items-center justify-center"
                  title="Facebook Page"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/5 my-10"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-semibold text-slate-600">
          <p>© 2026 V-TOPUP Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-current" /> in Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
