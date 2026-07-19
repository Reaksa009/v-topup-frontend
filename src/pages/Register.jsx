import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Phone, Lock, ArrowRight, Gamepad2 } from 'lucide-react';
import { message } from 'antd';

const Register = () => {
  const { register, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      message.error('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }

    const res = await register(name, email, phone, password, confirmPassword);
    if (res.success) {
      message.success('Registration successful! Welcome aboard.');
      navigate('/games');
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 relative py-12">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glassmorphism border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20 mb-4">
            <Gamepad2 size={28} />
          </div>
          <h2 className="text-2xl font-black text-white">{t('register')}</h2>
          <p className="text-slate-500 text-xs mt-1">Create an account to start tracking orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('full_name')}</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-650" size={16} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 transition-smooth"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-655" size={16} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 transition-smooth"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-655" size={16} />
              <input
                type="tel"
                placeholder="+855 12 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 transition-smooth"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-655" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 transition-smooth"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('confirm_password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-655" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 transition-smooth"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 disabled:opacity-50 mt-4"
          >
            {loading ? t('loading') : (
              <>
                {t('register')}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="h-px bg-slate-850 my-6"></div>

        <p className="text-slate-500 text-xs text-center">
          {t('already_have_account')}{' '}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
