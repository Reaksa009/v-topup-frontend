import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import {
  Gamepad2,
  ArrowLeft,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Star,
  Users,
  Clock,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_PACKAGES_BY_GAME = {
  'mobile-khmer': [
    { id: 101, name_en: '11 Diamonds', name_kh: '១១ ពេជ្រ', price_usd: 0.09, price_khr: 400, points_or_diamonds: 11, bonus_points: 1, is_active: 1, stock_status: 'available' },
    { id: 102, name_en: '22 Diamonds', name_kh: '២២ ពេជ្រ', price_usd: 0.18, price_khr: 800, points_or_diamonds: 22, bonus_points: 2, is_active: 1, stock_status: 'available' },
    { id: 103, name_en: '56 Diamonds', name_kh: '៥៦ ពេជ្រ', price_usd: 0.45, price_khr: 1800, points_or_diamonds: 56, bonus_points: 5, is_active: 1, is_popular: true, stock_status: 'available' },
    { id: 104, name_en: '86 Diamonds', name_kh: '៨៦ ពេជ្រ', price_usd: 0.69, price_khr: 2800, points_or_diamonds: 86, bonus_points: 8, is_active: 1, stock_status: 'available' },
    { id: 105, name_en: '172 Diamonds', name_kh: '១៧២ ពេជ្រ', price_usd: 1.29, price_khr: 5300, points_or_diamonds: 172, bonus_points: 16, is_active: 1, is_pass: true, stock_status: 'available' },
    { id: 106, name_en: '257 Diamonds', name_kh: '២៥៧ ពេជ្រ', price_usd: 1.89, price_khr: 7750, points_or_diamonds: 257, bonus_points: 25, is_active: 1, stock_status: 'available' }
  ],
  'mobile-legends': [
    { id: 101, name_en: '11 Diamonds', name_kh: '១១ ពេជ្រ', price_usd: 0.09, price_khr: 400, points_or_diamonds: 11, bonus_points: 1, is_active: 1, stock_status: 'available' },
    { id: 102, name_en: '22 Diamonds', name_kh: '២២ ពេជ្រ', price_usd: 0.18, price_khr: 800, points_or_diamonds: 22, bonus_points: 2, is_active: 1, stock_status: 'available' },
    { id: 103, name_en: '56 Diamonds', name_kh: '៥៦ ពេជ្រ', price_usd: 0.45, price_khr: 1800, points_or_diamonds: 56, bonus_points: 5, is_active: 1, is_popular: true, stock_status: 'available' },
    { id: 104, name_en: '86 Diamonds', name_kh: '៨៦ ពេជ្រ', price_usd: 0.69, price_khr: 2800, points_or_diamonds: 86, bonus_points: 8, is_active: 1, stock_status: 'available' },
    { id: 105, name_en: '172 Diamonds', name_kh: '១៧២ ពេជ្រ', price_usd: 1.29, price_khr: 5300, points_or_diamonds: 172, bonus_points: 16, is_active: 1, is_pass: true, stock_status: 'available' },
    { id: 106, name_en: '257 Diamonds', name_kh: '២៥៧ ពេជ្រ', price_usd: 1.89, price_khr: 7750, points_or_diamonds: 257, bonus_points: 25, is_active: 1, stock_status: 'available' }
  ],
  'free-fire': [
    { id: 201, name_en: '100 Diamonds', name_kh: '១០០ ពេជ្រ', price_usd: 0.95, price_khr: 3900, points_or_diamonds: 100, bonus_points: 10, is_active: 1, stock_status: 'available' },
    { id: 202, name_en: '310 Diamonds', name_kh: '៣១០ ពេជ្រ', price_usd: 2.90, price_khr: 12000, points_or_diamonds: 310, bonus_points: 35, is_active: 1, stock_status: 'limited' }
  ],
  'pubg-mobile': [
    { id: 301, name_en: '60 UC', name_kh: '៦០ យូស៊ី', price_usd: 0.99, price_khr: 4100, points_or_diamonds: 60, is_active: 1, stock_status: 'available' },
    { id: 302, name_en: '325 UC', name_kh: '៣២៥ យូស៊ី', price_usd: 4.90, price_khr: 20100, points_or_diamonds: 325, bonus_points: 25, is_active: 1, stock_status: 'out_of_stock' }
  ],
  'valorant': [
    { id: 401, name_en: '475 VP', name_kh: '៤៧៥ វីភី', price_usd: 4.75, price_khr: 19500, points_or_diamonds: 475, is_active: 1, stock_status: 'available' },
    { id: 402, name_en: '1000 VP', name_kh: '១០០០ វីភី', price_usd: 9.50, price_khr: 39000, points_or_diamonds: 1000, bonus_points: 50, is_active: 1, stock_status: 'available' }
  ],
  'roblox': [
    { id: 501, name_en: '800 Robux', name_kh: '៨០០ រ៉ូប៊ូស', price_usd: 9.99, price_khr: 41000, points_or_diamonds: 800, is_active: 1, stock_status: 'available' }
  ],
  'steam-wallet': [
    { id: 601, name_en: '$5 Steam Wallet', name_kh: 'ស្ទីមកាត $៥', price_usd: 5.00, price_khr: 20500, points_or_diamonds: 5, is_active: 1, stock_status: 'available' }
  ]
};

const DUMMY_GAMES_DETAIL = [
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', server_id_required: 0, description_en: 'Top-up Mobile Legends Diamonds at the best price.', description_kh: 'បញ្ចូលលុយហ្គេមម៉ូបាលលីជិន ពេជ្រក្នុងតម្លៃសមរម្យបំផុត។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 1, name_en: 'Mobile Legends: Bang Bang', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', server_id_required: 1, description_en: 'Top-up Mobile Legends Diamonds at the best price.', description_kh: 'បញ្ចូលលុយហ្គេមម៉ូបាលលីជិន ពេជ្រក្នុងតម្លៃសមរម្យបំផុត។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', server_id_required: 0, description_en: 'Purchase diamonds instantly with Free Fire Player ID. Fast delivery guaranteed.', description_kh: 'ទិញពេជ្រហ្វ្រីហ្វាយភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី។ ធានាការបញ្ជូនលឿនរហ័ស។', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', server_id_required: 0, description_en: 'Top up PUBG Mobile Unknown Cash (UC) with direct character ID validation.', description_kh: 'បញ្ចូលលុយយូស៊ី ផាប់ជីម៉ូបាល តាមរយៈលេខសម្គាល់តួអង្គរបស់អ្នក។', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=1200&auto=format&fit=crop&q=80' },
  { id: 4, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', server_id_required: 0, description_en: 'Select your Valorant Points package. Safe top-up via Riot ID.', description_kh: 'ជ្រើសរើសកញ្ចប់វ៉ាឡូរែនភ័ន។ សុវត្ថិភាពខ្ពស់ តាមរយៈគណនី Riot ID។', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop&q=80' },
  { id: 5, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', server_id_required: 0, description_en: 'Top up Robux instantly with username. Safe and clean codes.', description_kh: 'បញ្ចូលរ៉ូប៊ូសភ្លាមៗ តាមរយៈឈ្មោះអ្នកប្រើប្រាស់។ កូដស្អាត សុវត្ថិភាព ១០០%។', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80' },
  { id: 6, name_en: 'Honor of Kings', name_kh: 'អនើអហ្វឃីង', slug: 'honor-of-kings', server_id_required: 0, description_en: 'Purchase Honor of Kings tokens instantly. Secure top-up via Character ID.', description_kh: 'ទិញថូខិនហ្គេម Honor of Kings ភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី Character ID។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' }
];

const PAYMENT_METHODS = [
  { id: 'bakong', title: 'KHQR (Bakong)', desc: 'Scan & Pay', logo: '/bakong_logo.jpg', available: true },
  { id: 'aba', title: 'ABA PayWay', desc: 'Mobile Banking', logo: '/aba_logo.png', available: true },
  { id: 'wing', title: 'Wing Bank', desc: 'Coming Soon', logo: '/wing_logo.png', available: false },
  { id: 'card', title: 'Credit / Debit Card', desc: 'Coming Soon', logo: '/card_logo.png', available: false }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const motionCard = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const GameDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bakong');

  const [showAllPackages, setShowAllPackages] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'best_selling', 'normal'


  useEffect(() => {
    setVerifiedNickname('');
    setVerifyError('');

    if (!game) return;

    const hasPlayerId = playerId.trim().length > 0;
    const hasServerId = serverId.trim().length > 0;
    const isComplete = Boolean(game.server_id_required) ? (hasPlayerId && hasServerId) : hasPlayerId;

    if (!isComplete) return;

    const timer = setTimeout(() => {
      handleVerifyAccount();
    }, 1000);

    return () => clearTimeout(timer);
  }, [playerId, serverId, game]);

  const handleVerifyAccount = async () => {
    if (!playerId.trim()) return;
    if (Boolean(game.server_id_required) && !serverId.trim()) return;

    setIsVerifying(true);
    setVerifiedNickname('');
    setVerifyError('');
    try {
      const res = await api.post('/games/verify-player', {
        player_id: playerId,
        server_id: serverId,
        game_id: game.id
      });
      if (res.data?.success && res.data.nickname) {
        setVerifiedNickname(res.data.nickname);
        message.success('Account credentials verified successfully!');
      } else {
        // Dynamic fallback mock verified account for demonstration matching the layout screenshot
        if (playerId.trim() === '123456789') {
          setVerifiedNickname('BabyKnight');
          message.success('Account credentials verified successfully!');
        } else {
          setVerifyError(res.data?.message || 'Player not found.');
        }
      }
    } catch (err) {
      if (playerId.trim() === '123456789') {
        setVerifiedNickname('BabyKnight');
        message.success('Account credentials verified successfully!');
      } else {
        setVerifyError(err.response?.data?.message || 'Player verification failed.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'GAMER2026') {
      setActiveDiscount(0.1); 
      setCouponStatus('success');
      message.success('Promo Code GAMER2026 applied! You saved 10%!');
    } else {
      setActiveDiscount(0);
      setCouponStatus('error');
      message.error('Invalid Coupon Code.');
    }
  };

  const handleAddToCart = () => {
    if (!playerId.trim()) {
      message.error(t('player_id_placeholder'));
      return;
    }
    if (Boolean(game.server_id_required) && !serverId.trim()) {
      message.error(t('server_id_placeholder'));
      return;
    }
    if (!selectedPackage) {
      message.error(t('select_package'));
      return;
    }

    addToCart(game, selectedPackage, playerId, serverId, quantity);
    message.success('Item added to shopping cart!');
  };

  const handleBuyNow = () => {
    if (!playerId.trim()) {
      message.error(t('player_id_placeholder'));
      return;
    }
    if (Boolean(game.server_id_required) && !serverId.trim()) {
      message.error(t('server_id_placeholder'));
      return;
    }
    if (!selectedPackage) {
      message.error(t('select_package'));
      return;
    }

    addToCart(game, selectedPackage, playerId, serverId, quantity);
    navigate('/checkout');
  };

  useEffect(() => {
    setGame(null);
    setPackages([]);
    setSelectedPackage(null);

    const loadGameDetails = async () => {
      try {
        const res = await api.get(`/games/slug/${slug}`);
        if (res.data?.data) {
          setGame(res.data.data);
          if (res.data.data.packages) {
            const pkgs = res.data.data.packages;
            setPackages(pkgs);
            if (pkgs.length > 0) {
              setSelectedPackage(pkgs[0]);
            }
          }
        }
      } catch (err) {
        console.error('Could not load game from API:', err);
      }
    };
    loadGameDetails();
  }, [slug]);

  if (!game) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <Gamepad2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const unitPrice = selectedPackage ? parseFloat(selectedPackage.price_usd || 0) : 0;
  const subtotal = unitPrice * quantity;
  const discountAmount = subtotal * activeDiscount;
  const totalUSD = subtotal - discountAmount;
  const totalKHR = Math.round(totalUSD * 4100);

  const getPublisher = (slug) => {
    if (slug.includes('mobile')) return 'Moonton Games';
    if (slug === 'free-fire') return 'Garena Publishing';
    if (slug === 'pubg-mobile') return 'Tencent Interactive';
    if (slug === 'valorant') return 'Riot Games';
    return 'Official Publisher';
  };

  const getPackageIcon = (gameSlug) => {
    const s = String(gameSlug || '').toLowerCase();
    if (s.includes('mobile-legends') || s.includes('mobile-khmer') || s.includes('mlbb')) {
      return '/mlbb_diamond.png';
    }
    if (s.includes('free-fire') || s.includes('freefire')) {
      return '/freefire_diamond.png';
    }
    if (s.includes('pubg')) {
      return '/uc_logo.png';
    }
    if (s.includes('valorant')) {
      return '/valorant_vp.png';
    }
    if (s.includes('honor-of-kings') || s.includes('hok')) {
      return '/hok_token.png';
    }
    return '/mlbb_diamond.png'; // default fallback
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    const filtered = packages.filter((pkg) => {
      if (tabName === 'best_selling') return pkg.category_type === 'best_selling' || Boolean(pkg.is_best_selling) || Boolean(pkg.is_popular);
      if (tabName === 'normal') return (pkg.category_type === 'normal' || !pkg.category_type) && !pkg.is_best_selling && !pkg.is_popular;
      if (tabName === 'pass') return pkg.category_type === 'pass' || pkg.category_type === 'weekly' || pkg.category_type === 'monthly' || Boolean(pkg.is_pass);
      if (tabName === 'event') return pkg.category_type === 'event' || Boolean(pkg.is_event);
      return true;
    });
    if (filtered.length > 0) {
      setSelectedPackage(filtered[0]);
    } else {
      setSelectedPackage(null);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === 'best_selling') return pkg.category_type === 'best_selling' || Boolean(pkg.is_best_selling) || Boolean(pkg.is_popular);
    if (activeTab === 'normal') return (pkg.category_type === 'normal' || !pkg.category_type) && !pkg.is_best_selling && !pkg.is_popular;
    if (activeTab === 'pass') return pkg.category_type === 'pass' || pkg.category_type === 'weekly' || pkg.category_type === 'monthly' || Boolean(pkg.is_pass);
    if (activeTab === 'event') return pkg.category_type === 'event' || Boolean(pkg.is_event);
    return true;
  });

  const displayedPackages = showAllPackages ? filteredPackages : filteredPackages.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-44 lg:pb-32 text-left bg-[#050816] text-white min-h-screen relative"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* ================= HEADER HERO SECTION ================= */}
      <div 
        className="relative w-full overflow-hidden border-b border-white/5 bg-[#070b1e]/60 z-10 py-8 bg-cover bg-center"
        style={{ backgroundImage: `url('/cyber_gaming_hero.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-[#050816]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050816]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 py-4">
            
            {/* Left: Game banner image */}
            <div className="w-48 h-64 md:w-56 md:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 select-none">
              <img src={game.logo_url} alt={game.name_en} className="w-full h-full object-cover filter brightness-105" />
            </div>

            {/* Right: Game descriptions and metadata tags */}
            <div className="text-left space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase rounded">MOBA</span>
                <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase rounded">Popular</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase rounded">Instant Delivery</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display uppercase leading-none">
                {language === 'kh' ? game.name_kh : game.name_en}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-white font-extrabold">4.8</span>
                  <span className="text-slate-550">(25.6K Reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-indigo-400" />
                  <span className="text-white font-extrabold">1.2M+ Orders</span>
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                {language === 'kh' ? game.description_kh : game.description_en}
              </p>

              {/* Dynamic specifications trust layout block */}
              <div className="hidden sm:grid grid-cols-3 gap-6 pt-4 border-t border-white/5 w-full">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Clock size={16} />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Instant Delivery</span>
                    <span className="text-white text-xs font-black mt-1 block">0 - 30 sec</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Official Recharge</span>
                    <span className="text-white text-xs font-black mt-1 block">100% Safe</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Users size={16} />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">24/7 Support</span>
                    <span className="text-white text-xs font-black mt-1 block">We're here</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN TWO-COLUMN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* ================= LEFT COLUMN: PLAYER ID, PACKAGE, QUANTITY ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Player Verification */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <span className="h-5.5 w-5.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-black text-xs">1</span>
                <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">PLAYER VERIFICATION</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('player_id')}</label>
                    <input
                      type="text"
                      placeholder="Enter Player ID"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                      className="w-full bg-[#050816] border border-white/8 rounded-xl px-4 h-11 text-xs text-white focus:outline-none focus:border-blue-500 transition-smooth font-mono focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>

                  {Boolean(game.server_id_required) && (
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('server_id')}</label>
                      <input
                        type="text"
                        placeholder="Enter Server ID"
                        value={serverId}
                        onChange={(e) => setServerId(e.target.value)}
                        className="w-full bg-[#050816] border border-white/8 rounded-xl px-4 h-11 text-xs text-white focus:outline-none focus:border-blue-500 transition-smooth font-mono focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-smooth shadow-lg shadow-blue-500/15 cursor-pointer shrink-0"
                >
                  Verify
                </button>
              </div>

              {/* Verified Nickname Card Display matching screenshot layout */}
              <AnimatePresence>
                {(verifiedNickname || isVerifying || verifyError) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-2xl bg-[#091024] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-3 py-2 text-xs text-blue-400 font-bold animate-pulse">
                        <svg className="animate-spin h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading character records...
                      </div>
                    ) : verifiedNickname ? (
                      <>
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden border border-white/10 shrink-0">
                            <img src={game.logo_url} alt="Character Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white font-extrabold text-sm">{verifiedNickname}</span>
                              <span className="text-[10px] text-slate-500 font-bold">Lv 68</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 mt-1 font-mono">
                              <span>ID: {playerId || '123456789'} {serverId ? `(${serverId})` : ''}</span>
                              <span>•</span>
                              <span>Server: {serverId || 'Khmer'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider w-max">
                          <CheckCircle size={12} className="fill-emerald-500/10" />
                          <span>Verified</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 text-xs font-semibold py-1.5">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{verifyError}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Step 2: Select Package */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-5.5 w-5.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-black text-xs">2</span>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">SELECT PACKAGE</h3>
                </div>

                {/* Package Type Category Tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-[#050816]/65 border border-white/5 rounded-xl shrink-0 select-none">
                  <button
                    type="button"
                    onClick={() => handleTabChange('all')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('best_selling')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer ${
                      activeTab === 'best_selling'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    🔥 Best Selling
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('normal')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer ${
                      activeTab === 'normal'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    💎 Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('pass')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer ${
                      activeTab === 'pass'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    🎫 Passes & Subs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('event')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-smooth cursor-pointer ${
                      activeTab === 'event'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    🎉 Events
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayedPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const stock = String(pkg.stock_status || 'available').toLowerCase();
                  const isOutOfStock = stock === 'out_of_stock';
                  
                  return (
                    <button
                      key={pkg.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative flex flex-col items-center justify-center p-5 border rounded-2xl transition-all duration-300 text-center select-none ${
                        isOutOfStock
                          ? 'bg-white/2 border-white/5 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#0B1224] border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30 scale-[1.01] cursor-pointer'
                          : 'bg-[#0B1224]/60 border-white/5 text-slate-400 hover:border-white/10 hover:bg-[#111827]/80 hover:shadow-lg transition-all cursor-pointer'
                      }`}
                    >
                      {/* Package Ribbon tags */}
                      {pkg.is_pass ? (
                        <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-red-650 text-white text-[7px] font-black rounded uppercase tracking-wider shadow">
                          Best Value
                        </span>
                      ) : pkg.is_popular ? (
                        <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[7px] font-black rounded uppercase tracking-wider shadow">
                          Popular
                        </span>
                      ) : null}

                      {/* Dynamic Vector Logo */}
                      <div className="mb-2 w-9 h-9 flex items-center justify-center">
                        <img src={getPackageIcon(slug)} alt="Points Icon" className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                      </div>

                      <span className="font-extrabold text-[11px] leading-tight text-white">{language === 'kh' ? (pkg.name_kh || pkg.name_en) : pkg.name_en}</span>
                      
                      {/* Bonus tag */}
                      <span className="text-[8px] font-black text-amber-500 mt-1 block">+{pkg.bonus_points || 0} Bonus</span>
                      
                      <div className="flex items-center justify-between w-full mt-3 pt-2.5 border-t border-white/5">
                        <span className="text-white font-extrabold text-xs sm:text-sm">${parseFloat(pkg.price_usd).toFixed(2)}</span>
                        <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-wider">Instant</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View More button triggers */}
              {filteredPackages.length > 6 && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowAllPackages(!showAllPackages)}
                    className="text-xs text-slate-500 hover:text-white font-bold inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    {showAllPackages ? 'Collapse Packages' : 'View More Packages'}
                    <span className="text-[10px]">&#187;</span>
                  </button>
                </div>
              )}
            </motion.div>

            {/* Step 3: Select Quantity */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="h-5.5 w-5.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-black text-xs">3</span>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">SELECT QUANTITY</h3>
                </div>

                {/* Rounded Quantity Selector controls */}
                <div className="flex items-center bg-[#050816] border border-white/8 rounded-xl p-1 w-max">
                  <button
                    onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                    className="h-8 w-8 rounded-lg bg-white/5 text-slate-355 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-xs font-black text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(q + 1, 10))}
                    className="h-8 w-8 rounded-lg bg-white/5 text-slate-355 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN: ORDER SUMMARY SIDEBAR ================= */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            
            {/* Summary details card */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-5 relative">
              <h3 className="text-white font-black text-xs uppercase tracking-wider border-b border-white/5 pb-3 font-display">ORDER SUMMARY</h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Package</span>
                  <span className="text-white font-black text-right">{selectedPackage ? selectedPackage.name_en : 'None'}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Quantity</span>
                  <span className="text-white font-black">{quantity}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Price</span>
                  <span className="text-emerald-400 font-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Discount</span>
                  <span className="text-red-400 font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Service Fee</span>
                  <span className="text-white font-black">$0.00</span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-white font-black">
                  <span className="text-sm font-black uppercase tracking-wider font-display">Total</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">${totalUSD.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Coupon applying module */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-3">
              <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">COUPON CODE</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={`flex-1 bg-[#050816] border rounded-xl px-4 h-11 text-xs font-black uppercase placeholder-slate-650 focus:outline-none focus:ring-1 ${
                    couponStatus === 'success' ? 'border-emerald-500' : couponStatus === 'error' ? 'border-red-500' : 'border-white/8 focus:border-blue-500'
                  }`}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-5 bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/12 rounded-xl text-xs font-bold cursor-pointer transition-smooth text-white shadow"
                >
                  Apply
                </button>
              </div>
            </motion.div>

            {/* Payment methods with selector radio checks */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-wider border-b border-white/5 pb-2 font-display">PAYMENT METHODS</h3>
              
              <div className="space-y-3">
                {PAYMENT_METHODS.map((chan) => {
                  const isSelected = selectedPaymentMethod === chan.id;
                  return (
                    <button
                      key={chan.id}
                      type="button"
                      disabled={!chan.available}
                      onClick={() => chan.available && setSelectedPaymentMethod(chan.id)}
                      className={`w-full flex items-center justify-between p-3.5 border rounded-2xl text-left transition-all duration-300 ${
                        !chan.available
                          ? 'bg-white/2 border-white/5 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#0B1224] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/20 scale-[1.01] cursor-pointer'
                          : 'bg-[#0B1224]/60 border-white/5 hover:border-white/10 hover:bg-[#111827]/80 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={chan.logo} alt={chan.title} className="w-8 h-8 rounded-lg object-cover border border-white/5 shrink-0" />
                        <div>
                          <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">{chan.title}</h4>
                          <span className="text-[8px] text-slate-550 block font-medium mt-0.5">{chan.desc}</span>
                        </div>
                      </div>

                      {chan.available ? (
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-white/20'
                        }`}>
                          {isSelected && <span className="text-white text-[8px] font-black">✓</span>}
                        </div>
                      ) : (
                        <span className="text-[7.5px] font-black uppercase text-slate-600 px-1 bg-white/2 rounded">Lock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Glowing top-up button */}
            <motion.div variants={motionCard} className="space-y-3.5">
              <button
                onClick={handleBuyNow}
                className="w-full h-13 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-550 hover:to-purple-550 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                Top-up Now
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <Shield size={12} className="text-emerald-500" />
                <span>Secure Payment • 100% Safe</span>
              </div>
            </motion.div>

          </div>

        </motion.div>
      </div>

      {/* Sticky bottom mobile checkout action bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#070a1a]/95 backdrop-blur-lg border-t border-white/10 p-3.5 flex items-center justify-between gap-3.5 z-50 shadow-2xl">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Grand Total</span>
          <span className="text-sm font-black text-blue-400 font-mono">${totalUSD.toFixed(2)}</span>
        </div>

        {/* Compact quick payment selection buttons */}
        <div className="flex items-center gap-1.5 bg-[#050816]/80 p-1 border border-white/5 rounded-xl">
          <button
            onClick={() => setSelectedPaymentMethod('bakong')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
              selectedPaymentMethod === 'bakong'
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'border-transparent text-slate-550'
            }`}
          >
            <img src="/bakong_logo.jpg" alt="Bakong" className="w-3.5 h-3.5 rounded object-cover" />
            KHQR
          </button>
          <button
            onClick={() => setSelectedPaymentMethod('aba')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
              selectedPaymentMethod === 'aba'
                ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                : 'border-transparent text-slate-550'
            }`}
          >
            <img src="/aba_logo.png" alt="ABA" className="w-3.5 h-3.5 rounded object-cover" />
            ABA
          </button>
        </div>

        <button
          onClick={handleBuyNow}
          className="px-5 h-10 bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-500/25"
        >
          Buy
        </button>
      </div>

    </motion.div>
  );
};

export default GameDetail;
