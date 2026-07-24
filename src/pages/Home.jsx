import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Flame,
  Award,
  ShieldCheck,
  Zap,
  ArrowRight,
  BookOpen,
  Layers,
  Gamepad,
  Star,
  Compass,
  Sparkles,
  TrendingUp,
  Cpu,
  Tv,
  Coins,
  ChevronDown,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { message } from 'antd';

const DUMMY_GAMES = [
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'MOBA', rating: 4.9, sold_count: '24K+', starting_price: 1.29, delivery_speed: 'Instant' },
  { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'MOBA', rating: 4.8, sold_count: '45K+', starting_price: 1.29, delivery_speed: 'Instant' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'Battle Royale', rating: 4.7, sold_count: '32K+', starting_price: 0.95, delivery_speed: 'Instant' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'Battle Royale', rating: 4.9, sold_count: '18K+', starting_price: 0.99, delivery_speed: 'Instant' },
  { id: 4, name_en: 'Honor of Kings', name_kh: 'អនណឺអហ្វឃីង', slug: 'honor-of-kings', logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 1, category_name: 'MOBA', rating: 4.8, sold_count: '12K+', starting_price: 0.99, delivery_speed: 'Instant' },
  { id: 6, name_en: 'Genshin Impact', name_kh: 'ហ្គិនស៊ីនអិមផេក', slug: 'genshin-impact', logo_url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'MMORPG', rating: 4.6, sold_count: '8K+', starting_price: 4.99, delivery_speed: 'Instant' },
  { id: 7, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 0, is_featured: 0, category_name: 'Entertainment', rating: 4.8, sold_count: '15K+', starting_price: 9.99, delivery_speed: 'Instant' },
  { id: 8, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 1, category_name: 'FPS', rating: 4.9, sold_count: '20K+', starting_price: 4.75, delivery_speed: 'Instant' },
  { id: 9, name_en: 'Steam Wallet', name_kh: 'ស្ទីមកាត', slug: 'steam-wallet', logo_url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=300&auto=format&fit=crop&q=80', banner_url: '', is_popular: 1, is_featured: 0, category_name: 'Gift Cards', rating: 4.9, sold_count: '14K+', starting_price: 5.00, delivery_speed: 'Instant' }
];

const DUMMY_BANNERS = [
  { id: 1, title_en: 'Weekly Diamond Pass Special Offer', title_kh: 'ប្រូម៉ូសិនពិសេសប្រចាំសប្តាហ៍ សំបុត្រពេជ្រ', image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80', link_url: '/games/mobile-legends' },
  { id: 2, title_en: 'Valorant Points - Fast Delivery', title_kh: 'បញ្ចូលវ៉ាឡូរែនភ័ន សុវត្ថិភាព និងលឿនរហ័ស', image_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80', link_url: '/games/valorant' }
];

const DUMMY_NEWS = [
  { id: 1, title_en: 'How to buy Weekly Diamond Pass in MLBB', title_kh: 'របៀបទិញសំបុត្រពេជ្រប្រចាំសប្តាហ៍ក្នុងហ្គេម MLBB', views: 1240, thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80', created_at: '2026-07-10' },
  { id: 2, title_en: 'Top 5 Popular Games in Cambodia 2026', title_kh: 'ហ្គេមល្បីៗទាំង ៥ ដែលពេញនិយមបំផុតនៅកម្ពុជាឆ្នាំ ២០២៦', views: 3450, thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80', created_at: '2026-07-12' }
];

const REVIEWS = [
  { id: 1, name: 'Sok Mean', game: 'Mobile Legends', rating: 5, text_en: 'Weekly Diamond Pass is very cheap and credited instantly! Recommended!', text_kh: 'កញ្ចប់សំបុត្រពេជ្រប្រចាំសប្តាហ៍ថោកសមរម្យ ហើយលុយចូលភ្លាមៗ! ពិតជាល្អណាស់!' },
  { id: 2, name: 'Dara Roth', game: 'Free Fire', rating: 5, text_en: 'Easiest checkout ever with Bakong KHQR! Highly secure.', text_kh: 'ការទូទាត់លឿនបំផុតជាមួយ បាគង KHQR! សុវត្ថិភាពខ្ពស់។' },
  { id: 3, name: 'Piseth Ken', game: 'Valorant', rating: 4, text_en: 'Sync catalog is always updated, cheaper than official store.', text_kh: 'កាតាឡុកហ្គេមត្រូវគ្នាជានិច្ច តម្លៃធូរថ្លៃជាងហាងផ្លូវការ។' }
];

const FAQS = [
  { id: 1, q_en: 'How long does it take for top-up to deliver?', q_kh: 'តើការបញ្ចូលលុយប្រើប្រាស់រយៈពេលប៉ុន្មានទើបបាន?', a_en: 'Almost all top-ups are processed instantly. For MLBB and Free Fire, diamonds are added to your account within 1 to 2 minutes of payment verification.', a_kh: 'ការបញ្ចូលលុយភាគច្រើនត្រូវបានដំណើរការភ្លាមៗ។ សម្រាប់ MLBB និង Free Fire ពេជ្រនឹងចូលទៅក្នុងគណនីរបស់អ្នកក្នុងរយៈពេល ១ ទៅ ២ នាទីបន្ទាប់ពីការផ្ទៀងផ្ទាត់ការបង់ប្រាក់។' },
  { id: 2, q_en: 'What payment methods do you accept?', q_kh: 'តើអ្នកទទួលយកវិធីទូទាត់ប្រាក់អ្វីខ្លះ?', a_en: 'We support Bakong KHQR dynamic payments (auto-verified), ABA Pay transfers, and Wing Wallet transactions.', a_kh: 'យើងខ្ញុំគាំទ្រការទូទាត់តាមរយៈ បាគង KHQR (ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្ត) ផ្ទេរប្រាក់តាម ABA Pay និងកាបូបលុយ Wing។' },
  { id: 3, q_en: 'Can I top up as a guest?', q_kh: 'តើខ្ញុំអាចបញ្ចូលលុយដោយមិនបាច់ចុះឈ្មោះបានទេ?', a_en: 'Yes! Guest checkout is fully supported. You just need to verify your Player ID, checkout, and save your Order ID reference to track progress.', a_kh: 'បាន! ការទូទាត់ប្រាក់ជាភ្ញៀវត្រូវបានគាំទ្រយ៉ាងពេញលេញ។ អ្នកគ្រាន់តែផ្ទៀងផ្ទាត់ Player ID បង់ប្រាក់ រួចរក្សាទុកលេខបញ្ជាទិញដើម្បីតាមដានស្ថានភាព។' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const Home = () => {
  const { language, t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [games, setGames] = useState(DUMMY_GAMES);
  const [banners, setBanners] = useState(DUMMY_BANNERS);
  const [news, setNews] = useState(DUMMY_NEWS);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState(null);

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const loadStorefrontData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/home');
        if (res.data?.success && res.data.data) {
          const { games: apiGames, banners: apiBanners, news: apiNews } = res.data.data;
          
          const normalizedGames = (apiGames || DUMMY_GAMES).map((g) => ({
            ...g,
            rating: g.rating || 4.8,
            sold_count: g.sold_count || `${Math.floor(Math.random() * 20) + 10}K+`,
            starting_price: g.starting_price || (g.packages?.[0]?.price_usd || 0.99),
            delivery_speed: 'Instant'
          }));

          if (normalizedGames.length > 0) setGames(normalizedGames);
          if (apiBanners && apiBanners.length > 0) setBanners(apiBanners);
          if (apiNews && apiNews.length > 0) setNews(apiNews);
        }
      } catch (err) {
        console.warn('Could not fetch home page data, using local fallback data', err);
      } finally {
        setLoading(false);
      }
    };
    loadStorefrontData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  useEffect(() => {
    const clickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const categoryOptions = [
    { name: 'All', icon: <Layers size={14} /> },
    { name: 'MOBA', icon: <Gamepad size={14} /> },
    { name: 'Battle Royale', icon: <Compass size={14} /> },
    { name: 'FPS', icon: <Cpu size={14} /> },
    { name: 'MMORPG', icon: <TrendingUp size={14} /> },
    { name: 'Gift Cards', icon: <Coins size={14} /> },
    { name: 'Entertainment', icon: <Tv size={14} /> }
  ];

  const filteredGames = games.filter((game) => {
    const name = language === 'kh' ? (game.name_kh || game.name_en) : game.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const catName = game.category_name || (game.category ? game.category.name_en : 'MOBA');
    
    let normalizedCat = catName;
    if (catName === 'Mobile Games' || catName === 'Mobile') normalizedCat = 'MOBA';
    if (catName === 'PC & Console' || catName === 'PC') normalizedCat = 'FPS';

    const matchesCategory = selectedCategory === 'All' || normalizedCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const searchSuggestions = games.filter((game) => {
    const name = language === 'kh' ? (game.name_kh || game.name_en) : game.name_en;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 bg-[#050816] text-white min-h-screen text-left relative overflow-hidden"
    >
      {/* Background Floaters Ambient */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* Hero Banner Section */}
      <div className="relative w-full min-h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#050816] z-10">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.22] scale-105 transition-all duration-1000 z-0" style={{ backgroundImage: `url(${banners[activeBannerIdx]?.image_url})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/75 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-transparent to-[#050816]/80 z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full relative z-20 flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-2xl text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-650/15 border border-blue-500/25 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest">
              <Sparkles size={11} className="animate-spin" /> Top Tier Platform
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
              {language === 'kh' ? banners[activeBannerIdx]?.title_kh : banners[activeBannerIdx]?.title_en}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed max-w-lg">
              Redefining instant gaming transactions. Secure checkout with dynamic KHQR and auto API fulfillment loops.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to={banners[activeBannerIdx]?.link_url || '/games'}
                className="btn-premium px-8 h-12 text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-550/10 hover:shadow-blue-500/25 transition-smooth"
              >
                Explore Top-Up <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 lg:right-16 z-30 flex items-center gap-2 select-none">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBannerIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeBannerIdx ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3B82F6]' : 'w-2 bg-slate-600 hover:bg-slate-450'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16 relative z-10">
        

        {/* Filter controls & Unified autocomplete search */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full xl:w-auto">
            {categoryOptions.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-smooth cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#0B1023]/60 border-white/5 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Unified search autocomplete */}
          <div className="relative w-full xl:w-80" ref={searchContainerRef}>
            <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search games or gift cards..."
              value={searchQuery}
              onFocus={() => setShowSearchSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              className="w-full bg-[#0B1023]/60 border border-white/8 rounded-xl pl-11 pr-4 h-12 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500/20"
            />
            <AnimatePresence>
              {showSearchSuggestions && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 top-14 bg-[#0B1023]/95 backdrop-blur-xl border border-white/8 rounded-2xl p-3.5 shadow-2xl z-50 space-y-1.5"
                >
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block border-b border-white/5 pb-1">
                    Matching Results
                  </span>
                  {searchSuggestions.length === 0 ? (
                    <p className="text-[11px] text-slate-450 p-2">No matching games found</p>
                  ) : (
                    searchSuggestions.map((game) => (
                      <Link
                        key={game.id}
                        to={`/games/${game.slug}`}
                        onClick={() => setShowSearchSuggestions(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent transition-smooth"
                      >
                        <img src={game.logo_url} alt={game.name_en} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs text-white font-bold">{language === 'kh' ? game.name_kh : game.name_en}</span>
                      </Link>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Premium Game Catalog Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-left">
            <Gamepad className="text-blue-500" size={20} />
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-display">Premium Featured Games</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-[#0B1023]/40 border border-white/5 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-white/5 rounded-xl"></div>
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20 bg-[#0B1023]/30 border border-white/5 rounded-2xl">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No catalog items match your parameters.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <Link
                    to={`/games/${game.slug}`}
                    className="group relative flex flex-col bg-[#0B1023]/55 hover:bg-[#151e43]/60 border border-white/8 hover:border-blue-500/30 rounded-2xl p-3.5 transition-all duration-300 text-left overflow-hidden shadow-lg shadow-black/30 hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-[#050816] select-none border border-white/5">
                      <img
                        src={game.logo_url}
                        alt={game.name_en}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-75 z-10" />

                      {game.is_popular === 1 && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[8px] font-black rounded-lg flex items-center gap-1 shadow-md shadow-red-950/20 uppercase tracking-widest z-20 border border-red-500/10">
                          <span className="h-1 w-1 rounded-full bg-white animate-ping"></span>
                          <Flame size={9} className="fill-current" /> Popular
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-550 text-[9px] font-black uppercase tracking-widest">
                          {game.category_name || 'MOBA'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-amber-500 fill-amber-500" />
                          <span className="text-white text-[9.5px] font-bold">4.8</span>
                        </div>
                      </div>
                      <h3 className="text-white font-extrabold text-xs md:text-sm line-clamp-1 group-hover:text-blue-400 transition-smooth">
                        {language === 'kh' ? (game.name_kh || game.name_en) : game.name_en}
                      </h3>
                      <div className="pt-1.5 flex items-center justify-between border-t border-white/5 mt-1.5 gap-2">
                        <div>
                          <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-wider">Starts From</p>
                          <p className="text-blue-400 font-extrabold text-xs md:text-sm mt-0.5">${parseFloat(game.starting_price || 1.29).toFixed(2)}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest shrink-0">
                          Instant
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>



      </div>
    </motion.div>
  );
};

export default Home;
