import React, { useState, useMemo } from 'react';
import { MessageSquare, Scissors, Sparkles, Settings, Terminal, Server, Users } from 'lucide-react';
import { DEFAULT_BUSINESS_INFO, INITIAL_CATALOGUE, INITIAL_ORDERS } from './data/initialData';
import { MultiAgentOrchestrator } from './services/multiAgentOrchestrator';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import OrderManager from './components/OrderManager';
import CatalogueManager from './components/CatalogueManager';
import BusinessSettings from './components/BusinessSettings';
import SystemPromptExporter from './components/SystemPromptExporter';
import MeasurementGuideModal from './components/MeasurementGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [businessConfig, setBusinessConfig] = useState(DEFAULT_BUSINESS_INFO);
  const [catalogueItems, setCatalogueItems] = useState(INITIAL_CATALOGUE);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);

  // Initialize Multi-Agent Orchestrator
  const agentEngine = useMemo(() => new MultiAgentOrchestrator(businessConfig), []);

  const handleSaveConfig = (newConfig) => {
    setBusinessConfig(newConfig);
    agentEngine.updateConfig(newConfig);
  };

  const handleNewOrderCreated = (orderDraft) => {
    const newOrder = {
      order_id: orderDraft.order_id || `ZF2026-${Math.floor(100 + Math.random() * 900)}`,
      customer_name: orderDraft.customer_name || "Mteja wa WhatsApp",
      customer_phone: orderDraft.customer_phone || "+255 700 000 000",
      garment_type: orderDraft.garment_type || "Nguo Mpya",
      design_notes: orderDraft.design_notes || "Mtindo uliotumwa",
      fabric: orderDraft.fabric || "Kitambaa cha duka/cha kwake",
      color: orderDraft.color || "Kama picha",
      measurements: orderDraft.measurements || { bust: "90", waist: "72", hip: "100", shoulder: "40", sleeve_length: "55", garment_length: "140" },
      deadline: orderDraft.deadline || "Siku 7 zijazo",
      estimated_price: orderDraft.estimated_price || "60,000 TZS",
      deposit_paid: orderDraft.deposit_req || "30,000 TZS",
      balance_due: orderDraft.balance_due || "30,000 TZS",
      delivery_method: orderDraft.delivery_method || "pickup",
      delivery_address: orderDraft.delivery_address || "Studio Kinondoni",
      status: "received",
      notes: "Oda imeingia kupitia WhatsApp Multi-Agent Suite"
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddCatalogueItem = (newItem) => {
    setCatalogueItems(prev => [newItem, ...prev]);
  };

  const subAgentsList = [
    { name: businessConfig.bot_name || "Amina Assistant", role: "Receptionist & Intake", avatar: "👗", desc: "Kupokea mteja & kusajili oda" },
    { name: "Neema Stylist", role: "Fashion Stylist", avatar: "✨", desc: "Ushauri wa mitindo & catalogue" },
    { name: "Beti Measurements", role: "Measurement Expert", avatar: "📏", desc: "Mwongozo wa kujipima nyumbani" },
    { name: "Baraka Payments", role: "Finance & Quotes", avatar: "💳", desc: "Makadirio ya bei & Lipa Namba" },
    { name: "Furaha Tracking", role: "Order Status Tracker", avatar: "📦", desc: "Ufuatiliaji wa hatua za kazi" },
    { name: "Fundi Zawadi", role: "Human Tailor Handoff", avatar: "✂️", desc: "Kushughulikia mazungumzo magumu" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-lg shadow-amber-500/20">
              👗
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight font-heading text-slate-100 flex items-center gap-2">
                {businessConfig.business_name || "Zawadi Fashion House"}
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
                  <Users className="w-3 h-3" /> Multi-Agent Active (6 Sub-Agents)
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Multi-Agent Tailor Automation & WhatsApp CRM Architecture
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs font-semibold">
            <button
              onClick={() => setShowMeasurementModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              📏 Mwongozo wa Vipimo
            </button>
            <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
              Lipa Namba: <strong className="text-emerald-400">{businessConfig.payments?.mpesa_lipa}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto no-scrollbar border-t border-slate-800/60 pt-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp Multi-Agent Simulator
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Usimamizi wa Oda (CRM)
            <span className="bg-amber-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] border border-amber-800/60 font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'agents'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            Multi-Agents List (6 Sub-Agents)
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'catalogue'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Catalogue & Portfolio
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            Mipangilio ya Duka
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-amber-500 text-amber-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Terminal className="w-4 h-4" />
            System Prompt
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 py-6">
        {activeTab === 'simulator' && (
          <WhatsAppSimulator
            agentEngine={agentEngine}
            businessConfig={businessConfig}
            existingOrders={orders}
            onNewOrderCreated={handleNewOrderCreated}
            openMeasurementModal={() => setShowMeasurementModal(true)}
          />
        )}

        {activeTab === 'orders' && (
          <OrderManager
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddNewOrderClick={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'agents' && (
          <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
              <h2 className="text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-400" />
                Muundo wa Multi-Agent System (6 Sub-Agents Specialized System)
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Kila mteja anapoongea kwenye WhatsApp, <strong>Multi-Agent Orchestrator</strong> inahamisha mawasiliano kiotomatiki kwenda kwa Agent anayehusika kulingana na swali au hatua ya oda:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subAgentsList.map((ag, idx) => (
                <div key={idx} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 bg-slate-950 rounded-2xl border border-slate-800">{ag.avatar}</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
                      Sub-Agent #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100">{ag.name}</h3>
                    <p className="text-xs font-semibold text-emerald-400">{ag.role}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {ag.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'catalogue' && (
          <CatalogueManager
            catalogueItems={catalogueItems}
            onAddCatalogueItem={handleAddCatalogueItem}
          />
        )}

        {activeTab === 'settings' && (
          <BusinessSettings
            config={businessConfig}
            onSaveConfig={handleSaveConfig}
          />
        )}

        {activeTab === 'prompt' && (
          <SystemPromptExporter config={businessConfig} />
        )}
      </main>

      {/* Measurement Modal */}
      {showMeasurementModal && (
        <MeasurementGuideModal onClose={() => setShowMeasurementModal(false)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>© 2026 {businessConfig.business_name || "Zawadi Fashion House"}. Built with Multi-Agent WhatsApp Architecture.</p>
      </footer>
    </div>
  );
}
