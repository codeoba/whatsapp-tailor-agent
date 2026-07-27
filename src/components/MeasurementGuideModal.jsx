import React from 'react';
import { Ruler, CheckCircle2, HelpCircle } from 'lucide-react';

export default function MeasurementGuideModal({ onClose }) {
  const steps = [
    {
      title: "1. Kifua (Bust)",
      desc: "Zungushia utepe wa kupimia (tape measure) sehemu iliyojaa zaidi kifuani. Hakikisha utepe uko mlalo sahihi na si mbana sana.",
      unit: "Centimeters (cm)"
    },
    {
      title: "2. Kiuno (Waist)",
      desc: "Zungushia utepe sehemu iliyobana zaidi ya kiuno (kawaida cm 2-3 juu ya kitovu). Pumua kawaida unapopima.",
      unit: "Centimeters (cm)"
    },
    {
      title: "3. Nyonga (Hips)",
      desc: "Simama pamoja kwa miguu na uzungushie utepe sehemu iliyojaa zaidi ya makalio/nyonga.",
      unit: "Centimeters (cm)"
    },
    {
      title: "4. Upana wa Bega (Shoulder)",
      desc: "Pima kutoka kwenye mfupa wa bega la kushoto hadi bega la kulia kwa nyuma kupita kisogo cha shingo.",
      unit: "Centimeters (cm)"
    },
    {
      title: "5. Urefu wa Mkono (Sleeve)",
      desc: "Pima kutoka juu ya bega kuelekea chini mpaka kwenye mkono (kama ni mfupi au mrefu kulingana na muundo).",
      unit: "Centimeters (cm)"
    },
    {
      title: "6. Urefu wa Nguo (Garment Length)",
      desc: "Pima kuanzia juu ya bega karibu na shingo kuelekea chini mpaka mahali unapotaka nguo iishie (magotini au mguuni).",
      unit: "Centimeters (cm)"
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-950 text-amber-400 rounded-2xl border border-amber-800/50">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 font-heading">
                Mwongozo wa Kujipima Nyumbani (Self-Measurement Guide)
              </h3>
              <p className="text-xs text-slate-400">
                Hatua kwa hatua za kuchukua vipimo sahihi kwa sentimita (cm)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-400">{s.title}</h4>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {s.unit}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-950/50 border border-emerald-800/60 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Ushauri kutoka kwa Fundi:</strong> Ukishindwa au ukipata mashaka, chagua njia ya <strong>Video Call</strong> kupitia WhatsApp na fundi wetu atakuelekeza moja kwa moja ukiwa nyumbani!
          </span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            Nimeelewa (Funga)
          </button>
        </div>
      </div>
    </div>
  );
}
