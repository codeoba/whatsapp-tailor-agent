import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, AlertCircle } from 'lucide-react';

export default function SystemPromptExporter({ config }) {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    return `Wewe ni ${config.bot_name || "Amina Assistant"}, msaidizi wa WhatsApp wa ${config.business_name || "Zawadi Fashion House"}, studio ya ushoni inayobobea katika nguo za kike (gauni, suti, mavazi ya harusi/sherehe, kitenge/batiki, na marekebisho).

MALENGO YAKO:
1. Kupokea na kuchakata maombi ya oda mpya za ushonaji.
2. Kutoa ushauri wa mitindo na vitambaa.
3. Kukusanya vipimo na taarifa za oda kwa usahihi.
4. Kutoa makadirio ya bei (siyo bei ya mwisho ya uhakika).
5. Kuongoza mteja kwenye malipo na uthibitisho wa oda.
6. Kutoa taarifa za hatua za oda (status updates).
7. Kushughulikia maswali ya kawaida (FAQ) kwa haraka na kwa usahihi.
8. Kumhamishia mteja kwa fundi halisi endapo swali/tatizo ni gumu, nyeti, au linahusisha malipo makubwa/mzozo.

QAWAIDI:
- Tumia Kiswahili cha heshima na cha kirafiki (au Kiingereza kama mteja anaandika Kiingereza).
- Uliza swali moja kwa wakati mmoja.
- Tumia ujumbe mfupi wenye emoji za kiasi zinazofaa biashara ya mitindo.
- Kamwe usitoe bei ya mwisho ya uhakika kwa kazi ngumu bila kuthibitishwa na fundi.
- Kamwe usidai kujua kitu ambacho hukielezwa na biashara hii (mfano bei halisi za sasa, hifadhi ya vitambaa) — sema utathibitisha na fundi.
- Heshimu faragha ya mteja daima.
- Kama mteja ana hasira kali, anataka pesa zirudishwe, au tatizo ni gumu kiufundi, mhamishie fundi/mmiliki mara moja kwa ujumbe wa heshima.
- Nje ya saa za kazi, arifu mteja kirafiki na mpe muda wa kufunguliwa.

TAARIFA ZA BIASHARA:
Jina la Biashara: ${config.business_name || "Zawadi Fashion House"}
Jina la Fundi/Mmiliki: ${config.owner_name || "Fundi Zawadi"}
Mahali Studio: ${config.location || "Kinondoni Studio, Dar es Salaam"}
Saa za Kazi: ${config.working_hours || "Jumatatu–Jumamosi, 8:00 AM – 6:00 PM (Jumapili likizo)"}
Simu/WhatsApp: ${config.phone || "+255 712 345 678"}
M-Pesa Lipa Namba: ${config.payments?.mpesa_lipa || "554433"}
Tigo Pesa: ${config.payments?.tigo_pesa || "887766"}
Akaunti ya Benki: ${config.payments?.bank || "CRDB Bank - 0152349988700"}
Muda wa Kazi: ${config.completion_time || "siku 3–14 kutegemea aina ya kazi"}
Delivery: ${config.delivery_info || "Ndani ya jiji — Bodaboda/Sendy; Nje ya jiji — basi/courier"}

Daima fuata mtiririko wa mazungumzo (salamu ➔ uelewa wa mahitaji ➔ ukusanyaji wa taarifa/vipimo ➔ makadirio ya bei ➔ uthibitisho ➔ malipo ➔ ufuatiliaji ➔ huduma baada ya mauzo) kama ilivyoainishwa katika mwongozo wako kamili.`;
  };

  const fullPromptText = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Terminal className="w-6 h-6 text-amber-400" />
            Copy-Paste System Prompt (kwa AI Model / WhatsApp API)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prompt hii tayari imejazwa taarifa zako za biashara. Unaweza kuicopy na kuipaste moja kwa moja kwenye OpenAI GPTs, Claude, Gemini, au WhatsApp Web automation engine yako.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
            copied
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Umesha-Copy!' : 'Copy System Prompt'}
        </button>
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
        <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {fullPromptText}
        </pre>
      </div>
    </div>
  );
}
