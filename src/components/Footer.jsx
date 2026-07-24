import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Gamepad, Mail, Phone, Play } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#03050E] border-t border-white/5 text-slate-450 mt-auto select-none text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: Info Branding */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Gamepad className="text-blue-500 animate-pulse" size={24} />
              <span className="text-lg font-black tracking-widest text-white uppercase font-display">V-TOPUP</span>
            </Link>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-sm">
              Futuristic esports game currency marketplace. Secure auto-verified scan payments with instant API server integrations.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-455 font-medium">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-blue-500" />
                <span>support@v-topup.store</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-blue-500" />
                <span>+855 (0) 96 828 290</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-bold">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('home')}</Link></li>
              <li><Link to="/games" className="hover:text-blue-400 transition-colors">{t('games')}</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal Policies */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">Legal Policies</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-bold">
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">FAQs Accordions</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Refund & Claims</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Channels */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-wider">Social Channels</h4>
            <div className="flex flex-wrap gap-3">
              <a href="https://discord.gg" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <Play size={12} className="fill-current" />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <SendIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors font-bold text-xs">f</a>
            </div>
            <div className="pt-2">
              <span className="text-[8px] text-slate-650 font-bold uppercase tracking-wider block">KHQR payments accepted</span>
              <div className="flex gap-2 items-center mt-2.5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img src="/bakong_logo.jpg" alt="Bakong" className="w-5 h-5 rounded-md" />
                <img src="/aba_logo.png" alt="ABA" className="w-5 h-5 rounded-md" />
              </div>
            </div>
          </div>

        </div>

        <div className="pt-10 mt-10 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          <span>&copy; {new Date().getFullYear()} V-TOPUP-STORE CO., LTD. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED BY SENIOR FRONTEND ARCHITECTS</span>
        </div>
      </div>
    </footer>
  );
};

const SendIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M22.268.043a1.5 1.5 0 00-1.464-.17L1.248 8.044a1.5 1.5 0 00-.077 2.766l5.735 2.55 3.014 6.786a1.5 1.5 0 002.664.215l3.208-4.812 4.908 3.506A1.5 1.5 0 0023 18.064L24 1.5a1.5 1.5 0 00-1.732-1.457zM8.026 12.016l10.973-6.86-8.232 8.231v4.354l-2.741-5.725z" />
  </svg>
);

export default Footer;
