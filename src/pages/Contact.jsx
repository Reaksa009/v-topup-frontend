import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { message } from 'antd';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', messageText: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.messageText.trim()) {
      message.error('Please fill in name, email and message.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      message.success('Thank you for contacting us! We will reply back via email shortly.');
      setFormData({ name: '', email: '', subject: '', messageText: '' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2 mb-2">
          <HelpCircle className="text-blue-500" size={28} />
          {t('contact')}
        </h1>
        <p className="text-slate-500 text-sm">Need help with an order? Drop us a line and our support team will assist you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-5">
            <h3 className="text-white font-bold text-base">Support Channels</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider">Office Location</p>
                  <p className="text-white mt-1 leading-relaxed">Phnom Penh City, Kingdom of Cambodia</p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider">Phone Support</p>
                  <p className="text-white mt-1">+855 12 345 678</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">Mon - Sun (8:00 AM - 10:00 PM)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/10 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider">Email Inquiry</p>
                  <p className="text-white mt-1">support@vtopup.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleContactSubmit} className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-bold text-base">Send Us a Message</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 h-11 text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-slate-950 border border-slate-850 rounded-xl px-4 h-11 text-white placeholder-slate-655 focus:outline-none focus:border-blue-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="text-slate-400 font-bold uppercase tracking-wider">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 h-11 text-white placeholder-slate-655 focus:outline-none focus:border-blue-500"
                placeholder="Topic of inquiry"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="text-slate-400 font-bold uppercase tracking-wider">Message Details</label>
              <textarea
                name="messageText"
                rows="5"
                value={formData.messageText}
                onChange={handleInputChange}
                className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-white placeholder-slate-655 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Describe your issue or feedback..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-smooth text-xs active:scale-98 disabled:opacity-50"
            >
              <Send size={14} />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
