// Servio Purchasing & Supplier Management View

import React, { useState } from 'react';
import { Truck, FileCheck, Plus, Search, CheckCircle2 } from 'lucide-react';
import { Supplier, PurchaseOrder } from '../../types';

interface PurchasingViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
}

export const PurchasingView: React.FC<PurchasingViewProps> = ({
  suppliers,
  purchaseOrders,
}) => {
  const [activeTab, setActiveTab] = useState<'POS' | 'SUPPLIERS'>('POS');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('POS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'POS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('SUPPLIERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SUPPLIERS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Suppliers Directory ({suppliers.length})
          </button>
        </div>
      </div>

      {activeTab === 'POS' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">PO Number</th>
                <th className="px-6 py-3.5">Supplier</th>
                <th className="px-6 py-3.5">Issued Date</th>
                <th className="px-6 py-3.5">Expected Delivery</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{po.poNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{po.supplierName}</td>
                  <td className="px-6 py-4 text-slate-600">{po.issuedDate}</td>
                  <td className="px-6 py-4 text-slate-600">{po.expectedDate}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">
                    {po.totalAmount.toLocaleString()} KES
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        po.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-800 text-sm">{sup.name}</h4>
                <span className="font-mono text-[10px] font-bold text-slate-400">PIN: {sup.taxId}</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <p>Contact: <span className="font-semibold text-slate-800">{sup.contactPerson}</span></p>
                <p>Phone: <span className="font-semibold text-slate-800">{sup.phone}</span></p>
                <p>Email: <span className="font-semibold text-slate-800">{sup.email}</span></p>
              </div>
              <div className="flex gap-1 pt-2">
                {sup.categories.map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
