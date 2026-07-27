import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Ruler, RotateCcw, CheckCheck, Phone, Video, MoreVertical, Sparkles, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export default function WhatsAppSimulator({ agentEngine, businessConfig, existingOrders, onNewOrderCreated, openMeasurementModal }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Karibu sana kwa *${businessConfig.business_name || "Zawadi Fashion House"}*! 👗✂️\nMimi ni *${businessConfig.bot_name || "Amina Assistant"}*, msaidizi wako wa kidijitali.\n\nNingependa kukusaidiaje leo?\n1️⃣ Nataka kushonewa nguo mpya\n2️⃣ Nataka marekebisho ya nguo\n3️⃣ Naomba bei/makadirio\n4️⃣ Nataka kuona mifano ya kazi (catalogue)\n5️⃣ Nafuatilia oda yangu\n6️⃣ Naomba kuzungumza na fundi moja kwa moja\n\nAndika namba au niambie unahitaji nini kwa maneno yako mwenyewe.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const sessionId = 'demo-user-phone';

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Sync business config with agent engine
  useEffect(() => {
    if (agentEngine) {
      agentEngine.updateConfig(businessConfig);
    }
  }, [businessConfig, agentEngine]);

  const handleSend = (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = agentEngine.processMessage(sessionId, textToSend, existingOrders);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      // Check if session has draft ready to convert to order
      const session = agentEngine.getSession(sessionId);
      if (session.step === 'COMPLETED' && session.orderDraft.order_id) {
        onNewOrderCreated(session.orderDraft);
      }
    }, 1000);
  };

  const handleReset = () => {
    agentEngine.resetSession(sessionId);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Karibu sana kwa *${businessConfig.business_name}*! 👗✂️\nMimi ni *${businessConfig.bot_name}*, msaidizi wako wa kidijitali.\n\nNingependa kukusaidiaje leo?\n1️⃣ Nataka kushonewa nguo mpya\n2️⃣ Nataka marekebisho ya nguo\n3️⃣ Naomba bei/makadirio\n4️⃣ Nataka kuona mifano ya kazi (catalogue)\n5️⃣ Nafuatilia oda yangu\n6️⃣ Naomba kuzungumza na fundi moja kwa moja`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }
    ]);
  };

  // Format markdown bold *text* to <strong>text</strong>
  const renderMessageText = (txt) => {
    if (!txt) return '';
    const formatted = txt.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return <span dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br/>') }} />;
  };

  const activeSession = agentEngine ? agentEngine.getSession(sessionId) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-2 sm:p-4">
      {/* Mobile Phone Mockup */}
      <div className="w-full lg:w-[440px] flex-shrink-0">
        <div className="bg-slate-900 border-4 border-slate-700 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[720px] relative">
          {/* Phone Speaker Notch */}
          <div className="bg-slate-800 h-5 w-full flex justify-center items-center">
            <div className="w-16 h-2 bg-slate-950 rounded-full"></div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-[#005c4b] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-950 border border-amber-300">
                  ZF
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#005c4b] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">{businessConfig.business_name || "Zawadi Fashion"}</h3>
                <p className="text-xs text-emerald-100 opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {businessConfig.bot_name} • Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-emerald-100">
              <Video className="w-5 h-5 cursor-pointer hover:text-white" />
              <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
              <RotateCcw className="w-4 h-4 cursor-pointer hover:text-white" onClick={handleReset} title="Reset Chat" />
            </div>
          </div>

          {/* Chat Wallpaper Area */}
          <div className="flex-1 wa-wallpaper overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="bg-[#1e293b] text-slate-300 text-[11px] px-3 py-1 rounded-md shadow-sm border border-slate-700">
                🔒 Lock & End-to-End Encrypted Demo
              </span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-md leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                  }`}
                >
                  {renderMessageText(m.text)}
                  <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    <span>{m.time}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 bg-[#202c33] text-slate-300 px-4 py-2.5 rounded-2xl rounded-tl-none w-fit border border-slate-700/50">
                <span className="text-xs font-medium text-emerald-400">Amina Assistant inateka...</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Triggers Bar */}
          <div className="bg-[#111b21] border-t border-slate-800 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            <button onClick={() => handleSend('1')} className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-xs rounded-full whitespace-nowrap flex items-center gap-1">
              👗 1. Oda Mpya
            </button>
            <button onClick={() => handleSend('2')} className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-amber-200 text-xs rounded-full whitespace-nowrap flex items-center gap-1">
              ✂️ 2. Marekebisho
            </button>
            <button onClick={() => handleSend('3')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-full whitespace-nowrap">
              💵 3. Bei
            </button>
            <button onClick={() => handleSend('4')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-full whitespace-nowrap">
              📸 4. Portfolio
            </button>
            <button onClick={() => handleSend('5')} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-full whitespace-nowrap">
              📦 5. Status
            </button>
            <button onClick={() => handleSend('6')} className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 text-rose-200 text-xs rounded-full whitespace-nowrap">
              📞 6. Fundi Direct
            </button>
          </div>

          {/* Input Area */}
          <div className="bg-[#111b21] p-2.5 flex items-center gap-2 border-t border-slate-800">
            <button 
              onClick={openMeasurementModal}
              title="Fungua Mwongozo wa Kujipima"
              className="p-2 text-amber-400 hover:bg-slate-800 rounded-full transition-colors"
            >
              <Ruler className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Andika ujumbe wako..."
              className="flex-1 bg-[#2a3942] text-slate-100 placeholder-slate-400 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-[#00a884] hover:bg-[#008f70] text-slate-950 rounded-full shadow-lg transition-transform active:scale-95"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Live Inspector & Agent State Drawer */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Active Session Status & Order JSON Schema preview */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-100 font-heading">AI Conversation State & Order JSON</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              State: {activeSession?.step || 'IDLE'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Hapa ndipo taarifa zinazokusanywa na <strong>Amina Assistant</strong> kupitia WhatsApp zinapobadilishwa kuwa muundo wa <strong>JSON Schema</strong> rasmi (Section 7) kwa ajili ya kuhifadhiwa kwenye Database au CRM ya Fundi:
          </p>

          {/* JSON Schema Display */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[360px] shadow-inner">
            <pre>{JSON.stringify(activeSession?.orderDraft || {}, null, 2)}</pre>
          </div>

          <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Garment: <strong>{activeSession?.orderDraft?.garment_type || 'Bado hajachagua'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Deadline: <strong>{activeSession?.orderDraft?.deadline || 'Bado'}</strong></span>
            </div>
          </div>
        </div>

        {/* Test Quick Scenarios Helper */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Jaribu Mtiririko wa Mazungumzo (Quick Test Scenarios):
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => handleSend('Nataka kushonewa gauni la harusi la gold')}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left text-slate-300 flex items-center justify-between group"
            >
              <span>1️⃣ Anza Oda ya Gauni la Harusi</span>
              <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSend('Naomba kurekebisha zip na kiuno cha suruali')}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left text-slate-300 flex items-center justify-between group"
            >
              <span>2️⃣ Jaribu Oda ya Marekebisho</span>
              <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSend('Fuatilia oda #ZF2026-014')}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-left text-slate-300 flex items-center justify-between group"
            >
              <span>3️⃣ Ufuatiliaji wa Oda #ZF2026-014</span>
              <ArrowRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleSend('Nataka pesa zangu zote zirudishwe sasa hivi')}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-rose-900/60 rounded-xl text-xs text-left text-rose-300 flex items-center justify-between group"
            >
              <span>4️⃣ Escalation (Malalamiko Makubwa)</span>
              <ArrowRight className="w-4 h-4 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
