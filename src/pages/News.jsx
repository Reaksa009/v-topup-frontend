import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Calendar, Eye, ArrowRight } from 'lucide-react';

const DUMMY_BLOGS = [
  { id: 1, title: 'How to purchase Weekly Diamond Pass in MLBB securely', date: 'July 14, 2026', views: 1820, category: 'Tutorial', desc: 'Step-by-step instructions on top-up methods, using Bakong KHQR for instant validation and activation of diamond bonuses.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Honor of Kings Global launch guides and items prices', date: 'July 11, 2026', views: 2450, category: 'Guides', desc: 'Everything you need to know about the latest hero releases, points packages pricing details, and global server details.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Top PC Games supported on steam platform 2026', date: 'July 09, 2026', views: 980, category: 'News', desc: 'Review of summer discount offers on Steam wallet gift cards and playstation vouchers. Buy codes instantly.', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80' }
];

const News = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-2">
          <BookOpen className="text-blue-500" size={28} />
          {t('latest_news')}
        </h1>
        <p className="text-slate-500 text-sm">Read the latest gaming tutorials, top-up guides, and platform updates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DUMMY_BLOGS.map((blog) => (
          <div
            key={blog.id}
            className="group flex flex-col bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-3xl overflow-hidden transition-smooth hover:shadow-xl"
          >
            {/* Thumbnail */}
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-smooth group-hover:scale-103"
              />
              <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-blue-600/90 text-[10px] text-white font-bold rounded-md uppercase tracking-wider">
                {blog.category}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {blog.views} views</span>
                </div>
                <h3 className="text-white font-bold text-sm leading-snug group-hover:text-blue-400 transition-smooth">
                  {blog.title}
                </h3>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{blog.desc}</p>
              </div>

              <button className="flex items-center gap-1 text-[11px] text-blue-500 font-bold hover:text-blue-400 transition-smooth pt-3 border-t border-slate-900 mt-auto">
                Read Article <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
