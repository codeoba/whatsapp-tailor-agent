import React, { useState } from 'react';
import { Sparkles, Plus, Image as ImageIcon, Tag, Send, Check } from 'lucide-react';

export default function CatalogueManager({ catalogueItems, onAddCatalogueItem }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Harusi & Sherehe',
    description: '',
    price: '',
    image: '',
    tags: ''
  });

  const categories = ['All', 'Harusi & Sherehe', 'Kiofisi', 'Kitenge & Batiki', 'Mavazi ya Kitamaduni', 'Marekebisho'];

  const filteredItems = filterCategory === 'All'
    ? catalogueItems
    : catalogueItems.filter(item => item.category === filterCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) return;
    
    onAddCatalogueItem({
      id: `CAT-0${catalogueItems.length + 1}`,
      title: newItem.title,
      category: newItem.category,
      description: newItem.description,
      price: Number(newItem.price),
      image: newItem.image || 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80',
      tags: newItem.tags ? newItem.tags.split(',').map(t => t.trim()) : ['Custom']
    });

    setNewItem({ title: '', category: 'Harusi & Sherehe', description: '', price: '', image: '', tags: '' });
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Catalogue & Portfolio ya Mitindo (Fashion Portfolio)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Weka na simamia picha za nguo ulizoshona za kutuma kwa wateja kupitia WhatsApp
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          Ongeza Design Mpya
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col group hover:border-amber-500/40 transition-all">
            <div className="relative h-56 bg-slate-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30">
                {item.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-950/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-emerald-300 border border-emerald-500/40 shadow-md">
                TZS {item.price.toLocaleString()}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                {item.tags?.map(t => (
                  <span key={t} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100 font-heading">Ongeza Design Mpya Kwenye Catalogue</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Jina la Design / Mtindo:</label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Gauni la Kitenge cha Ankara with Ruffles"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Kipengele (Category):</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Harusi & Sherehe">Harusi & Sherehe</option>
                    <option value="Kiofisi">Kiofisi</option>
                    <option value="Kitenge & Batiki">Kitenge & Batiki</option>
                    <option value="Mavazi ya Kitamaduni">Mavazi ya Kitamaduni</option>
                    <option value="Marekebisho">Marekebisho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Bei ya Makadirio (TZS):</label>
                  <input
                    type="number"
                    required
                    placeholder="65000"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Maelezo Mafupi:</label>
                <textarea
                  rows="3"
                  placeholder="Maelezo ya vitambaa vinavyofaa, nakshi za mikono, n.k."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Image URL (Au achana nayo itatumia default):</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full bg-slate-950 text-slate-100 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Hifadhi Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
