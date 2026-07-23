import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Phone, Mail, Lock, ShieldCheck, KeyRound, Wallet, ShoppingBag, Tag, Bell, Cpu, Sparkles } from 'lucide-react';
import { message } from 'antd';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, changePassword, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning({
        content: 'Please login to access your profile.',
        key: 'profile_login_warning'
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      message.error('Please enter name and phone.');
      return;
    }
    setSavingProfile(true);
    const res = await updateProfile({ name, phone });
    setSavingProfile(false);
    if (res.success) {
      message.success('Profile details updated successfully.');
    } else {
      message.error(res.message);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !password || !confirmPassword) {
      message.error('All password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      message.error('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    const res = await changePassword(oldPassword, password, confirmPassword);
    setSavingPassword(false);
    if (res.success) {
      message.success('Password updated successfully.');
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } else {
      message.error(res.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left bg-[#050816] text-white min-h-screen relative"
    >
      {/* Glow decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <h1 className="text-2xl md:text-4xl font-black text-white mb-8 uppercase tracking-wider">Gamer Profile</h1>

      {/* KPI Cards / Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        {/* Wallet balance */}
        <div className="card-glass p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Wallet size={20} />
          </div>
          <div className="text-left">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Wallet Balance</p>
            <p className="text-white font-extrabold text-sm md:text-base mt-0.5">$25.80</p>
          </div>
        </div>

        {/* Total orders */}
        <div className="card-glass p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <ShoppingCart size={20} />
          </div>
          <div className="text-left">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Total Orders</p>
            <p className="text-white font-extrabold text-sm md:text-base mt-0.5">12 orders</p>
          </div>
        </div>

        {/* Coupons */}
        <div className="card-glass p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Tag size={20} />
          </div>
          <div className="text-left">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Active Coupons</p>
            <p className="text-white font-extrabold text-sm md:text-base mt-0.5">3 Available</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="card-glass p-5 flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Bell size={20} />
          </div>
          <div className="text-left">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Notifications</p>
            <p className="text-white font-extrabold text-sm md:text-base mt-0.5">0 Unread</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Account Specks */}
        <div className="lg:col-span-1 card-glass p-6 text-center flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white mb-4 shadow-lg shadow-blue-500/10">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border border-[#050816]" />
          </div>
          <h2 className="text-white font-bold text-lg">{user?.name}</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-2">
            <Sparkles size={10} /> {user?.role || 'Member'} Rank
          </span>
          
          <div className="h-px bg-white/5 w-full my-6"></div>

          <div className="w-full text-xs text-slate-500 space-y-3">
            <div className="flex justify-between">
              <span>Account Email:</span>
              <span className="text-slate-300 truncate max-w-[150px] font-bold">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> Active Secured
              </span>
            </div>
          </div>
        </div>

        {/* Right Columns: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Update Profile specifications */}
          <form onSubmit={handleUpdateProfile} className="card-glass p-6 space-y-5">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/5 pb-3">
              <User size={18} className="text-blue-500" /> Account Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('full_name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-semibold"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('phone')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Email Address (Read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full bg-[#050816]/40 border border-white/5 text-slate-500 rounded-xl px-4 h-12 text-sm cursor-not-allowed font-semibold"
                disabled
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="btn-premium px-6 h-12 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {savingProfile ? t('loading') : t('save_changes')}
            </button>
          </form>

          {/* Change Password settings form */}
          <form onSubmit={handleUpdatePassword} className="card-glass p-6 space-y-5">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/5 pb-3">
              <KeyRound size={18} className="text-purple-500" /> Update Security Credentials
            </h3>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-slate-650"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-slate-650"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#050816] border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-slate-650"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="btn-premium px-6 h-12 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {savingPassword ? t('loading') : t('change_password')}
            </button>
          </form>

        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
