import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Award, Sparkles, Tag, ArrowRight } from 'lucide-react';

const DUMMY_PROMOS = [
  { id: 1, title: 'MLBB Weekly Diamond Pass Special', tag: 'Mobile Legends', desc: 'Get weekly diamond passes at 20% discount. Extra bonus points applied instantly.', price: '$1.99', badge: 'Popular', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80', link: '/games/mobile-legends' },
  { id: 2, title: 'Free Fire Diamond Bundles Bonus', tag: 'Free Fire', desc: 'Receive up to 50 bonus diamonds on select packages. Promotion valid this week.', price: 'From $0.95', badge: 'Bonus', image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=600&auto=format&fit=crop&q=80', link: '/games/free-fire' },
  { id: 3, title: 'Steam Wallet Card Discount', tag: 'PC Games', desc: 'Buy Steam Wallet codes using ABA Pay and receive a direct discount.', price: 'Save 5%', badge: 'Promo', image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&auto=format&fit=crop&q=80', link: '/games/steam-wallet' }
];

const Promotions = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-2">
          <Sparkles className="text-purple-500" size={28} />
          {t('latest_promotions')}
        </h1>
        <p className="text-slate-500 text-sm">Save more on diamonds and passes with our curated list of active promotions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DUMMY_PROMOS.map((promo) => (
          <div
            key={promo.id}
            className="group relative flex flex-col bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-3xl overflow-hidden transition-smooth hover:shadow-2xl"
          >
            {/* Header image */}
            <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover transition-smooth group-hover:scale-103"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600/90 text-[10px] text-white font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                <Tag size={10} /> {promo.badge}
              </span>
            </div>

            {/* Info details */}
            <div className="p-6 flex flex-col flex-1 text-left justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-blue-500 font-bold text-xs uppercase tracking-wider">{promo.tag}</span>
                <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-smooth">
                  {promo.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">{promo.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-900 mt-auto">
                <span className="text-purple-400 font-extrabold text-base">{promo.price}</span>
                <Link
                  to={promo.link}
                  className="inline-flex items-center gap-1.5 text-xs text-white bg-slate-950 hover:bg-slate-900 px-4 py-2 border border-slate-850 rounded-xl font-bold transition-smooth"
                >
                  Grab Offer <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
