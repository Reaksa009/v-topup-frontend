import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { message } from 'antd';

const Cart = () => {
  const {
    cartItems,
    coupon,
    subtotal,
    discount,
    total,
    totalKhr,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    const res = await applyCoupon(couponCode);
    setApplying(false);
    if (res.success) {
      message.success(res.message);
      setCouponCode('');
    } else {
      message.error(res.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 rounded-full"></div>
          <ShoppingBag className="relative h-20 w-20 text-slate-700 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-300 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Looks like you haven't added any game packages to your cart yet. Explore our games catalog and top up today!
        </p>
        <Link
          to="/games"
          className="flex items-center gap-2 px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
        >
          {t('games')}
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <h1 className="text-3xl font-black text-white mb-8">{t('cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, idx) => (
            <div
              key={`${item.packageItem.id}-${item.playerId}-${item.serverId}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/40 border border-slate-850 hover:border-slate-800 rounded-2xl gap-4 transition-smooth"
            >
              {/* Item Info */}
              <div className="flex gap-4 items-center">
                <img
                  src={item.game.logo_url}
                  alt={item.game.name_en}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-850 bg-slate-950"
                />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    {language === 'kh' ? item.game.name_kh : item.game.name_en}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {language === 'kh' ? item.packageItem.name_kh : item.packageItem.name_en}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1 font-mono">
                    ID: {item.playerId} {item.serverId ? `| Server: ${item.serverId}` : ''}
                  </p>
                </div>
              </div>

              {/* Price & Qty Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-slate-900 pt-3 sm:pt-0">
                <div className="flex flex-col text-left sm:text-right">
                  <span className="text-white font-extrabold text-sm">
                    ${(parseFloat(item.packageItem.price_usd) * item.qty).toFixed(2)}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    ${parseFloat(item.packageItem.price_usd).toFixed(2)} / each
                  </span>
                </div>

                {/* Qty increment */}
                <div className="flex items-center bg-slate-950 border border-slate-850 rounded-xl px-2 h-10">
                  <button
                    onClick={() => updateCartQuantity(item.packageItem.id, item.playerId, item.serverId, item.qty - 1)}
                    className="p-1 text-slate-500 hover:text-white transition-smooth"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white text-xs font-bold px-3 select-none w-8 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.packageItem.id, item.playerId, item.serverId, item.qty + 1)}
                    className="p-1 text-slate-500 hover:text-white transition-smooth"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.packageItem.id, item.playerId, item.serverId)}
                  className="p-2.5 bg-red-950/20 hover:bg-red-950/40 text-red-500 border border-red-900/10 hover:border-red-900/30 rounded-xl transition-smooth"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-bold text-base border-b border-slate-850 pb-3">Summary</h3>

            {/* Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>{t('subtotal')}</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>{t('discount')}</span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="h-px bg-slate-850 my-2"></div>

              <div className="flex justify-between items-baseline text-white">
                <span className="font-black text-base">{t('total')}</span>
                <div className="text-right">
                  <p className="font-black text-xl text-blue-500">${total.toFixed(2)}</p>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">{totalKhr.toLocaleString()} KHR</p>
                </div>
              </div>
            </div>

            {/* Coupon input */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-xs font-bold">
                <span className="flex items-center gap-1.5 uppercase">
                  <Tag size={14} /> {coupon.code} Applied
                </span>
                <button onClick={removeCoupon} className="p-1 hover:text-white transition-smooth">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('coupon_placeholder')}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-smooth"
                >
                  {t('apply_coupon')}
                </button>
              </form>
            )}

            {/* Proceed */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
