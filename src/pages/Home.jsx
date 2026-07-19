import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Search, Flame, Award, ShieldCheck, Zap, ArrowRight, BookOpen, Layers, Gamepad } from 'lucide-react';

const DUMMY_GAMES = [
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'Mobile' },
  { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'Mobile' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'Mobile' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'Mobile' },
  { id: 4, name_en: 'Honor of Kings', name_kh: 'អនណឺអហ្វឃីង', slug: 'honor-of-kings', logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 1, category_name: 'Mobile' },
  { id: 5, name_en: 'COD Mobile', name_kh: 'ស៊ីអូឌីម៉ូបាល', slug: 'cod-mobile', logo_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 0, category_name: 'Mobile' },
  { id: 6, name_en: 'Genshin Impact', name_kh: 'ហ្គិនស៊ីនអិមផេក', slug: 'genshin-impact', logo_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'Mobile' },
  { id: 7, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 0, category_name: 'PC & Console' },
  { id: 8, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'PC & Console' },
  { id: 9, name_en: 'Steam Wallet', name_kh: 'ស្ទីមកាត', slug: 'steam-wallet', logo_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'Gift Cards' },
  { id: 10, name_en: 'PlayStation Card', name_kh: 'ផ្លេស្ដេសិនកាត', slug: 'playstation-gift-card', logo_url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 0, category_name: 'Gift Cards' },
];

const DUMMY_BANNERS = [
  { id: 1, title_en: 'Weekly Diamond Pass Special Offer', title_kh: 'ប្រូម៉ូសិនពិសេសប្រចាំសប្តាហ៍ សំបុត្រពេជ្រ', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80', link_url: '/games/mobile-legends' },
  { id: 2, title_en: 'Valorant Points - Fast Delivery', title_kh: 'បញ្ចូលវ៉ាឡូរែនភ័ន សុវត្ថិភាព និងលឿនរហ័ស', image_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80', link_url: '/games/valorant' },
];

const DUMMY_NEWS = [
  { id: 1, title_en: 'How to buy Weekly Diamond Pass in MLBB', title_kh: 'របៀបទិញសំបុត្រពេជ្រប្រចាំសប្តាហ៍ក្នុងហ្គេម MLBB', views: 1240, thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80', created_at: '2026-07-10' },
  { id: 2, title_en: 'Top 5 Popular Games in Cambodia 2026', title_kh: 'ហ្គេមល្បីៗទាំង ៥ ដែលពេញនិយមបំផុតនៅកម្ពុជាឆ្នាំ ២០២៦', views: 3450, thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80', created_at: '2026-07-12' },
];

const Home = () => {
  const { language, t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [games, setGames] = useState(DUMMY_GAMES);
  const [banners, setBanners] = useState(DUMMY_BANNERS);
  const [news, setNews] = useState(DUMMY_NEWS);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  useEffect(() => {
    // Attempt to load from API
    const loadStorefrontData = async () => {
      try {
        const gamesRes = await api.get('/games/active');
        if (gamesRes.data?.data && gamesRes.data.data.length > 0) {
          setGames(gamesRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch active games, using fallback data', err);
      }

      try {
        const bannersRes = await api.get('/banners/active');
        if (bannersRes.data?.success && Array.isArray(bannersRes.data.data)) {
          setBanners(bannersRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch active banners, using fallback data', err);
      }

      try {
        const newsRes = await api.get('/news/latest');
        if (newsRes.data?.data && newsRes.data.data.length > 0) {
          setNews(newsRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch latest news, using fallback data', err);
      }
    };
    loadStorefrontData();
  }, []);

  // Banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  // Categories extraction
  const categories = ['All', 'Mobile Games', 'PC & Console', 'Gift Cards'];

  // Filtering
  const filteredGames = games.filter((game) => {
    const name = language === 'kh' ? game.name_kh : game.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = game.category_name || (game.category ? game.category.name_en : 'Mobile Games');
    const matchesCategory = selectedCategory === 'All' || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularGames = games.filter((g) => g.is_popular);
  const featuredGames = games.filter((g) => g.is_featured);

  return (
    <div className="pb-16">
      {/* Hero Banner Slider */}
      {banners.length > 0 && (
        <div className="relative w-full h-[320px] md:h-[450px] overflow-hidden rounded-b-3xl shadow-2xl">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                idx === activeBannerIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter brightness-[0.4] scale-105"
                style={{ backgroundImage: `url(${banner.image_url})` }}
              ></div>
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent"></div>
              
              {/* Banner Content */}
              <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-semibold rounded-full w-max mb-3 uppercase tracking-wider">
                  <Flame size={12} className="fill-current" /> Hot Deal
                </span>
                <h1 className="text-2xl md:text-5xl font-black text-white max-w-2xl leading-tight mb-4 drop-shadow-lg">
                  {language === 'kh' ? banner.title_kh : banner.title_en}
                </h1>
                <Link
                  to={banner.link_url}
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold w-max transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                >
                  Top-Up Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeBannerIdx ? 'w-6 bg-blue-500' : 'w-2 bg-slate-600'
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Features bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 py-6 border-b border-slate-900">
          <div className="flex items-center gap-4 px-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded-2xl">
              <Zap size={24} className="fill-current" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Instant Delivery</h3>
              <p className="text-slate-500 text-xs mt-0.5">Top-up complete in 2 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 border border-purple-500/10 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Secure Payment</h3>
              <p className="text-slate-500 text-xs mt-0.5">Bakong KHQR and ABA integration</p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-2xl">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Best Rates</h3>
              <p className="text-slate-500 text-xs mt-0.5">Cheapest diamonds & monthly passes</p>
            </div>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
          {/* Categories select */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap transition-smooth ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' && <Layers size={14} />}
                {cat === 'All' ? t('all_categories') : (cat === 'Mobile Games' ? 'Mobile' : cat)}
              </button>
            ))}
          </div>

          {/* Search bar */}
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

        {/* Games Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-orange-500 fill-current" size={20} />
            <h2 className="text-xl md:text-2xl font-black text-white">{t('games')}</h2>
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 border border-slate-850 rounded-2xl">
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

        {/* Promotions and Guides Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Promotions section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="text-purple-500" size={20} />
              <h2 className="text-xl font-bold text-white">{t('latest_promotions')}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl hover:border-slate-800 transition-smooth group">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80"
                  alt="weekly"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex flex-col justify-center text-left">
                  <span className="text-blue-500 text-[10px] font-bold uppercase tracking-wider">Mobile Legends</span>
                  <h3 className="text-white font-bold text-sm mt-1 group-hover:text-blue-400 transition-smooth">
                    Weekly Diamond Pass - Bonus 20%
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Get 220 diamonds + 70 bonus diamonds at just $1.99</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl hover:border-slate-800 transition-smooth group">
                <img
                  src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=80"
                  alt="steam"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex flex-col justify-center text-left">
                  <span className="text-purple-500 text-[10px] font-bold uppercase tracking-wider">Gift Card</span>
                  <h3 className="text-white font-bold text-sm mt-1 group-hover:text-purple-400 transition-smooth">
                    Steam Wallet Codes Promo
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Direct discount on $10, $50 and $100 cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guides / News section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-blue-500" size={20} />
              <h2 className="text-xl font-bold text-white">{t('latest_news')}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to="/news"
                  className="flex gap-4 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl hover:border-slate-800 transition-smooth group"
                >
                  <img
                    src={item.thumbnail_url}
                    alt={item.title_en}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-col justify-center text-left">
                    <span className="text-slate-500 text-[10px]">{item.created_at} • {item.views} views</span>
                    <h3 className="text-white font-bold text-sm mt-1 group-hover:text-blue-400 transition-smooth line-clamp-1">
                      {language === 'kh' ? item.title_kh : item.title_en}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                      Full step by step walkthrough guidelines inside this article...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
