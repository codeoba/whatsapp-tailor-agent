import React, { useState } from 'react';
import { Settings, Save, Phone, MapPin, Clock, CreditCard, ShieldCheck } from 'lucide-react';

export default function BusinessSettings({ config, onSaveConfig }) {
  const [formData, setFormData] = useState({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payments: { ...prev.payments, [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            Mipangilio ya Biashara & Lipa Namba (Business Info)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Badilisha taarifa za msingi za duka zikazotumiwa na WhatsApp Bot kwenye mazungumzo
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded-full text-xs font-bold animate-fade-in flex items-center gap-1">
            ✓ Zimehifadhiwa!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Basic Identity */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4" />
             Utambulisho wa Duka & Boti:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Jina la Biashara / Studio:</label>
              <input
                type="text"
                value={formData.business_name || ''}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Jina la Fundi / Mmiliki:</label>
              <input
                type="text"
                value={formData.owner_name || ''}
                onChange={(e) => handleChange('owner_name', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Jina la WhatsApp Bot:</label>
              <input
                type="text"
                value={formData.bot_name || ''}
                onChange={(e) => handleChange('bot_name', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Namba ya Simu / WhatsApp:</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Mahali Studio / Duka lilipo:</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Saa za Kazi:</label>
              <input
                type="text"
                value={formData.working_hours || ''}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4" />
            💳 Njia za Malipo (Lipa Namba & Account Details):
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">M-Pesa Lipa Namba:</label>
              <input
                type="text"
                value={formData.payments?.mpesa_lipa || ''}
                onChange={(e) => handlePaymentChange('mpesa_lipa', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Tigo Pesa Lipa Namba:</label>
              <input
                type="text"
                value={formData.payments?.tigo_pesa || ''}
                onChange={(e) => handlePaymentChange('tigo_pesa', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Airtel Money:</label>
              <input
                type="text"
                value={formData.payments?.airtel_money || ''}
                onChange={(e) => handlePaymentChange('airtel_money', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Akaunti ya Benki:</label>
              <input
                type="text"
                value={formData.payments?.bank || ''}
                onChange={(e) => handlePaymentChange('bank', e.target.value)}
                className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            Hifadhi Mipangilio
          </button>
        </div>
      </form>
    </div>
  );
}
