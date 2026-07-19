import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Search, Flame, Gamepad } from 'lucide-react';

const DUMMY_GAMES = [
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Mobile' },
  { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Mobile' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Mobile' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Mobile' },
  { id: 4, name_en: 'Honor of Kings', name_kh: 'អនណឺអហ្វឃីង', slug: 'honor-of-kings', logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80', is_popular: 0, category_name: 'Mobile' },
  { id: 5, name_en: 'COD Mobile', name_kh: 'ស៊ីអូឌីម៉ូបាល', slug: 'cod-mobile', logo_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80', is_popular: 0, category_name: 'Mobile' },
  { id: 6, name_en: 'Genshin Impact', name_kh: 'ហ្គិនស៊ីនអិមផេក', slug: 'genshin-impact', logo_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Mobile' },
  { id: 7, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', is_popular: 0, category_name: 'PC & Console' },
  { id: 8, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'PC & Console' },
  { id: 9, name_en: 'Steam Wallet', name_kh: 'ស្ទីមកាត', slug: 'steam-wallet', logo_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80', is_popular: 1, category_name: 'Gift Cards' },
  { id: 10, name_en: 'PlayStation Card', name_kh: 'ផ្លេស្ដេសិនកាត', slug: 'playstation-gift-card', logo_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&auto=format&fit=crop&q=80', is_popular: 0, category_name: 'Gift Cards' },
];

const Games = () => {
  const { language, t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [games, setGames] = useState(DUMMY_GAMES);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const res = await api.get('/games/active');
        if (res.data?.data && res.data.data.length > 0) {
          setGames(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch active games from API, using default list', err);
      }
    };
    loadGames();
  }, []);

  const categories = ['All', 'Mobile Games', 'PC & Console', 'Gift Cards'];

  const filteredGames = games.filter((game) => {
    const name = language === 'kh' ? game.name_kh : game.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = game.category_name || (game.category ? game.category.name_en : 'Mobile Games');
    const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2 mb-2">
          <Gamepad className="text-blue-500" size={28} />
          {t('games')}
        </h1>
        <p className="text-slate-500 text-sm">Choose your favorite game and top up instantly within minutes.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-900">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap transition-smooth ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'All' ? t('all_categories') : (cat === 'Mobile Games' ? 'Mobile' : cat)}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-smooth"
          />
        </div>
      </div>

      {/* Grid List */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-850 rounded-3xl">
          <p className="text-slate-500 text-sm">{t('no_games_found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              to={`/games/${game.slug}`}
              className="group relative flex flex-col bg-slate-900/30 hover:bg-slate-900/70 border border-slate-850 hover:border-blue-500/30 rounded-2xl p-3 transition-all duration-300 text-left hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] overflow-hidden hover:-translate-y-1"
            >
              {/* Image container */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-950">
                <img
                  src={game.logo_url}
                  alt={game.name_en}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {/* Hover Play Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="p-3 bg-blue-600/90 text-white rounded-full scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                    <Gamepad size={16} className="fill-current" />
                  </div>
                </div>

                {/* Hot label */}
                {game.is_popular === 1 && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black rounded-lg flex items-center gap-1 shadow-md shadow-red-900/30 uppercase tracking-widest z-20 border border-red-500/10">
                    <span className="h-1 w-1 rounded-full bg-white animate-ping"></span>
                    <Flame size={10} className="fill-current" /> Hot
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="px-0.5">
                <h3 className="text-white font-bold text-xs md:text-sm line-clamp-1 group-hover:text-blue-400 transition-smooth">
                  {language === 'kh' ? game.name_kh : game.name_en}
                </h3>
                <div className="mt-1.5 flex">
                  <span className="text-slate-400 bg-slate-950/60 border border-slate-850/60 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                    {game.category_name || (game.category ? game.category.name_en : 'Mobile')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;
