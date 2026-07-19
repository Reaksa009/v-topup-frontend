import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Phone, Mail, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { message } from 'antd';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <h1 className="text-3xl font-black text-white mb-8">{t('profile')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Col - Card Info */}
        <div className="lg:col-span-1 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-extrabold text-white mb-4">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-white font-bold text-lg">{user?.name}</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-2 capitalize">
            {user?.role} Account
          </span>
          
          <div className="h-px bg-slate-850 w-full my-6"></div>

          <div className="w-full text-xs text-slate-500 space-y-2.5">
            <p className="flex justify-between">
              <span>Registration email:</span>
              <span className="text-slate-300 truncate max-w-[150px]">{user?.email}</span>
            </p>
            <p className="flex justify-between">
              <span>Account Status:</span>
              <span className="text-emerald-500 flex items-center gap-1">
                <ShieldCheck size={12} /> Active
              </span>
            </p>
          </div>
        </div>

        {/* Right Columns - Inputs Edit */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile details */}
          <form onSubmit={handleUpdateProfile} className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              {t('edit_profile')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('full_name')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-slate-600" size={16} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-550 text-xs font-bold uppercase tracking-wider">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-800" size={16} />
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-11 pr-4 h-12 text-sm text-slate-600 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-smooth text-sm active:scale-98 disabled:opacity-50"
            >
              {savingProfile ? t('loading') : t('save_changes')}
            </button>
          </form>

          {/* Change Password */}
          <form onSubmit={handleUpdatePassword} className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <KeyRound size={18} className="text-blue-500" />
              {t('change_password')}
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-600" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-600" size={16} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-smooth"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-smooth text-sm active:scale-98 disabled:opacity-50"
            >
              {savingPassword ? t('loading') : t('change_password')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
