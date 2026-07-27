import React, { useState } from 'react';
import { Scissors, CheckCircle2, Clock, Truck, Plus, Eye, Download, Search, Filter, Phone, User, Calendar, DollarSign, Ruler, FileCode, Check } from 'lucide-react';

export default function OrderManager({ orders, onUpdateOrderStatus, onAddNewOrderClick }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusColumns = [
    { id: 'received', title: 'Imepokelewa', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'cutting', title: '✂️ Inakatwa (Cutting)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'sewing', title: '🧵 Inashonwa (Sewing)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'finishing', title: '🎀 Inamaliziwa (Finishing)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'ready', title: '📦 Tayari Kuchukuliwa', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'delivered', title: '🚚 Imeshakabidhiwa', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.garment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `orders_zawadi_fashion_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 font-heading flex items-center gap-2">
            <Scissors className="w-6 h-6 text-amber-400" />
            Usimamizi wa Oda na Mchakato wa Ushonaji (CRM)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fuatilia na badilisha hatua za kazi za wateja walioweka oda kupitia WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            {viewMode === 'kanban' ? '📋 Onyesha kama Jedwali (Table)' : '📊 Onyesha Pipeline (Kanban)'}
          </button>

          <button
            onClick={exportJSON}
            className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON Data
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tafuta kwa jina la mteja, namba ya oda (#ZF2026-...), au aina ya nguo..."
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Hatua zote (All Statuses)</option>
            <option value="received">Imepokelewa</option>
            <option value="cutting">Inakatwa</option>
            <option value="sewing">Inashonwa</option>
            <option value="finishing">Inamaliziwa</option>
            <option value="ready">Tayari Kuchukuliwa</option>
            <option value="delivered">Imeshakabidhiwa</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {statusColumns.map(col => {
            const colOrders = filteredOrders.filter(o => o.status === col.id);
            return (
              <div key={col.id} className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800/80 flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3">
                  {colOrders.map(order => (
                    <div
                      key={order.order_id}
                      onClick={() => setSelectedOrder(order)}
                      className="bg-slate-950 hover:bg-slate-800/80 p-3.5 rounded-xl border border-slate-800 shadow-md cursor-pointer transition-all hover:border-amber-500/40 group flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                          #{order.order_id}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {order.deadline}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {order.customer_name}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-medium">
                        👗 {order.garment_type}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2 mt-1">
                        <span>Gharama: <strong>{order.estimated_price}</strong></span>
                        <span className="text-emerald-400 font-semibold">Adv: {order.deposit_paid}</span>
                      </div>
                    </div>
                  ))}

                  {colOrders.length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-xs italic">
                      Hamna oda kwenye hatua hii
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-heading uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Oda ID</th>
                  <th className="px-4 py-3">Mteja</th>
                  <th className="px-4 py-3">Aina ya Nguo</th>
                  <th className="px-4 py-3">Tarehe ya Tayari</th>
                  <th className="px-4 py-3">Makadirio</th>
                  <th className="px-4 py-3">Advance</th>
                  <th className="px-4 py-3">Hatua (Status)</th>
                  <th className="px-4 py-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map(order => (
                  <tr key={order.order_id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">#{order.order_id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{order.customer_name}</td>
                    <td className="px-4 py-3">{order.garment_type}</td>
                    <td className="px-4 py-3 text-slate-400">{order.deadline}</td>
                    <td className="px-4 py-3 font-medium">{order.estimated_price}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">{order.deposit_paid}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-700"
                      >
                        Tazama Taarifa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60">
                  Oda Namba #{selectedOrder.order_id}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1 font-heading">
                  {selectedOrder.customer_name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Change Status Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Badilisha Hatua ya Kazi (Status Update):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {statusColumns.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onUpdateOrderStatus(selectedOrder.order_id, s.id);
                      setSelectedOrder(prev => ({ ...prev, status: s.id }));
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      selectedOrder.status === s.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg ring-2 ring-amber-400/50'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{s.title}</span>
                    {selectedOrder.status === s.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Measurements Grid */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Vipimo vya Mteja (Measurements in cm):
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kifua (Bust)</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.bust || '-'} cm</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kiuno (Waist)</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.waist || '-'} cm</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Nyonga (Hip)</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.hip || '-'} cm</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Bega</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.shoulder || '-'} cm</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mkono</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.sleeve_length || '-'} cm</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Urefu</span>
                  <strong className="text-sm text-slate-100">{selectedOrder.measurements?.garment_length || '-'} cm</strong>
                </div>
              </div>
            </div>

            {/* Financial & Design Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-slate-200">Taarifa za Kazi & Kitambaa:</h5>
                <p><span className="text-slate-400">Aina:</span> <strong>{selectedOrder.garment_type}</strong></p>
                <p><span className="text-slate-400">Design Notes:</span> {selectedOrder.design_notes}</p>
                <p><span className="text-slate-400">Kitambaa:</span> {selectedOrder.fabric}</p>
                <p><span className="text-slate-400">Rangi:</span> {selectedOrder.color}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-slate-200">Malipo & Delivery:</h5>
                <p><span className="text-slate-400">Makadirio ya Bei:</span> <strong>{selectedOrder.estimated_price}</strong></p>
                <p><span className="text-slate-400">Advance Iliyolipwa:</span> <strong className="text-emerald-400">{selectedOrder.deposit_paid}</strong></p>
                <p><span className="text-slate-400">Salio Lililobaki:</span> <strong className="text-amber-400">{selectedOrder.balance_due}</strong></p>
                <p><span className="text-slate-400">Delivery:</span> {selectedOrder.delivery_method} ({selectedOrder.delivery_address})</p>
              </div>
            </div>

            {/* Complete Raw JSON Viewer */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400">
              <div className="text-slate-500 mb-1 flex items-center justify-between">
                <span>RAW JSON DATA (REST API & DB Payload):</span>
                <FileCode className="w-3.5 h-3.5" />
              </div>
              <pre className="overflow-x-auto max-h-32">{JSON.stringify(selectedOrder, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
