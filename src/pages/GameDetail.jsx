import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Gamepad2, ArrowLeft, ShieldCheck, Heart, ShoppingCart, CreditCard, Gem } from 'lucide-react';
import { message } from 'antd';

const DUMMY_PACKAGES_BY_GAME = {
  'mobile-legends': [
    { id: 101, name_en: '5 Diamonds', name_kh: '៥ ពេជ្រ', price_usd: 0.12, price_khr: 500, points_or_diamonds: 5, bonus_points: 0, is_active: 1 },
    { id: 102, name_en: '50 Diamonds', name_kh: '៥០ ពេជ្រ', price_usd: 1.00, price_khr: 4100, points_or_diamonds: 50, bonus_points: 5, is_active: 1 },
    { id: 103, name_en: '250 Diamonds', name_kh: '២៥០ ពេជ្រ', price_usd: 4.80, price_khr: 19680, points_or_diamonds: 250, bonus_points: 25, is_active: 1 },
    { id: 104, name_en: 'Weekly Diamond Pass', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍', price_usd: 1.99, price_khr: 8150, points_or_diamonds: 220, bonus_points: 70, is_active: 1, is_pass: true },
    { id: 105, name_en: 'Monthly Diamond Pass', name_kh: 'សំបុត្រពេជ្រប្រចាំខែ', price_usd: 7.99, price_khr: 32750, points_or_diamonds: 880, bonus_points: 300, is_active: 1, is_pass: true }
  ],
  'free-fire': [
    { id: 201, name_en: '25 Diamonds', name_kh: '២៥ ពេជ្រ', price_usd: 0.25, price_khr: 1000, points_or_diamonds: 25, bonus_points: 0, is_active: 1 },
    { id: 202, name_en: '100 Diamonds', name_kh: '១០០ ពេជ្រ', price_usd: 0.95, price_khr: 3900, points_or_diamonds: 100, bonus_points: 10, is_active: 1 },
    { id: 203, name_en: '310 Diamonds', name_kh: '៣១០ ពេជ្រ', price_usd: 2.90, price_khr: 11900, points_or_diamonds: 310, bonus_points: 35, is_active: 1 }
  ],
  'pubg-mobile': [
    { id: 301, name_en: '60 UC', name_kh: '៦០ យូស៊ី', price_usd: 0.99, price_khr: 4100, points_or_diamonds: 60, bonus_points: 0, is_active: 1 },
    { id: 302, name_en: '325 UC', name_kh: '៣២៥ យូស៊ី', price_usd: 4.90, price_khr: 20100, points_or_diamonds: 325, bonus_points: 25, is_active: 1 },
    { id: 303, name_en: '660 UC', name_kh: '៦៦០ យូស៊ី', price_usd: 9.80, price_khr: 40200, points_or_diamonds: 660, bonus_points: 60, is_active: 1 }
  ],
  'valorant': [
    { id: 401, name_en: '475 VP', name_kh: '៤៧៥ វីភី', price_usd: 4.75, price_khr: 19500, points_or_diamonds: 475, bonus_points: 0, is_active: 1 },
    { id: 402, name_en: '1000 VP', name_kh: '១០០០ វីភី', price_usd: 9.50, price_khr: 39000, points_or_diamonds: 1000, bonus_points: 50, is_active: 1 }
  ],
  'roblox': [
    { id: 501, name_en: '800 Robux', name_kh: '៨០០ រ៉ូប៊ូស', price_usd: 9.99, price_khr: 41000, points_or_diamonds: 800, bonus_points: 0, is_active: 1 },
    { id: 502, name_en: '1700 Robux', name_kh: '១៧០០ រ៉ូប៊ូស', price_usd: 19.99, price_khr: 82000, points_or_diamonds: 1700, bonus_points: 100, is_active: 1 }
  ],
  'mobile-khmer': [
    { id: 1101, name_en: '11 Diamond', name_kh: '១១ ពេជ្រ', price_usd: 0.23, price_khr: 940, points_or_diamonds: 11, bonus_points: 0, is_active: 1 },
    { id: 1102, name_en: '22 Diamond', name_kh: '២២ ពេជ្រ', price_usd: 0.40, price_khr: 1640, points_or_diamonds: 22, bonus_points: 0, is_active: 1 },
    { id: 1103, name_en: '55 Diamond', name_kh: '៥៥ ពេជ្រ', price_usd: 0.85, price_khr: 3490, points_or_diamonds: 55, bonus_points: 0, is_active: 1 },
    { id: 1104, name_en: 'Weekly Elite Bundle', name_kh: 'កញ្ចប់ Weekly Elite', price_usd: 0.85, price_khr: 3490, points_or_diamonds: 55, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1105, name_en: '86 Diamond', name_kh: '៨៦ ពេជ្រ', price_usd: 1.29, price_khr: 5290, points_or_diamonds: 86, bonus_points: 0, is_active: 1 },
    { id: 1106, name_en: 'Weekly pass x1', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍ x1', price_usd: 1.48, price_khr: 6070, points_or_diamonds: 220, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1107, name_en: '165 Diamond', name_kh: '១៦៥ ពេជ្រ', price_usd: 2.45, price_khr: 10050, points_or_diamonds: 165, bonus_points: 0, is_active: 1 },
    { id: 1108, name_en: '172 Diamond', name_kh: '១៧២ ពេជ្រ', price_usd: 2.55, price_khr: 10460, points_or_diamonds: 172, bonus_points: 0, is_active: 1 },
    { id: 1109, name_en: 'Weekly Pass x2', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍ x2', price_usd: 2.96, price_khr: 12140, points_or_diamonds: 440, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1110, name_en: '234+23 Diamond', name_kh: '២៣៤+២៣ ពេជ្រ', price_usd: 3.69, price_khr: 15130, points_or_diamonds: 257, bonus_points: 23, is_active: 1 },
    { id: 1111, name_en: '275 Diamond', name_kh: '២៧៥ ពេជ្រ', price_usd: 3.75, price_khr: 15380, points_or_diamonds: 275, bonus_points: 0, is_active: 1 },
    { id: 1112, name_en: 'Monthly Epic Bundle', name_kh: 'កញ្ចប់ Monthly Epic', price_usd: 4.19, price_khr: 17180, points_or_diamonds: 275, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1113, name_en: '312 Diamond', name_kh: '៣១២ ពេជ្រ', price_usd: 4.25, price_khr: 17430, points_or_diamonds: 312, bonus_points: 0, is_active: 1 },
    { id: 1114, name_en: 'Weekly Pass x3', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍ x3', price_usd: 4.44, price_khr: 18200, points_or_diamonds: 660, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1115, name_en: '343 Diamond', name_kh: '៣៤៣ ពេជ្រ', price_usd: 4.89, price_khr: 20050, points_or_diamonds: 343, bonus_points: 0, is_active: 1 },
    { id: 1116, name_en: '361 Diamond', name_kh: '៣៦១ ពេជ្រ', price_usd: 5.05, price_khr: 20710, points_or_diamonds: 361, bonus_points: 0, is_active: 1 },
    { id: 1117, name_en: 'Weekly Pass x4', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍ x4', price_usd: 5.92, price_khr: 24270, points_or_diamonds: 880, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1118, name_en: '429 Diamond', name_kh: '៤២៩ ពេជ្រ', price_usd: 6.15, price_khr: 25220, points_or_diamonds: 429, bonus_points: 0, is_active: 1 },
    { id: 1119, name_en: '451 Diamond Lady dragon', name_kh: '៤៥១ ពេជ្រ Lady Dragon', price_usd: 6.25, price_khr: 25630, points_or_diamonds: 451, bonus_points: 0, is_active: 1 },
    { id: 1120, name_en: '514 Diamond', name_kh: '៥១៤ ពេជ្រ', price_usd: 7.19, price_khr: 29480, points_or_diamonds: 514, bonus_points: 0, is_active: 1 },
    { id: 1121, name_en: 'Weekly Pass x5', name_kh: 'សំបុត្រពេជ្រប្រចាំសប្តាហ៍ x5', price_usd: 7.40, price_khr: 30340, points_or_diamonds: 1100, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1122, name_en: '565 Diamond', name_kh: '៥៦៥ ពេជ្រ', price_usd: 7.65, price_khr: 31370, points_or_diamonds: 565, bonus_points: 0, is_active: 1 },
    { id: 1123, name_en: 'Twilight Pass', name_kh: 'សំបុត្រ Twilight Pass', price_usd: 8.20, price_khr: 33620, points_or_diamonds: 365, bonus_points: 0, is_active: 1, is_pass: true },
    { id: 1124, name_en: '600 Diamond', name_kh: '៦០០ ពេជ្រ', price_usd: 8.49, price_khr: 34810, points_or_diamonds: 600, bonus_points: 0, is_active: 1 },
    { id: 1125, name_en: '636 Diamond Vexana', name_kh: '៦៣៦ ពេជ្រ Vexana', price_usd: 8.75, price_khr: 35880, points_or_diamonds: 636, bonus_points: 0, is_active: 1 },
    { id: 1126, name_en: '706 Diamond', name_kh: '៧០៦ ពេជ្រ', price_usd: 9.69, price_khr: 39730, points_or_diamonds: 706, bonus_points: 0, is_active: 1 },
    { id: 1127, name_en: '761 Diamond', name_kh: '៧៦១ ពេជ្រ', price_usd: 10.69, price_khr: 43830, points_or_diamonds: 761, bonus_points: 0, is_active: 1 },
    { id: 1128, name_en: '792 Diamond', name_kh: '៧៩២ ពេជ្រ', price_usd: 10.99, price_khr: 45060, points_or_diamonds: 792, bonus_points: 0, is_active: 1 },
    { id: 1129, name_en: '878 Diamond', name_kh: '៨៧៨ ពេជ្រ', price_usd: 12.19, price_khr: 49980, points_or_diamonds: 878, bonus_points: 0, is_active: 1 },
    { id: 1130, name_en: '963 Diamond', name_kh: '៩៦៣ ពេជ្រ', price_usd: 13.19, price_khr: 54080, points_or_diamonds: 963, bonus_points: 0, is_active: 1 },
    { id: 1131, name_en: '1049 Diamond', name_kh: '១០៤៩ ពេជ្រ', price_usd: 14.69, price_khr: 60230, points_or_diamonds: 1049, bonus_points: 0, is_active: 1 },
    { id: 1132, name_en: '1135 Diamond', name_kh: '១១៣៥ ពេជ្រ', price_usd: 15.89, price_khr: 65150, points_or_diamonds: 1135, bonus_points: 0, is_active: 1 },
    { id: 1133, name_en: '1220 Diamond', name_kh: '១២២០ ពេជ្រ', price_usd: 17.15, price_khr: 70320, points_or_diamonds: 1220, bonus_points: 0, is_active: 1 },
    { id: 1134, name_en: '1412 Diamond', name_kh: '១៤MT ពេជ្រ', price_usd: 19.45, price_khr: 79750, points_or_diamonds: 1412, bonus_points: 0, is_active: 1 },
    { id: 1135, name_en: '1584 Diamond', name_kh: '១៥៨៤ ពេជ្រ', price_usd: 21.69, price_khr: 88930, points_or_diamonds: 1584, bonus_points: 0, is_active: 1 },
    { id: 1136, name_en: '1755 Diamond', name_kh: '១៧៥៥ ពេជ្រ', price_usd: 24.35, price_khr: 99840, points_or_diamonds: 1755, bonus_points: 0, is_active: 1 },
    { id: 1137, name_en: '2195 Diamond', name_kh: '២MT ពេជ្រ', price_usd: 29.49, price_khr: 120910, points_or_diamonds: 2195, bonus_points: 0, is_active: 1 },
    { id: 1138, name_en: '2538 Diamond', name_kh: '២៥៣៨ ពេជ្រ', price_usd: 34.45, price_khr: 141250, points_or_diamonds: 2538, bonus_points: 0, is_active: 1 },
    { id: 1139, name_en: '2901 Diamond', name_kh: '២៩០១ ពេជ្រ', price_usd: 39.00, price_khr: 159900, points_or_diamonds: 2901, bonus_points: 0, is_active: 1 },
    { id: 1140, name_en: '3688 Diamond', name_kh: '៣៦៨៨ ពេជ្រ', price_usd: 49.50, price_khr: 202950, points_or_diamonds: 3688, bonus_points: 0, is_active: 1 },
    { id: 1141, name_en: '4394 Diamond', name_kh: '៤៣៩៤ ពេជ្រ', price_usd: 59.50, price_khr: 243950, points_or_diamonds: 4394, bonus_points: 0, is_active: 1 },
    { id: 1142, name_en: '5532 Diamond', name_kh: '៥៥៣២ ពេជ្រ', price_usd: 73.50, price_khr: 301350, points_or_diamonds: 5532, bonus_points: 0, is_active: 1 },
    { id: 1143, name_en: '6238 Diamond', name_kh: '៦២៣៨ ពេជ្រ', price_usd: 83.50, price_khr: 342350, points_or_diamonds: 6238, bonus_points: 0, is_active: 1 },
    { id: 1144, name_en: '7727 Diamond', name_kh: '៧៧២៧ ពេជ្រ', price_usd: 104.50, price_khr: 428450, points_or_diamonds: 7727, bonus_points: 0, is_active: 1 },
    { id: 1145, name_en: '9288 Diamond', name_kh: '៩២៨៨ ពេជ្រ', price_usd: 123.00, price_khr: 504300, points_or_diamonds: 9288, bonus_points: 0, is_active: 1 },
    { id: 1146, name_en: '11483 Diamond', name_kh: '១១៤៨៣ ពេជ្រ', price_usd: 153.00, price_khr: 627300, points_or_diamonds: 11483, bonus_points: 0, is_active: 1 }
  ],
  'honor-of-kings': [
    { id: 601, name_en: '80 Tokens', name_kh: '៨០ ថូខិន', price_usd: 0.99, price_khr: 4100, points_or_diamonds: 80, bonus_points: 0, is_active: 1 },
    { id: 602, name_en: '240 Tokens', name_kh: '២៤០ ថូខិន', price_usd: 2.99, price_khr: 12300, points_or_diamonds: 240, bonus_points: 0, is_active: 1 },
    { id: 603, name_en: '400 Tokens', name_kh: '៤០០ ថូខិន', price_usd: 4.99, price_khr: 20500, points_or_diamonds: 400, bonus_points: 0, is_active: 1 },
    { id: 604, name_en: '560 Tokens', name_kh: '៥៦០ ថូខិន', price_usd: 6.99, price_khr: 28700, points_or_diamonds: 560, bonus_points: 0, is_active: 1 },
    { id: 605, name_en: '830 Tokens', name_kh: '៨៣០ ថូខិន', price_usd: 9.99, price_khr: 41000, points_or_diamonds: 830, bonus_points: 0, is_active: 1 },
    { id: 606, name_en: '1245 Tokens', name_kh: '១២៤៥ ថូខិន', price_usd: 14.99, price_khr: 61500, points_or_diamonds: 1245, bonus_points: 0, is_active: 1 },
    { id: 607, name_en: '2508 Tokens', name_kh: '២៥០៨ ថូខិន', price_usd: 29.99, price_khr: 123000, points_or_diamonds: 2508, bonus_points: 0, is_active: 1 },
    { id: 608, name_en: '4180 Tokens', name_kh: '៤១៨០ ថូខិន', price_usd: 49.99, price_khr: 205000, points_or_diamonds: 4180, bonus_points: 0, is_active: 1 }
  ]
};

const DUMMY_GAMES_DETAIL = [
  { id: 11, name_en: 'Mobile Legends (Khmer Server)', name_kh: 'Mobile ខ្មែរ', slug: 'mobile-khmer', server_id_required: 1, description_en: 'Enter player ID and server ID to purchase diamonds or passes for Khmer Server. Delivery is processed within 1-5 minutes.', description_kh: 'បញ្ចូលលេខសម្គាល់អ្នកលេង និងលេខម៉ាស៊ីនបម្រើ ដើម្បីទិញពេជ្រ ឬសំបុត្រប្រចាំសប្តាហ៍សម្រាប់ Khmer Server។ ទំនិញនឹងបញ្ចូលក្នុងរយៈពេល ១ ទៅ ៥ នាទី។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', slug: 'mobile-legends', server_id_required: 1, description_en: 'Enter player ID and server ID to purchase diamonds or passes. Delivery is processed within 1-5 minutes.', description_kh: 'បញ្ចូលលេខសម្គាល់អ្នកលេង និងលេខម៉ាស៊ីនបម្រើ ដើម្បីទិញពេជ្រ ឬសំបុត្រប្រចាំសប្តាហ៍។ ទំនិញនឹងបញ្ចូលក្នុងរយៈពេល ១ ទៅ ៥ នាទី។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', slug: 'free-fire', server_id_required: 0, description_en: 'Purchase diamonds instantly with Free Fire Player ID. Fast delivery guaranteed.', description_kh: 'ទិញពេជ្រហ្វ្រីហ្វាយភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី។ ធានាការបញ្ជូនលឿនរហ័ស។', logo_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80' },
  { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', slug: 'pubg-mobile', server_id_required: 0, description_en: 'Top up PUBG Mobile Unknown Cash (UC) with direct character ID validation.', description_kh: 'បញ្ចូលលុយយូស៊ី ផាប់ជីម៉ូបាល តាមរយៈលេខសម្គាល់តួអង្គរបស់អ្នក។', logo_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=1200&auto=format&fit=crop&q=80' },
  { id: 4, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', slug: 'valorant', server_id_required: 0, description_en: 'Select your Valorant Points package. Safe top-up via Riot ID.', description_kh: 'ជ្រើសរើសកញ្ចប់វ៉ាឡូរែនភ័ន។ សុវត្ថិភាពខ្ពស់ តាមរយៈគណនី Riot ID។', logo_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop&q=80' },
  { id: 5, name_en: 'Roblox', name_kh: 'រ៉ូប្លុក', slug: 'roblox', server_id_required: 0, description_en: 'Top up Robux instantly with username. Safe and clean codes.', description_kh: 'បញ្ចូលរ៉ូប៊ូសភ្លាមៗ តាមរយៈឈ្មោះអ្នកប្រើប្រាស់។ កូដស្អាត សុវត្ថិភាព ១០០%។', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&auto=format&fit=crop&q=80' },
  { id: 6, name_en: 'Honor of Kings', name_kh: 'អនើអហ្វឃីង', slug: 'honor-of-kings', server_id_required: 0, description_en: 'Purchase Honor of Kings tokens instantly. Secure top-up via Character ID.', description_kh: 'ទិញថូខិនហ្គេម Honor of Kings ភ្លាមៗ តាមរយៈលេខសម្គាល់គណនី Character ID។', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80', banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' }
];

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState('');

  // Clear verification status and auto-trigger validation when inputs are complete (1s debounce)
  useEffect(() => {
    setVerifiedNickname('');

    if (!game) return;

    const hasPlayerId = playerId.trim().length > 0;
    const hasServerId = serverId.trim().length > 0;
    const isComplete = game.server_id_required ? (hasPlayerId && hasServerId) : hasPlayerId;

    if (!isComplete) return;

    const timer = setTimeout(() => {
      handleVerifyAccount();
    }, 1000);

    return () => clearTimeout(timer);
  }, [playerId, serverId, game]);

  const handleVerifyAccount = async () => {
    if (!playerId.trim()) {
      message.error(t('player_id_placeholder'));
      return;
    }
    if (game.server_id_required && !serverId.trim()) {
      message.error(t('server_id_placeholder'));
      return;
    }

    setIsVerifying(true);
    setVerifiedNickname('');
    try {
      const res = await api.post('/games/verify-player', {
        player_id: playerId,
        server_id: serverId,
        game_id: game.id
      });
      if (res.data?.success) {
        setVerifiedNickname(res.data.nickname);
        message.success('Account credentials verified successfully!');
      } else {
        message.error(res.data?.message || 'Player not found.');
        setVerifiedNickname('');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Player not found.';
      message.error(errMsg);
      setVerifiedNickname('');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    // Look up local static first
    const matchedGame = DUMMY_GAMES_DETAIL.find((g) => g.slug === slug);
    if (matchedGame) {
      setGame(matchedGame);
      setPackages(DUMMY_PACKAGES_BY_GAME[slug] || DUMMY_PACKAGES_BY_GAME['mobile-legends']);
    }

    // Try fetching from API
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-slate-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!playerId.trim()) {
      message.error(t('player_id_placeholder'));
      return;
    }
    if (game.server_id_required && !serverId.trim()) {
      message.error(t('server_id_placeholder'));
      return;
    }
    if (!selectedPackage) {
      message.error(t('select_package'));
      return;
    }

    addToCart(game, selectedPackage, playerId, serverId, 1);
    message.success('Item added to shopping cart!');
  };

  const handleBuyNow = () => {
    if (!playerId.trim()) {
      message.error(t('player_id_placeholder'));
      return;
    }
    if (game.server_id_required && !serverId.trim()) {
      message.error(t('server_id_placeholder'));
      return;
    }
    if (!selectedPackage) {
      message.error(t('select_package'));
      return;
    }

    addToCart(game, selectedPackage, playerId, serverId, 1);
    navigate('/checkout');
  };

  return (
    <div className="pb-32 text-left">
      {/* Banner Banner */}
      <div className="relative w-full h-[240px] md:h-[350px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.3]"
          style={{ backgroundImage: `url(${game.banner_url || game.logo_url})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] to-transparent"></div>
        <div className="absolute bottom-6 max-w-7xl mx-auto px-6 w-full flex items-center gap-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 transition-smooth"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-blue-500 font-bold text-xs uppercase tracking-wider">Top-up game</span>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-1">
              {language === 'kh' ? game.name_kh : game.name_en}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Sticky Game Info & Real-time Selection Preview */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6 self-start">
            {/* Game Info Card */}
            <div className="bg-[#0b0f19]/40 border border-slate-850/60 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group">
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-blue-600/10 transition-all duration-500"></div>
              
              <div className="flex items-center gap-4 mb-6 relative">
                <img
                  src={game.logo_url}
                  alt={game.name_en}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shadow-md group-hover:scale-105 transition-smooth"
                />
                <div>
                  <h2 className="text-white font-black text-lg tracking-tight">{language === 'kh' ? game.name_kh : game.name_en}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-emerald-450 text-[10px] font-black uppercase tracking-wider">Instant delivery</p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-400 text-xs leading-relaxed font-medium relative">
                {language === 'kh' ? game.description_kh : game.description_en}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-900/60 flex items-center gap-2.5 text-slate-500 text-[11px] font-semibold relative">
                <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
                <span>100% Secure Transaction via Bakong Net</span>
              </div>
            </div>

            {/* Live Order Summary Card */}
            <div className="bg-[#0b0f19]/40 border border-slate-850/60 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden animate-fadeIn">
              <div className="border-b border-slate-900/60 pb-3 mb-4">
                <h4 className="text-slate-350 font-black text-xs uppercase tracking-wider">Live Order Summary</h4>
              </div>

              {selectedPackage ? (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-white font-bold text-sm">{language === 'kh' ? selectedPackage.name_kh : selectedPackage.name_en}</p>
                      <p className="text-slate-550 text-[10px] mt-0.5">Category: {language === 'kh' ? game.name_kh : game.name_en}</p>
                    </div>
                    <span className="text-cyan-400 font-extrabold text-sm shrink-0">
                      ${parseFloat(selectedPackage.price_usd).toFixed(2)}
                    </span>
                  </div>

                  {/* Account detail outputs */}
                  {(playerId.trim() || serverId.trim()) && (
                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 space-y-1.5 font-mono text-[10px]">
                      {playerId.trim() && (
                        <div className="flex justify-between text-slate-400">
                          <span>PLAYER ID:</span>
                          <span className="text-white font-bold">{playerId}</span>
                        </div>
                      )}
                      {serverId.trim() && (
                        <div className="flex justify-between text-slate-400">
                          <span>SERVER ID:</span>
                          <span className="text-white font-bold">{serverId}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-900/60 space-y-2">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-200">${parseFloat(selectedPackage.price_usd).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300 font-bold text-sm">
                      <span>Total (USD):</span>
                      <span className="text-cyan-400 font-extrabold text-base">${parseFloat(selectedPackage.price_usd).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono">
                      <span>Est. KHR:</span>
                      <span>
                        {selectedPackage.price_khr ? `${selectedPackage.price_khr} KHR` : `${Math.round(selectedPackage.price_usd * 4100)} KHR`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-550 space-y-2">
                  <p className="text-xs font-bold">No Package Selected</p>
                  <p className="text-[10px] text-slate-655 max-w-[200px] mx-auto">Please select a package from the options to preview your checkout summary.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Account Info */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-6 w-6 rounded-full bg-blue-600/20 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="text-white font-bold text-base">Enter Account Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('player_id')}</label>
                  <input
                    type="text"
                    placeholder={t('player_id_placeholder')}
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-smooth"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('server_id')}</label>
                  <input
                    type="text"
                    placeholder={t('server_id_placeholder')}
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 h-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-smooth"
                  />
                </div>
              </div>

              {/* Verify Account Action */}
              <div className="mt-4 pt-4 border-t border-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 text-left">
                  {isVerifying ? (
                    <span className="text-xs text-blue-400 font-bold flex items-center gap-1.5 animate-pulse">
                      <svg className="animate-spin h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying player credentials...
                    </span>
                  ) : verifiedNickname ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-4.5 w-4.5 rounded-full bg-emerald-500/20 text-emerald-455 border border-emerald-500/10 flex items-center justify-center font-black text-[9px]">✓</span>
                      Account Nickname: <span className="underline decoration-dotted decoration-emerald-500/50">{verifiedNickname}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      Double check your credentials before purchasing top-ups.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs rounded-xl active:scale-95 transition-all select-none cursor-pointer hover:bg-slate-900"
                >
                  Verify Account
                </button>
              </div>
            </div>

            {/* Step 2: Package Select */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-6 w-6 rounded-full bg-blue-600/20 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="text-white font-bold text-base">{t('select_package')}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...packages].sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd)).map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const isWeeklyPass = pkg.name_en.toLowerCase().includes('weekly') && pkg.name_en.toLowerCase().includes('pass');
                  const isTwilightPass = pkg.name_en.toLowerCase().includes('twilight') && pkg.name_en.toLowerCase().includes('pass');
                  
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative flex flex-col items-center justify-center p-5 border rounded-2xl transition-all duration-300 text-center group cursor-pointer ${
                        isSelected
                          ? 'bg-[#152347]/45 border-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.18)] ring-1 ring-blue-500/30'
                          : 'bg-[#090d16]/50 border-slate-850 text-slate-400 hover:border-slate-700 hover:bg-[#0c1322]/50 hover:-translate-y-0.5 shadow-md'
                      }`}
                    >
                      {/* Gradient Hover Glow Accent */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/0 via-blue-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      {/* Package badges */}
                      {pkg.bonus_points > 0 && (
                        <span className="absolute -top-2 px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-[8px] text-white font-extrabold rounded-full uppercase tracking-wider shadow-sm shadow-purple-500/10">
                          +{pkg.bonus_points} {t('bonus')}
                        </span>
                      )}
                      {(pkg.is_pass || isWeeklyPass || isTwilightPass) && (
                        <span className={`absolute -top-2 px-2.5 py-0.5 text-[8px] text-white font-extrabold rounded-full uppercase tracking-wider shadow-sm ${
                          isWeeklyPass ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'
                        }`}>
                          {isWeeklyPass ? 'Weekly Pass' : isTwilightPass ? 'Special Pass' : 'Pass'}
                        </span>
                      )}

                      {/* Diamond Gem / UC / Free Fire / Valorant / Honor of Kings Icon */}
                      <div className={`mb-3.5 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                        isSelected 
                          ? 'scale-110 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/40 bg-slate-950' 
                          : 'bg-[#070b12] border border-slate-850 group-hover:scale-105 group-hover:border-slate-800'
                      }`}>
                        {game.slug === 'pubg-mobile' ? (
                          <img src="/uc_logo.png" alt="UC" className="w-full h-full object-cover scale-105" />
                        ) : game.slug === 'free-fire' ? (
                          <img src="/freefire_diamond.png" alt="Diamond" className="w-full h-full object-cover scale-105" />
                        ) : game.slug === 'valorant' ? (
                          <img src="/valorant_vp.png" alt="VP" className="w-full h-full object-cover scale-105" />
                        ) : game.slug === 'honor-of-kings' ? (
                          <img src="/hok_token.png" alt="Tokens" className="w-full h-full object-cover scale-105" />
                        ) : (game.slug === 'mobile-legends' || game.slug === 'mobile-khmer') ? (
                          <img src="/mlbb_diamond.png" alt="Diamonds" className="w-full h-full object-cover scale-105" />
                        ) : (
                          <span className={isSelected ? 'text-cyan-400' : 'text-slate-555 group-hover:text-cyan-400'}>
                            <Gem size={20} className="fill-current" />
                          </span>
                        )}
                      </div>

                      <span className="font-bold text-[13px] leading-tight text-slate-200 group-hover:text-white transition-smooth line-clamp-1">
                        {language === 'kh' ? pkg.name_kh : pkg.name_en}
                      </span>
                      <span className="text-cyan-400 font-black text-base mt-2 tracking-tight">
                        ${parseFloat(pkg.price_usd).toFixed(2)}
                      </span>
                      <span className="text-slate-500 text-[10px] font-medium mt-0.5">
                        {pkg.price_khr ? `${pkg.price_khr} KHR` : `${Math.round(pkg.price_usd * 4100)} KHR`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Action triggers (Fixed Bottom Bar) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e17]/85 border-t border-slate-800/80 p-4 md:py-5 shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="max-w-7xl mx-auto flex flex-row gap-4 px-4 sm:px-6 lg:px-8">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 cursor-pointer"
                >
                  <CreditCard size={15} />
                  {t('buy_now')}
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 h-11 md:h-12 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700 text-white font-semibold text-xs md:text-sm transition-smooth active:scale-98 cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  {t('add_to_cart')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
