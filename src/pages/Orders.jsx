import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Clipboard, Clock, CheckCircle2, XCircle, RefreshCcw, Landmark, ShieldCheck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { message } from 'antd';
import { motion } from 'framer-motion';

const DUMMY_ORDERS = [
  { id: 1, order_no: 'ORD-928475', created_at: '2026-07-14 09:30:00', game_name: 'Mobile Legends', package_name: 'Weekly Diamond Pass', player_id: '12345678', server_id: '9988', total_price_usd: 1.99, status: 'processing', payment_method: 'khqr_bakong' },
  { id: 2, order_no: 'ORD-817294', created_at: '2026-07-13 14:15:00', game_name: 'Valorant', package_name: '1000 VP', player_id: 'RiotUser#SEA', server_id: '', total_price_usd: 9.50, status: 'completed', payment_method: 'aba_qr' },
  { id: 3, order_no: 'ORD-716492', created_at: '2026-07-11 18:45:00', game_name: 'Free Fire', package_name: '100 Diamonds', player_id: '99284759', server_id: '', total_price_usd: 0.95, status: 'cancelled', payment_method: 'wing' }
];

const Orders = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning({
        content: 'Please login to access your orders.',
        key: 'orders_login_warning'
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [orders, setOrders] = useState(DUMMY_ORDERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data?.data) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load user orders from API, using fallback data');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'cancelled':
      case 'failed': return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'pending':
      case 'waiting_verification': return 'text-amber-400 border-amber-500/20 bg-amber-500/5 animate-pulse';
      case 'paid':
      case 'processing': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      default: return 'text-slate-400 border-white/5 bg-white/3';
    }
  };

  const copyOrderNo = (orderNo) => {
    navigator.clipboard.writeText(orderNo);
    message.success('Order Number copied!');
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Created' },
      { key: 'paid', label: 'Paid' },
      { key: 'processing', label: 'Processing' },
      { key: 'completed', label: 'Delivered' }
    ];

    if (status === 'cancelled' || status === 'failed') {
      return [
        { key: 'pending', label: 'Created' },
        { key: status, label: status === 'cancelled' ? 'Cancelled' : 'Failed', error: true }
      ];
    }

    return steps;
  };

  const getStepActiveIndex = (status) => {
    if (status === 'pending' || status === 'waiting_verification') return 0;
    if (status === 'paid') return 1;
    if (status === 'processing') return 2;
    if (status === 'completed') return 3;
    return -1;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left bg-[#050816] text-white min-h-screen relative"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wider">{t('my_orders')}</h1>
        <Link to="/games" className="text-xs text-blue-400 hover:text-white flex items-center gap-1 font-bold">
          Order New Game <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <RefreshCcw className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
          <p className="text-slate-450 text-xs font-bold uppercase">Loading order archives...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-[#0B1023]/30 border border-white/5 rounded-3xl space-y-4">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No transaction records found.</p>
          <Link to="/games" className="inline-block btn-premium px-6 h-10 text-[10px] uppercase tracking-widest">Shop Packages</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const timelineSteps = getTimelineSteps(order.status);
            const activeIndex = getStepActiveIndex(order.status);

            return (
              <div
                key={order.id}
                className={`card-glass p-6 space-y-6 border-l-4 ${
                  order.status === 'completed'
                    ? 'border-l-emerald-500'
                    : order.status === 'cancelled' || order.status === 'failed'
                    ? 'border-l-red-500'
                    : 'border-l-blue-500'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Order Reference</span>
                    <span className="text-white font-mono font-bold text-xs bg-[#050816] px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
                      {order.order_no}
                      <button
                        onClick={() => copyOrderNo(order.order_no)}
                        className="text-slate-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Clipboard size={12} />
                      </button>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{order.created_at}</span>
                    <span className={`px-2.5 py-0.5 border rounded text-[8.5px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-400">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Catalog Title</span>
                    <span className="text-white font-bold text-sm mt-0.5">{order.game_name || order.items?.[0]?.game?.name_en}</span>
                    <span className="text-slate-500 font-semibold">{order.package_name || order.items?.[0]?.package_item?.name_en}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Player Account</span>
                    <span className="text-white font-mono text-sm mt-0.5">ID: {order.player_id || order.items?.[0]?.player_id}</span>
                    {(order.server_id || order.items?.[0]?.server_id) && <span className="text-slate-500 font-mono text-[10px]">Server: {order.server_id || order.items?.[0]?.server_id}</span>}
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Payment Route</span>
                    <span className="text-white font-bold text-xs uppercase tracking-wider mt-1 flex items-center gap-1.5">
                      <Landmark size={14} className="text-blue-500" />
                      {String(order.payment_method || 'khqr_bakong').replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-left md:text-right">
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Grand Total</span>
                    <span className="text-blue-400 font-black text-base mt-0.5">${parseFloat(order.total_price_usd || order.total_amount_usd || 0).toFixed(2)}</span>
                    <span className="text-slate-600 font-mono text-[9px]">
                      {Math.round((order.total_price_usd || order.total_amount_usd || 0) * 4100).toLocaleString()} KHR
                    </span>
                  </div>
                </div>

                {/* Timeline status tracker visual representation */}
                <div className="pt-4 border-t border-white/5 select-none">
                  <div className="flex justify-between items-center relative max-w-lg">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                    
                    {timelineSteps.map((stepItem, idx) => {
                      const isCompleted = activeIndex >= idx && !stepItem.error;
                      const isActive = activeIndex === idx;
                      const isError = stepItem.error;

                      return (
                        <div key={stepItem.key} className="relative z-10 flex flex-col items-center gap-1.5">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                            isError
                              ? 'bg-red-500 border-red-500 text-white'
                              : isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isActive
                              ? 'bg-blue-600 border-blue-500 text-white animate-pulse'
                              : 'bg-[#050816] border-white/5 text-slate-600'
                          }`}>
                            {isCompleted ? <Check size={11} /> : isError ? '!' : String(idx + 1)}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            isError ? 'text-red-400' : isCompleted ? 'text-emerald-400 font-black' : 'text-slate-500'
                          }`}>{stepItem.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
