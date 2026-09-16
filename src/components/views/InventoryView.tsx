// Servio Pantry & Inventory Stock Management View

import React, { useState } from 'react';
import { Warehouse, AlertTriangle, Search, Plus, ArrowDownRight, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
}

interface WastageRecord {
  id: string;
  itemName: string;
  quantity: number;
  uom: string;
  reason: 'EXPIRED' | 'BURNT' | 'SPOILAGE' | 'SPILLAGE';
  staffName: string;
  cost: number;
  date: string;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onUpdateStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'STOCK' | 'WASTAGE'>('STOCK');
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjQuantity, setAdjQuantity] = useState('');

  // Wastage Modal
  const [wastageItem, setWastageItem] = useState<InventoryItem | null>(null);
  const [wastageQty, setWastageQty] = useState('2');
  const [wastageReason, setWastageReason] = useState<'EXPIRED' | 'BURNT' | 'SPOILAGE' | 'SPILLAGE'>('EXPIRED');
  const [wastageStaff, setWastageStaff] = useState('Chef James');

  const [wastageLogs, setWastageLogs] = useState<WastageRecord[]>([
    { id: 'w-01', itemName: 'Prime Beef Sirloin', quantity: 2.5, uom: 'KG', reason: 'SPOILAGE', staffName: 'Chef James', cost: 2375, date: '2026-09-15' },
    { id: 'w-02', itemName: 'Fresh Idaho Potatoes', quantity: 10, uom: 'KG', reason: 'EXPIRED', staffName: 'Chef James', cost: 1200, date: '2026-09-14' },
  ]);

  const filtered = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = locationFilter === 'ALL' || item.location === locationFilter;
    return matchesSearch && matchesLoc;
  });

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    const qty = Number(adjQuantity);
    if (!isNaN(qty)) {
      onUpdateStock(adjustingItem.id, qty);
    }
    setAdjustingItem(null);
  };

  const handleRecordWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageItem) return;
    const qty = Number(wastageQty);
    if (!isNaN(qty)) {
      const newStock = Math.max(0, wastageItem.currentStock - qty);
      onUpdateStock(wastageItem.id, newStock);
      const cost = qty * wastageItem.costPrice;
      const record: WastageRecord = {
        id: `w-${Date.now()}`,
        itemName: wastageItem.name,
        quantity: qty,
        uom: wastageItem.uom,
        reason: wastageReason,
        staffName: wastageStaff,
        cost,
        date: new Date().toISOString().slice(0, 10),
      };
      setWastageLogs([record, ...wastageLogs]);
    }
    setWastageItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Filter Bar & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STOCK' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Inventory Stock Ledger ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('WASTAGE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'WASTAGE' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Food Wastage & Spoilage Logs ({wastageLogs.length})
          </button>
        </div>

        {activeTab === 'STOCK' && (
          <div className="flex items-center gap-3 flex-1 max-w-xl justify-end">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ingredient SKU..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
              />
            </div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">All Locations</option>
              <option value="Main Store">Main Store</option>
              <option value="Kitchen Pantry">Kitchen Pantry</option>
              <option value="Bar Store">Bar Store</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'STOCK' ? (
        /* Stock Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">SKU / Item</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Current Stock</th>
                  <th className="px-6 py-3.5">Cost / UOM</th>
                  <th className="px-6 py-3.5">Total Valuation</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const valuation = item.currentStock * item.costPrice;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-slate-800">{item.name}</p>
                        <p className="font-mono text-[10px] text-slate-400">{item.sku}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 text-slate-600">{item.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-800">
                            {item.currentStock} {item.uom}
                          </span>
                          {isLow && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                              <AlertTriangle size={10} /> LOW STOCK
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">Min Threshold: {item.minStock} {item.uom}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {item.costPrice.toLocaleString()} KES / {item.uom}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-emerald-600">
                        {valuation.toLocaleString()} KES
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setWastageItem(item);
                            setWastageQty('1');
                          }}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold border border-amber-200"
                        >
                          Log Wastage
                        </button>
                        <button
                          onClick={() => {
                            setAdjustingItem(item);
                            setAdjQuantity(item.currentStock.toString());
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold border border-slate-200"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Wastage Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Item Name</th>
                <th className="px-6 py-3.5">Quantity Wasted</th>
                <th className="px-6 py-3.5">Reason</th>
                <th className="px-6 py-3.5">Logged By</th>
                <th className="px-6 py-3.5 text-right">Financial Loss (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {wastageLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-500">{log.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{log.itemName}</td>
                  <td className="px-6 py-4 font-bold text-amber-900">
                    {log.quantity} {log.uom}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      {log.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{log.staffName}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-amber-700">
                    {log.cost.toLocaleString()} KES
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-800">
              Manual Stock Adjustment: {adjustingItem.name}
            </h3>
            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  New Quantity ({adjustingItem.uom})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={adjQuantity}
                  onChange={(e) => setAdjQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Wastage Modal */}
      {wastageItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-800">
              Record Kitchen Wastage: {wastageItem.name}
            </h3>
            <form onSubmit={handleRecordWastage} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Quantity Wasted ({wastageItem.uom})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={wastageQty}
                  onChange={(e) => setWastageQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Wastage Reason
                </label>
                <select
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white outline-none"
                >
                  <option value="EXPIRED">Expired Stock</option>
                  <option value="BURNT">Kitchen Cooking Error / Burnt</option>
                  <option value="SPOILAGE">Storage Spoilage</option>
                  <option value="SPILLAGE">Spillage / Damaged Package</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWastageItem(null)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Log Wastage Loss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

