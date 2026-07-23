import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Check, Download, Printer, Home, Copy, ArrowLeft, RefreshCw, Sparkles, Receipt, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { message } from 'antd';
import { motion } from 'framer-motion';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get('order_no');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const canvasRef = useRef(null);

  // Khmer translations dictionary for the receipt page specifically
  const receiptTranslations = {
    en: {
      secure_receipt: 'Secure Digital Receipt',
      payment_successful: 'Paid Successfully',
      thank_you: 'Thank you for your purchase!',
      order_number: 'Order Number',
      transaction_id: 'Transaction ID',
      game: 'Game Title',
      package: 'Package Item',
      player_id: 'Player ID',
      server: 'Server Region',
      payment_method: 'Payment Channel',
      amount_usd: 'Amount (USD)',
      amount_khr: 'Amount (KHR)',
      paid_time: 'Date / Time',
      status: 'Delivery Status',
      provider: 'API Route',
      download_receipt: 'Save Invoice Image',
      print_receipt: 'Print Receipt',
      back_home: 'Store Front',
      buy_again: 'Continue Shopping',
      copied: 'Copied to clipboard!',
      loading_receipt: 'Loading receipt details...',
      not_found: 'Receipt not found.',
      check_status: 'Automated order delivery updates.',
    },
    kh: {
      secure_receipt: 'វិក្កយបត្រឌីជីថលសុវត្ថិភាព',
      payment_successful: 'ការទូទាត់ទទួលបានជោគជ័យ',
      thank_you: 'សូមអរគុណសម្រាប់ការគាំទ្រ!',
      order_number: 'លេខបញ្ជាទិញ',
      transaction_id: 'លេខកូដប្រតិបត្តិការ',
      game: 'ហ្គេម',
      package: 'កញ្ចប់',
      player_id: 'លេខសម្គាល់អ្នកលេង',
      server: 'ម៉ាស៊ីនបម្រើ (Server)',
      payment_method: 'វិធីទូទាត់ប្រាក់',
      amount_usd: 'ចំនួនទឹកប្រាក់ (USD)',
      amount_khr: 'ចំនួនទឹកប្រាក់ (KHR)',
      paid_time: 'កាលបរិច្ឆេទបង់ប្រាក់',
      status: 'ស្ថានភាពបញ្ជូន',
      provider: 'ផ្លូវបញ្ជូន (API)',
      download_receipt: 'រក្សាទុកវិក្កយបត្រ',
      print_receipt: 'បោះពុម្ពវិក្កយបត្រ',
      back_home: 'ទំព័រដើម',
      buy_again: 'ទិញម្តងទៀត',
      copied: 'ចម្លងទុកជោគជ័យ!',
      loading_receipt: 'កំពុងផ្ទុកព័ត៌មានវិក្កយបត្រ...',
      not_found: 'រកមិនឃើញវិក្កយបត្រទេ។',
      check_status: 'កំពុងផ្ទៀងផ្ទាត់ការបញ្ជូនស្វ័យប្រវត្ត។',
    }
  };

  const rt = (key) => {
    return receiptTranslations[language]?.[key] || receiptTranslations['en']?.[key] || key;
  };

  // Play premium success chime sound
  const playSuccessChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      
      const playTone = (freq, time, dur) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + dur);
      };

      playTone(523.25, audioCtx.currentTime, 0.4); // C5
      playTone(659.25, audioCtx.currentTime + 0.12, 0.5); // E5
    } catch (e) {
      console.warn('Audio play blocked:', e);
    }
  };

  // Setup Canvas Confetti
  useEffect(() => {
    if (loading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const particles = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2.5;
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }
      });
    };

    playSuccessChime();
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 6000);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [loading]);

  // Load Order Details
  useEffect(() => {
    if (!orderNo) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/tracking/${orderNo}`);
        if (res.data?.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load receipt details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    
    // Auto refresh order status every 5 seconds until delivery complete
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/orders/tracking/${orderNo}`);
        if (res.data?.success) {
          setOrder(res.data.data);
          if (res.data.data.status === 'completed' || res.data.data.status === 'failed') {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Auto refresh status check failed:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderNo]);

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copied!`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#050816] text-white">
        <RefreshCw className="animate-spin text-blue-500 mb-3" size={32} />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{rt('loading_receipt')}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center bg-[#050816] text-white px-4">
        <AlertCircle size={44} className="text-red-500 mb-4 animate-bounce" />
        <h2 className="text-lg font-black text-slate-300 uppercase tracking-widest">{rt('not_found')}</h2>
        <Link to="/" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider mt-4">
          Return Home
        </Link>
      </div>
    );
  }

  const items = order.items || [];
  const firstItem = items[0] || {};
  const statusColor = 
    order.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
    order.status === 'failed' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    'text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-[#050816] text-white pb-24 pt-12 text-left"
    >
      {/* Canvas confetti elements */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50 w-full h-full" />

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        
        {/* Celebration header header */}
        <div className="text-center space-y-3.5 mb-8">
          <div className="relative inline-flex h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <Check size={26} className="stroke-[3]" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white font-black"><Sparkles size={8} /></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider">{rt('payment_successful')}</h1>
          <p className="text-xs text-slate-400 font-semibold">{rt('thank_you')}</p>
        </div>

        {/* Digital Billing Invoice Layout */}
        <div className="card-glass p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none"></div>

          {/* Secure watermark */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Receipt size={13} className="text-blue-500" /> {rt('secure_receipt')}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <Calendar size={12} />
              <span>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs text-left">
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('order_number')}</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">{order.order_no}</span>
                <button onClick={() => handleCopyText(order.order_no, 'Order ID')} className="text-blue-400 hover:text-white"><Copy size={12} /></button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('transaction_id')}</p>
              <span className="text-white font-mono font-bold">{order.transaction_no || 'N/A'}</span>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('game')}</p>
              <span className="text-white font-bold">{firstItem.game?.name_en || 'N/A'}</span>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('package')}</p>
              <span className="text-white font-bold">{language === 'kh' ? (firstItem.package_item?.name_kh || firstItem.package_item?.name_en) : firstItem.package_item?.name_en}</span>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('player_id')}</p>
              <span className="text-white font-mono font-bold">{firstItem.player_id || 'N/A'}</span>
            </div>

            {firstItem.server_id && (
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('server')}</p>
                <span className="text-white font-mono font-bold">{firstItem.server_id}</span>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('payment_method')}</p>
              <span className="text-white font-bold uppercase tracking-wider">{String(order.payment_method || 'khqr_bakong').replace('_', ' ')}</span>
            </div>

            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-wider">{rt('status')}</p>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${statusColor}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="h-px bg-white/5 my-4"></div>

          {/* Pricing parameters display */}
          <div className="space-y-2.5 text-xs text-left bg-white/2 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-slate-400 font-semibold">
              <span>{rt('amount_usd')}:</span>
              <span className="text-white font-extrabold">${parseFloat(order.total_amount_usd || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 font-mono text-[10px] border-t border-white/3 pt-2">
              <span>{rt('amount_khr')}:</span>
              <span>{Math.round((order.total_amount_usd || 0) * 4100).toLocaleString()} KHR</span>
            </div>
          </div>
          
          <div className="pt-2 text-center text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="text-emerald-500" size={13} />
            <span>SSL Secured Official Delivery Receipt</span>
          </div>

        </div>

        {/* Form triggers */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 select-none">
          <button
            onClick={() => navigate('/games')}
            className="flex-1 btn-premium h-11 text-xs uppercase tracking-widest"
          >
            {rt('buy_again')}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 h-11 bg-white/5 hover:bg-white/8 border border-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer size={13} /> {rt('print_receipt')}
          </button>

          <Link
            to="/"
            className="flex-grow-0 px-6 h-11 bg-[#0B1023] border border-white/5 hover:border-white/10 hover:bg-[#151e43] text-slate-350 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center"
          >
            <Home size={13} />
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default Success;
