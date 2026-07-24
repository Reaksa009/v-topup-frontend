import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { Upload, CreditCard, ChevronRight, AlertCircle, QrCode, Copy, Clock, ArrowLeft, RefreshCw, Landmark, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cartItems, total, totalKhr, clearCart, coupon } = useCart();
  const { isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Step stages: 'review' (Step 1), 'payment_method' (Step 2), 'gateway' (Step 3), 'failed'
  const [step, setStep] = useState('review');
  const [paymentMethod, setPaymentMethod] = useState('khqr_bakong'); // khqr_bakong, aba_qr, crypto
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [transactionNo, setTransactionNo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic KHQR States
  const [dynamicQrUrl, setDynamicQrUrl] = useState(null);
  const [dynamicQrMd5, setDynamicQrMd5] = useState(null);
  const [dynamicQrLoading, setDynamicQrLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // Timer states for KHQR expiration (3 minutes = 180 seconds)
  const [timeLeft, setTimeLeft] = useState(180);
  const [qrExpired, setQrExpired] = useState(false);

  // Custom Localizations for Checkout and Gateway steps
  const checkoutLabels = {
    en: {
      secure_payment: 'Secure Payment Gateway',
      ssl_secure: 'SSL Secured Connection',
      review_order: 'Order Checkout',
      payment_selector: 'Payment Channel',
      instant_desc: 'Scan instantly to complete purchase. Fully automated.',
      manual_desc: 'Transfer manually and upload your bank receipt.',
      summary: 'Billing Summary',
      pay_amount: 'Amount to Pay',
      waiting_payment: 'Waiting for transfer...',
      checking: 'Checking payment status automatically...',
      expires_soon: 'Session expiring soon',
      expired_title: 'Payment Expired',
      expired_desc: 'This checkout session has expired. Please regenerate your KHQR code.',
      generate_qr: 'Regenerate QR Code',
      back_review: 'Modify Details',
      i_paid: "I've Transferred",
      cancel_order: 'Cancel Payment',
      copy_ref: 'Copy Account ID',
      ref_id_label: 'Reference ID',
      upload_receipt_lbl: 'Upload Receipt Screenshot',
      confirm_checkout: 'Proceed to Payment',
      order_id: 'Order Number',
      failed_title: 'Payment Failed',
      failed_desc: 'We could not verify your receipt. Please try again or contact customer support.',
      try_again: 'Try Again',
      contact_support: 'Contact Support',
    },
    kh: {
      secure_payment: 'ច្រកទូទាត់ប្រាក់សុវត្ថិភាព',
      ssl_secure: 'ប្រព័ន្ធសុវត្ថិភាព SSL',
      review_order: 'ពិនិត្យមើលការទូទាត់',
      payment_selector: 'វិធីទូទាត់ប្រាក់',
      instant_desc: 'ស្កេនបង់ប្រាក់ភ្លាមៗ។ ដំណើរការស្វ័យប្រវត្ត។',
      manual_desc: 'ផ្ទេរប្រាក់ដោយដៃ រួចបង្ហោះរូបភាពវិក្កយបត្របង់ប្រាក់។',
      summary: 'សេចក្តីសង្ខេបការបញ្ជាទិញ',
      pay_amount: 'ចំនួនទឹកប្រាក់ត្រូវបង់',
      waiting_payment: 'កំពុងរង់ចាំការទូទាត់...',
      checking: 'កំពុងផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្ត...',
      expires_soon: 'ជិតផុតកំណត់ហើយ',
      expired_title: 'ការទូទាត់បានផុតកំណត់',
      expired_desc: 'វគ្គទូទាត់ប្រាក់នេះបានផុតកំណត់។ សូមបង្កើត QR សារជាថ្មី។',
      generate_qr: 'បង្កើត QR ថ្មី',
      back_review: 'កែសម្រួលព័ត៌មាន',
      i_paid: 'ខ្ញុំបានបង់ប្រាក់រួចហើយ',
      cancel_order: 'បោះបង់ការទូទាត់',
      copy_ref: 'ចម្លងលេខគណនី',
      ref_id_label: 'លេខកូដប្រតិបត្តិការ',
      upload_receipt_lbl: 'បង្ហោះរូបភាពវិក្កយបត្រ',
      confirm_checkout: 'បន្តទៅកាន់ការបង់ប្រាក់',
      order_id: 'លេខការបញ្ជាទិញ',
      failed_title: 'ការទូទាត់បរាជ័យ',
      failed_desc: 'យើងមិនអាចផ្ទៀងផ្ទាត់ការបង់ប្រាក់របស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងផ្នែកគាំទ្រ។',
      try_again: 'ព្យាយាមម្តងទៀត',
      contact_support: 'ទាក់ទងផ្នែកគាំទ្រ',
    }
  };

  const cl = (key) => {
    return checkoutLabels[language]?.[key] || checkoutLabels['en']?.[key] || key;
  };

  // Expiration countdown timer
  useEffect(() => {
    if (step !== 'gateway' || paymentVerified || qrExpired || paymentMethod !== 'khqr_bakong') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, paymentVerified, qrExpired, paymentMethod]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} copied!`);
  };

  // Reset QR state if dependencies change
  useEffect(() => {
    setDynamicQrUrl(null);
    setQrExpired(false);
    setTimeLeft(180);
  }, [paymentMethod, cartItems, coupon]);

  // Auto trigger gateway step if parameter is passed in route state
  useEffect(() => {
    if (location.state?.paymentMethod) {
      const method = location.state.paymentMethod;
      setPaymentMethod(method);

      if (location.state?.autoTrigger && cartItems.length > 0 && !dynamicQrUrl && timeLeft === 180) {
        setStep('gateway');
        if (method === 'khqr_bakong') {
          const triggerFetch = async () => {
            setDynamicQrLoading(true);
            setQrExpired(false);
            setTimeLeft(180);
            try {
              const itemsPayload = cartItems.map((item) => ({
                game_id: item.game.id,
                package_id: item.packageItem.id,
                player_id: item.playerId,
                server_id: item.serverId,
                qty: item.qty
              }));

              const res = await api.post('/payments/generate-khqr', {
                items: JSON.stringify(itemsPayload),
                coupon_code: coupon ? coupon.code : null
              });

              if (res.data?.success && res.data.data?.qr) {
                const qrSecure = String(res.data.data.qr).replace(/^http:\/\//i, 'https://');
                setDynamicQrUrl(qrSecure);
                setDynamicQrMd5(res.data.data.md5);
              }
            } catch (err) {
              console.error('Failed to auto-generate dynamic KHQR:', err);
            } finally {
              setDynamicQrLoading(false);
            }
          };
          triggerFetch();
        }
      }
    }
  }, [location.state, cartItems]);

  // Fetch dynamic KHQR code
  const fetchDynamicKhqr = async () => {
    setDynamicQrLoading(true);
    setQrExpired(false);
    setTimeLeft(180);
    try {
      const itemsPayload = cartItems.map((item) => ({
        game_id: item.game.id,
        package_id: item.packageItem.id,
        player_id: item.playerId,
        server_id: item.serverId,
        qty: item.qty
      }));

      const res = await api.post('/payments/generate-khqr', {
        items: JSON.stringify(itemsPayload),
        coupon_code: coupon ? coupon.code : null
      });

      if (res.data?.success && res.data.data?.qr) {
        const qrSecure = String(res.data.data.qr).replace(/^http:\/\//i, 'https://');
        setDynamicQrUrl(qrSecure);
        setDynamicQrMd5(res.data.data.md5);
      }
    } catch (err) {
      console.error('Failed to generate dynamic KHQR:', err);
      const errMsg = err.response?.data?.message || 'Failed to generate dynamic KHQR.';
      message.error(errMsg);
      setStep('failed');
    } finally {
      setDynamicQrLoading(false);
    }
  };

  // Automated confirmation checkout submitting
  const submitOrderAfterVerification = async (tranNo) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('payment_method', 'khqr_bakong');
      formData.append('transaction_no', tranNo);
      if (coupon) {
        formData.append('coupon_code', coupon.code);
      }
      
      const itemsPayload = cartItems.map((item) => ({
        game_id: item.game.id,
        package_id: item.packageItem.id,
        player_id: item.playerId,
        server_id: item.serverId,
        qty: item.qty
      }));
      formData.append('items', JSON.stringify(itemsPayload));

      const res = await api.post('/orders/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success) {
        clearCart();
        navigate(`/success?order_no=${res.data.data.order_no}`);
      } else {
        message.error(res.data?.message || 'Failed to place order.');
        setStep('failed');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to submit order after verification.');
      setStep('failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto payment polling verification every 5 seconds
  useEffect(() => {
    if (step !== 'gateway' || !dynamicQrMd5 || paymentVerified || qrExpired || paymentMethod !== 'khqr_bakong') return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/payments/check-khqr/${dynamicQrMd5}`);
        if (res.data?.success) {
          const statusData = res.data.data;
          if (statusData.verified === true || statusData.status === 'SUCCESS' || statusData.responseCode === 0) {
            setPaymentVerified(true);
            clearInterval(interval);
            message.success('Payment verified! Finalizing order...');
            await submitOrderAfterVerification(statusData.tran || 'KHQR-PAID');
          }
        }
      } catch (err) {
        console.error('Failed to check payment status:', err);
      }
    }, 5000); // Polling status check every 5 seconds

    return () => clearInterval(interval);
  }, [step, dynamicQrMd5, paymentVerified, qrExpired, paymentMethod]);

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'khqr_bakong') {
      setStep('gateway');
      await fetchDynamicKhqr();
    } else if (paymentMethod === 'aba_qr') {
      setStep('gateway');
    } else {
      message.info('Crypto Payment option is coming soon!');
    }
  };

  // Manual payment submission (ABA / Receipt upload)
  const handleManualCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      message.error('Please upload your payment receipt.');
      return;
    }
    if (!transactionNo.trim()) {
      message.error('Please enter the transaction reference ID.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('payment_method', paymentMethod);
      formData.append('transaction_no', transactionNo);
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }
      if (coupon) {
        formData.append('coupon_code', coupon.code);
      }
      
      const itemsPayload = cartItems.map((item) => ({
        game_id: item.game.id,
        package_id: item.packageItem.id,
        player_id: item.playerId,
        server_id: item.serverId,
        qty: item.qty
      }));
      formData.append('items', JSON.stringify(itemsPayload));

      const res = await api.post('/orders/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success) {
        clearCart();
        navigate(`/success?order_no=${res.data.data.order_no}`);
      } else {
        message.error(res.data?.message || 'Failed to place order.');
        setStep('failed');
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to place manual order.');
      setStep('failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error('File size exceeds the 5MB limit.');
        return;
      }
      setReceiptFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelOrder = () => {
    setStep('review');
    setReceiptFile(null);
    setReceiptPreview(null);
    setTransactionNo('');
    setPaymentVerified(false);
    setQrExpired(false);
    setTimeLeft(180);
    message.info('Payment cancelled.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#050816] text-white">
        <AlertCircle size={48} className="text-slate-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-350 mb-2">No items to checkout</h2>
        <Link to="/games" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4">
          Browse Games
        </Link>
      </div>
    );
  }

  // Calculate pricing values
  const processFee = 0.10; // $0.10 processing fee
  const orderSubtotal = total;
  const discountAmount = total * (coupon ? 0.10 : 0);
  const orderTotal = orderSubtotal + processFee - discountAmount;
  const totalKHR = Math.round(orderTotal * 4100);

  // Timeline Step Tracker helper values
  const getStepStatus = (itemStep) => {
    if (step === 'review') return itemStep === 1 ? 'active' : 'upcoming';
    if (step === 'payment_method') return itemStep === 2 ? 'active' : itemStep === 1 ? 'completed' : 'upcoming';
    if (step === 'gateway') return itemStep === 3 ? 'active' : 'completed';
    return 'upcoming';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 md:px-8 py-12 text-left bg-[#050816] text-white min-h-screen"
    >
      {/* 3-Step Premium Checkout Timeline Tracker */}
      <div className="w-full max-w-xl mx-auto mb-10 select-none">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              getStepStatus(1) === 'completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : getStepStatus(1) === 'active'
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_#3B82F6]'
                : 'bg-[#0B1023] border-white/5 text-slate-500'
            }`}>
              {getStepStatus(1) === 'completed' ? <Check size={14} /> : '1'}
            </div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Review</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              getStepStatus(2) === 'completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : getStepStatus(2) === 'active'
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_#3B82F6]'
                : 'bg-[#0B1023] border-white/5 text-slate-500'
            }`}>
              {getStepStatus(2) === 'completed' ? <Check size={14} /> : '2'}
            </div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Channel</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              getStepStatus(3) === 'completed'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : getStepStatus(3) === 'active'
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_#3B82F6]'
                : 'bg-[#0B1023] border-white/5 text-slate-500'
            }`}>
              {getStepStatus(3) === 'completed' ? <Check size={14} /> : '3'}
            </div>
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT TWO COLUMNS: DYNAMIC WORKFLOW */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Review Item Details */}
          {step === 'review' && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-glass p-6 space-y-5"
            >
              <h2 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-500" /> Confirm Purchase Item
              </h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-[#050816]/40 p-4 border border-white/5 rounded-2xl">
                  <img src={item.game.logo_url} alt={item.game.name_en} className="w-14 h-14 rounded-xl object-cover border border-white/5 shrink-0" />
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-bold text-xs sm:text-sm">{language === 'kh' ? (item.packageItem.name_kh || item.packageItem.name_en) : item.packageItem.name_en}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">{item.game.name_en}</p>
                    <div className="flex gap-4 text-[9.5px] text-blue-400 font-mono mt-1">
                      <span>ID: {item.playerId}</span>
                      {item.serverId && <span>Server: {item.serverId}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-extrabold text-xs sm:text-sm">${parseFloat(item.packageItem.price_usd).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep('payment_method')}
                  className="btn-premium px-8 h-11 text-xs uppercase tracking-widest"
                >
                  Continue to Payment Channel
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Payment Method Option */}
          {step === 'payment_method' && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-glass p-6 space-y-6"
            >
              <h2 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard size={15} className="text-purple-500" /> Choose Payment Channel
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Bakong Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khqr_bakong')}
                  className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all ${
                    paymentMethod === 'khqr_bakong'
                      ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                      : 'bg-[#050816]/40 border-white/5 hover:border-white/10 hover:bg-[#151e43]/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img src="/bakong_logo.jpg" alt="Bakong" className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">Bakong KHQR</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Automated instant status validation loop.</p>
                    </div>
                  </div>
                  {paymentMethod === 'khqr_bakong' && <span className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[9px]">✓</span>}
                </button>

                {/* ABA Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('aba_qr')}
                  className={`flex items-center justify-between p-4 border rounded-2xl text-left transition-all ${
                    paymentMethod === 'aba_qr'
                      ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                      : 'bg-[#050816]/40 border-white/5 hover:border-white/10 hover:bg-[#151e43]/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img src="/aba_logo.png" alt="ABA" className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">ABA PayWay</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Manual reference validation upload.</p>
                    </div>
                  </div>
                  {paymentMethod === 'aba_qr' && <span className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[9px]">✓</span>}
                </button>

                {/* Crypto Option - Coming Soon */}
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-between p-4 border border-white/3 bg-white/2 rounded-2xl text-left opacity-40 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">BTC</div>
                    <div>
                      <h4 className="text-slate-550 font-bold text-xs uppercase tracking-wider">Crypto Token Wallet</h4>
                      <p className="text-[9px] text-slate-600 mt-0.5">Bitcoin, USDT, Ethereum (Coming Soon)</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep('review')}
                  className="px-5 h-11 text-xs uppercase tracking-widest text-slate-400 hover:text-white border border-white/5 rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="btn-premium px-8 h-11 text-xs uppercase tracking-widest"
                >
                  Proceed to Payment
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Secure Scan & Pay Verification Screen */}
          {step === 'gateway' && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-glass p-6 md:p-8 space-y-6 text-center"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <button
                  onClick={handleCancelOrder}
                  className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {cl('cancel_order')}
                </button>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-500 animate-pulse" /> Secure Payment Gateway
                </span>
              </div>

              {/* Dynamic KHQR Option Interface */}
              {paymentMethod === 'khqr_bakong' && (
                <div className="space-y-6 flex flex-col items-center">
                  
                  {dynamicQrLoading ? (
                    <div className="h-48 w-48 flex flex-col items-center justify-center space-y-3 bg-[#050816] border border-white/5 rounded-2xl">
                      <RefreshCw size={24} className="animate-spin text-blue-500" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Generating KHQR...</p>
                    </div>
                  ) : qrExpired ? (
                    <div className="max-w-xs space-y-4 p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-center">
                      <AlertCircle size={28} className="text-red-500 mx-auto" />
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">{cl('expired_title')}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{cl('expired_desc')}</p>
                      <button
                        onClick={fetchDynamicKhqr}
                        className="btn-premium px-5 h-9 text-[10px] uppercase tracking-wider"
                      >
                        {cl('generate_qr')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 flex flex-col items-center">
                      
                      {/* Circle timer and code details */}
                      <div className="relative h-20 w-20 flex items-center justify-center">
                        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" fill="none" />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="#3B82F6"
                            strokeWidth="3.5"
                            fill="none"
                            strokeDasharray={219.9}
                            strokeDashoffset={219.9 - (219.9 * (timeLeft / 180))}
                            transition="stroke-dashoffset 1s linear"
                          />
                        </svg>
                        <span className="text-white font-mono text-xs font-black">{formatTime(timeLeft)}</span>
                      </div>

                      {/* Display QR code */}
                      <div className="p-3 bg-white rounded-2xl shadow-xl w-max">
                        {dynamicQrUrl ? (
                          <img src={dynamicQrUrl} alt="Bakong KHQR" className="h-44 w-44 object-cover" />
                        ) : (
                          <div className="h-44 w-44 bg-slate-200 animate-pulse rounded-lg"></div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-white font-extrabold text-sm">{cl('waiting_payment')}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{cl('checking')}</p>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ABA PayWay Manual Receipt Option Interface */}
              {paymentMethod === 'aba_qr' && (
                <form onSubmit={handleManualCheckoutSubmit} className="max-w-md mx-auto space-y-5 text-left">
                  
                  <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex gap-3 text-left">
                    <Landmark size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="text-white font-bold">Transfer to ABA Account:</p>
                      <p className="text-slate-400 mt-1">Bank Name: <span className="text-white">ABA Bank</span></p>
                      <p className="text-slate-400">Account Name: <span className="text-white">V-TOPUP GATEWAY</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-400">Account Number: <span className="text-blue-400 font-mono font-bold">000 123 456</span></p>
                        <button type="button" onClick={() => handleCopyText('000123456', 'Account ID')} className="text-blue-400 hover:text-white text-[10px] underline font-bold cursor-pointer">Copy</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cl('ref_id_label')}</label>
                    <input
                      type="text"
                      placeholder="e.g. ABA-928451"
                      value={transactionNo}
                      onChange={(e) => setTransactionNo(e.target.value)}
                      className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-11 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cl('upload_receipt_lbl')}</label>
                    <div className="relative h-24 border border-dashed border-white/10 hover:border-blue-500/30 rounded-xl bg-white/3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {receiptPreview ? (
                        <img src={receiptPreview} alt="Receipt Preview" className="h-full w-full object-contain rounded-xl p-1" />
                      ) : (
                        <>
                          <Upload size={18} className="text-slate-500 animate-bounce" />
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Browse Image File</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-premium h-11 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        cl('i_paid')
                      )}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          )}

          {/* Payment Failed Interface Screen */}
          {step === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass p-8 text-center space-y-5 max-w-md mx-auto"
            >
              <AlertCircle size={44} className="text-red-500 mx-auto" />
              <h2 className="text-white font-black text-lg uppercase tracking-wider">{cl('failed_title')}</h2>
              <p className="text-slate-400 text-xs leading-relaxed">{cl('failed_desc')}</p>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 px-4 h-10 border border-white/5 hover:bg-white/5 rounded-xl text-xs font-bold transition-all text-white uppercase tracking-wider"
                >
                  {cl('try_again')}
                </button>
                <a
                  href="https://t.me/vtopup_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-premium h-10 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {cl('contact_support')}
                </a>
              </div>
            </motion.div>
          )}

        </div>

        {/* RIGHT COLUMN: REAL-TIME BILLING SUMMARY CARD */}
        <div className="lg:col-span-1">
          <div className="card-glass p-6 space-y-5">
            <h3 className="text-white font-black text-xs uppercase tracking-wider border-b border-white/5 pb-3">{cl('summary')}</h3>

            <div className="space-y-3.5 text-xs text-left">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2 border-b border-white/3 pb-3">
                  <div>
                    <h4 className="text-white font-bold">{language === 'kh' ? (item.packageItem.name_kh || item.packageItem.name_en) : item.packageItem.name_en}</h4>
                    <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">ID: {item.playerId}</p>
                  </div>
                  <span className="text-white font-bold shrink-0">${(parseFloat(item.packageItem.price_usd) * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div className="space-y-2.5 pt-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Order Items Subtotal:</span>
                  <span className="text-white">${orderSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Gateway Fee:</span>
                  <span className="text-white">${processFee.toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Discount (10%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-white font-bold text-sm pt-3.5 border-t border-white/5">
                  <span>{cl('pay_amount')} (USD):</span>
                  <span className="text-blue-400 font-extrabold text-base">${orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                  <span>Est. KHR:</span>
                  <span>{totalKHR.toLocaleString()} KHR</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex items-center gap-2 justify-center text-[10px] font-bold text-slate-500">
              <ShieldCheck className="text-emerald-500" size={13} />
              <span>SSL Secured Payment Pipeline</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Checkout;
