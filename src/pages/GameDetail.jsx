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
  Gem,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  Tag,
  Percent,
  Plus,
  Minus
} from 'lucide-react';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_PACKAGES_BY_GAME = {
  'mobile-khmer': [
    { id: 101, name_en: '86 Diamonds', name_kh: '៨៦ ពេជ្រ', price_usd: 1.29, price_khr: 5300, points_or_diamonds: 86, bonus_points: 0, is_active: 1, stock_status: 'available' },
    { id: 102, name_en: '250 Diamonds', name_kh: '២៥០ ពេជ្រ', price_usd: 4.80, price_khr: 19700, points_or_diamonds: 250, bonus_points: 25, is_active: 1, stock_status: 'available' },
    { id: 104, name_en: 'Weekly Diamond Pass', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍', price_usd: 1.48, price_khr: 6100, points_or_diamonds: 220, bonus_points: 70, is_active: 1, is_pass: true, stock_status: 'available' }
  ],
  'mobile-legends': [
    { id: 101, name_en: '86 Diamonds', name_kh: '៨៦ ពេជ្រ', price_usd: 1.29, price_khr: 5300, points_or_diamonds: 86, bonus_points: 0, is_active: 1, stock_status: 'available' },
    { id: 102, name_en: '250 Diamonds', name_kh: '២៥០ ពេជ្រ', price_usd: 4.80, price_khr: 19700, points_or_diamonds: 250, bonus_points: 25, is_active: 1, stock_status: 'available' },
    { id: 104, name_en: 'Weekly Diamond Pass', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍', price_usd: 1.48, price_khr: 6100, points_or_diamonds: 220, bonus_points: 70, is_active: 1, is_pass: true, stock_status: 'available' }
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
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', server_id_required: 0, description_en: 'Enter player ID to purchase diamonds or passes for Khmer Server. Delivery is processed within 1-5 minutes.', description_kh: 'បញ្ចូលលេខសម្គាល់អ្នកលេង ដើម្បីទិញពេជ្រ ឬសំបុត្រប្រចាំសប្តាហ៍សម្រាប់ Khmer Server។ ទំនិញនឹងបញ្ចូលក្នុងរយៈពេល ១ ទៅ ៥ នាទី។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', server_id_required: 1, description_en: 'Enter player ID and server ID to purchase diamonds or passes. Delivery is processed within 1-5 minutes.', description_kh: 'បញ្ចូលលេខសម្គាល់អ្នកលេង និងលេខម៉ាស៊ីនបម្រើ ដើម្បីទិញពេជ្រ ឬសំបុត្រប្រចាំសប្តាហ៍។ ទំនិញនឹងបញ្ចូលក្នុងរយៈពេល ១ ទៅ ៥ នាទី។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', server_id_required: 0, description_en: 'Purchase diamonds instantly with Free Fire Player ID. Fast delivery guaranteed.', description_kh: 'ទិញពេជ្រហ្វ្រីហ្វាយភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី។ ធានាការបញ្ជូនលឿនរហ័ស។', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', server_id_required: 0, description_en: 'Top up PUBG Mobile Unknown Cash (UC) with direct character ID validation.', description_kh: 'បញ្ចូលលុយយូស៊ី ផាប់ជីម៉ូបាល តាមរយៈលេខសម្គាល់តួអង្គរបស់អ្នក។', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=1200&auto=format&fit=crop&q=80' },
  { id: 4, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', server_id_required: 0, description_en: 'Select your Valorant Points package. Safe top-up via Riot ID.', description_kh: 'ជ្រើសរើសកញ្ចប់វ៉ាឡូរែនភ័ន។ សុវត្ថិភាពខ្ពស់ តាមរយៈគណនី Riot ID។', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop&q=80' },
  { id: 5, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', server_id_required: 0, description_en: 'Top up Robux instantly with username. Safe and clean codes.', description_kh: 'បញ្ចូលរ៉ូប៊ូសភ្លាមៗ តាមរយៈឈ្មោះអ្នកប្រើប្រាស់។ កូដស្អាត សុវត្ថិភាព ១០០%។', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80' },
  { id: 6, name_en: 'Honor of Kings', name_kh: 'អនើអហ្វឃីង', slug: 'honor-of-kings', server_id_required: 0, description_en: 'Purchase Honor of Kings tokens instantly. Secure top-up via Character ID.', description_kh: 'ទិញថូខិនហ្គេម Honor of Kings ភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី Character ID។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
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

  const [activeFaqIdx, setActiveFaqIdx] = useState(null);

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
        setVerifyError(res.data?.message || 'Player not found.');
      }
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Player verification failed.');
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
    const matchedGame = DUMMY_GAMES_DETAIL.find((g) => g.slug === slug);
    if (matchedGame) {
      setGame(matchedGame);
      setPackages(DUMMY_PACKAGES_BY_GAME[slug] || DUMMY_PACKAGES_BY_GAME['mobile-legends']);
    }

    const loadGameDetails = async () => {
      try {
        const res = await api.get(`/games/slug/${slug}`);
        if (res.data?.data) {
          setGame(res.data.data);
          if (res.data.data.packages) {
            setPackages(res.data.data.packages);
          }
        }
      } catch (err) {
        console.warn('Could not load game from API, using fallback details');
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

  const gameFaqs = [
    { q: 'How long does the top-up take to process?', a: 'All top-up transactions are pushed instantly via our automated API tunnels. It usually lands in your character wallet in 1-2 minutes.' },
    { q: 'Is this top-up safe for my account?', a: 'Yes, we only integrate with official game publishers (Moonton, Garena, Riot, Tencent). Your account remains 100% secure.' },
    { q: 'What happens if I type in the wrong ID?', a: 'Our system automatically verifies your Character Nickname before creating bank payment links. Double-check the verification nickname to prevent typos.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-32 text-left bg-[#050816] text-white min-h-screen relative"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full h-[220px] md:h-[320px] overflow-hidden border-b border-white/5 bg-[#050816] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.25] scale-102" style={{ backgroundImage: `url(${game.banner_url || game.logo_url})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 relative z-10 flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 text-slate-350 transition-smooth active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-blue-400 font-extrabold text-[10px] uppercase tracking-widest bg-blue-600/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">{getPublisher(game.slug)}</span>
            <h1 className="text-2xl md:text-5xl font-black mt-2 text-white leading-none">
              {language === 'kh' ? game.name_kh : game.name_en}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* LEFT COLUMN: GAME DETAILS & EXTRA SECTION */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Game Info Details Card */}
            <motion.div variants={motionCard} className="card-glass p-6 space-y-4">
              <div className="flex gap-4">
                <img src={game.logo_url} alt={game.name_en} className="w-16 h-16 rounded-2xl object-cover border border-white/5 shrink-0" />
                <div className="flex flex-col justify-center text-left">
                  <h3 className="font-extrabold text-base text-white">{language === 'kh' ? game.name_kh : game.name_en}</h3>
                  <p className="text-[10px] text-slate-550 font-semibold">{getPublisher(game.slug)}</p>
                </div>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">
                {language === 'kh' ? game.description_kh : game.description_en}
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-[11px] font-bold text-slate-400">
                <ShieldCheck className="text-emerald-500" size={16} />
                <span>100% Authorized official top-up</span>
              </div>
            </motion.div>

            {/* FAQs Accordion Block */}
            <motion.div variants={motionCard} className="card-glass p-6 space-y-4">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle size={15} className="text-blue-500" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {gameFaqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-2">
                    <button
                      onClick={() => setActiveFaqIdx(activeFaqIdx === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-350 hover:text-white py-1 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {activeFaqIdx === idx ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                    </button>
                    <AnimatePresence>
                      {activeFaqIdx === idx && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium"
                        >
                          {faq.a}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gamer Review Blocks */}
            <motion.div variants={motionCard} className="card-glass p-6 space-y-4">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={15} className="text-purple-500" /> Gamer Reviews
              </h3>
              <div className="space-y-4">
                <div className="bg-white/3 border border-white/5 rounded-xl p-3.5 space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs">Sokha Lim</span>
                    <div className="flex gap-0.5">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-450 font-medium">"Weekly Pass loaded instantly. Safest shop in Cambodia!"</p>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-xl p-3.5 space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs">Vannak S.</span>
                    <div className="flex gap-0.5">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <Star size={10} className="text-slate-600" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-450 font-medium">"Verification is very helpful to prevent sending to wrong IDs."</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE CHECKOUT & PACKAGE SELECT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Account Information */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">1</span>
                <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">Gamer Profile Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('player_id')}</label>
                  <input
                    type="text"
                    placeholder={t('player_id_placeholder')}
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth font-mono focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                {Boolean(game.server_id_required) && (
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('server_id')}</label>
                    <input
                      type="text"
                      placeholder={t('server_id_placeholder')}
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth font-mono focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>
                )}
              </div>

              {/* Account verify state card feedback */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  {isVerifying ? (
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-bold animate-pulse">
                      <svg className="animate-spin h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking user records...
                    </div>
                  ) : verifiedNickname ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-max">
                      <CheckCircle size={14} />
                      <span>Verified: {verifiedNickname}</span>
                    </div>
                  ) : verifyError ? (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-xl">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 font-medium">Provide player credentials to check active gamer nicknames.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white text-xs font-bold rounded-xl transition-smooth active:scale-95 cursor-pointer"
                >
                  Verify Nickname
                </button>
              </div>
            </motion.div>

            {/* Step 2: Select Package */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">2</span>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">{t('select_package')}</h3>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Automated Stock Checks</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[...packages].sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd)).map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const stock = String(pkg.stock_status || 'available').toLowerCase();
                  const isOutOfStock = stock === 'out_of_stock';
                  const isLimited = stock === 'limited';
                  
                  return (
                    <button
                      key={pkg.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative flex flex-col items-center justify-center p-4 border rounded-2xl transition-all duration-300 text-center select-none ${
                        isOutOfStock
                          ? 'bg-white/2 border-white/5 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30 cursor-pointer scale-102'
                          : 'bg-[#0B1023]/60 border-white/5 text-slate-400 hover:border-white/20 hover:bg-[#151e43]/60 cursor-pointer'
                      }`}
                    >
                      {pkg.is_pass && (
                        <span className="absolute -top-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[7.5px] font-black rounded-full uppercase tracking-wider shadow">
                          Weekly Pass
                        </span>
                      )}

                      {isOutOfStock ? (
                        <span className="absolute bottom-2 right-2 text-[7px] font-black uppercase text-red-500 px-1 bg-red-500/10 rounded">Out</span>
                      ) : isLimited ? (
                        <span className="absolute bottom-2 right-2 text-[7px] font-black uppercase text-amber-500 px-1 bg-amber-500/10 rounded animate-pulse">Low</span>
                      ) : null}

                      <div className="mb-2 w-9 h-9 rounded-xl bg-[#050816] flex items-center justify-center overflow-hidden border border-white/5">
                        {game.slug === 'pubg-mobile' ? (
                          <img src="/uc_logo.png" alt="UC" className="w-6 h-6 object-contain" />
                        ) : game.slug === 'free-fire' ? (
                          <img src="/freefire_diamond.png" alt="FF" className="w-6 h-6 object-contain" />
                        ) : game.slug === 'valorant' ? (
                          <img src="/valorant_vp.png" alt="VP" className="w-6 h-6 object-contain" />
                        ) : game.slug === 'honor-of-kings' ? (
                          <img src="/hok_token.png" alt="HoK" className="w-6 h-6 object-contain" />
                        ) : (
                          <img src="/mlbb_diamond.png" alt="MLBB" className="w-6 h-6 object-contain" />
                        )}
                      </div>

                      <span className="font-extrabold text-[11px] leading-tight text-white line-clamp-1">{language === 'kh' ? (pkg.name_kh || pkg.name_en) : pkg.name_en}</span>
                      <span className="text-blue-400 font-black text-xs mt-1.5">${parseFloat(pkg.price_usd).toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 3: Quantity & Coupons */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">3</span>
                <h3 className="text-white font-black text-sm uppercase tracking-wider font-display">Quantity & Promo Codes</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Purchase Quantity</span>
                  <div className="flex items-center gap-3 bg-[#050816] border border-white/5 rounded-xl p-1.5 w-max">
                    <button
                      onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-350 hover:text-white cursor-pointer active:scale-90"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(q + 1, 10))}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-350 hover:text-white cursor-pointer active:scale-90"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Promo Coupon</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. GAMER2026"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#050816] border border-white/5 rounded-xl px-3 h-10 text-xs font-bold uppercase placeholder-slate-600 focus:outline-none"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-xl text-xs font-bold cursor-pointer transition-smooth"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Pricing Receipt Overview & Checkout triggers */}
            <motion.div variants={motionCard} className="card-glass p-6 text-left space-y-4">
              <h3 className="text-white font-black text-xs uppercase tracking-wider border-b border-white/5 pb-2 font-display">Billing Breakdown</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Subtotal Price:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount (10%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/5">
                  <span>Grand Total (USD):</span>
                  <span className="text-blue-400 font-extrabold">${totalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                  <span>Cambodia Riel (Est. KHR):</span>
                  <span>{totalKHR.toLocaleString()} KHR</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 btn-premium h-12 text-xs uppercase tracking-widest cursor-pointer active:scale-98"
                >
                  <CreditCard size={14} /> Buy Now Instantly
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-white/5 hover:bg-white/8 border border-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-smooth cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameDetail;
