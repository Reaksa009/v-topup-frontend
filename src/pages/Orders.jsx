import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Clipboard, Clock, CheckCircle2, XCircle, RefreshCcw, Landmark, ShieldCheck } from 'lucide-react';
import { message } from 'antd';

const DUMMY_ORDERS = [
  { id: 1, order_no: 'ORD-928475', created_at: '2026-07-14 09:30:00', game_name: 'Mobile Legends', package_name: 'Weekly Diamond Pass', player_id: '12345678', server_id: '9988', total_price_usd: 1.99, status: 'waiting_verification', payment_method: 'khqr_bakong' },
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest rounded-xl shadow-sm shadow-amber-500/5">
            <Clock size={11} /> {t('order_pending')}
          </span>
        );
      case 'waiting_verification':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 border border-orange-500/35 text-orange-400 text-[10px] font-black uppercase tracking-wider rounded-xl animate-pulse shadow-md shadow-orange-500/10">
            <Clock size={11} className="animate-spin" /> {t('order_waiting_verification')}
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/35 text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10">
            <CheckCircle2 size={11} /> {t('order_paid')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/35 text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-indigo-500/10">
            <RefreshCcw size={11} className="animate-spin" /> {t('order_processing')}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/35 text-emerald-450 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/10">
            <CheckCircle2 size={11} /> {t('order_completed')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/15 border border-red-500/35 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-red-500/10">
            <XCircle size={11} /> {t('order_cancelled')}
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-500/15 border border-slate-500/35 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md shadow-slate-500/10">
            <XCircle size={11} /> {t('order_refunded')}
          </span>
        );
      default:
        return status;
    }
  };

  const copyOrderNo = (orderNo) => {
    navigator.clipboard.writeText(orderNo);
    message.success('Order Number copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <h1 className="text-3xl font-black text-white mb-8">{t('my_orders')}</h1>

      {loading ? (
        <div className="text-center py-20">
          <RefreshCcw className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
          <p className="text-slate-500 text-sm">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-850 rounded-3xl">
          <p className="text-slate-500 text-sm">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-slate-900/20 border backdrop-blur-md p-6 rounded-2xl transition-all duration-300 space-y-4 hover:shadow-lg ${
                order.status === 'completed' 
                  ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-sm shadow-emerald-500/5 border-l-4 border-l-emerald-500'
                  : order.status === 'waiting_verification'
                  ? 'border-orange-500/20 hover:border-orange-500/45 shadow-sm shadow-orange-500/5 border-l-4 border-l-orange-500'
                  : order.status === 'cancelled'
                  ? 'border-red-500/20 hover:border-red-500/40 border-l-4 border-l-red-500'
                  : 'border-slate-850 hover:border-slate-800 border-l-4 border-l-blue-500'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Order</span>
                  <span className="text-white font-mono font-bold text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850 flex items-center gap-1.5">
                    {order.order_no}
                    <button
                      onClick={() => copyOrderNo(order.order_no)}
                      className="text-slate-500 hover:text-white transition-smooth"
                    >
                      <Clipboard size={12} />
                    </button>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs">{order.created_at}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order content detail */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-400">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Game Details</span>
                  <span className="text-white font-bold text-sm mt-0.5">{order.game_name}</span>
                  <span className="text-slate-500">{order.package_name}</span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Player Account</span>
                  <span className="text-white font-mono text-sm mt-0.5">ID: {order.player_id}</span>
                  {order.server_id && <span className="text-slate-500 font-mono">Server ID: {order.server_id}</span>}
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Payment Method</span>
                  <span className="text-white font-semibold text-sm mt-0.5 flex items-center gap-1.5">
                    <Landmark size={14} className="text-blue-500" />
                    {order.payment_method.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-left md:text-right">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Total Paid</span>
                  <span className="text-blue-400 font-black text-base mt-0.5">
                    ${parseFloat(order.total_price_usd).toFixed(2)}
                  </span>
                  <span className="text-slate-550 text-[10px]">
                    {Math.round(order.total_price_usd * 4100).toLocaleString()} KHR
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
