// Servio Finance, Folios, Invoices & Payments View

import React, { useState } from 'react';
import { FileText, CreditCard, Receipt, Printer, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GuestFolio, Payment, Expense, HotelierProperty } from '../../types';

interface FinanceViewProps {
  folios: GuestFolio[];
  payments: Payment[];
  expenses: Expense[];
  activeHotelier?: HotelierProperty;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ folios, payments, expenses, activeHotelier }) => {
  const [activeTab, setActiveTab] = useState<'FOLIOS' | 'PAYMENTS' | 'EXPENSES'>('FOLIOS');
  const [selectedFolio, setSelectedFolio] = useState<GuestFolio | null>(folios[0] || null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('FOLIOS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FOLIOS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Guest Folios ({folios.length})
          </button>
          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PAYMENTS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            M-Pesa & Card Receipts ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'EXPENSES' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Operating Expenses ({expenses.length})
          </button>
        </div>
      </div>

      {activeTab === 'FOLIOS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folio Master List */}
          <div className="space-y-3">
            {folios.map((folio) => (
              <div
                key={folio.id}
                onClick={() => setSelectedFolio(folio)}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  selectedFolio?.id === folio.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/10'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs text-slate-800">
                    {folio.folioNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    Room {folio.roomNumber}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">{folio.guestName}</h4>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Balance Due:</span>
                  <span className="font-extrabold text-amber-700">
                    {folio.balance.toLocaleString()} KES
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Folio Statement Detail */}
          {selectedFolio && (
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    STATEMENT: {selectedFolio.folioNumber}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    {selectedFolio.guestName} (Room {selectedFolio.roomNumber})
                  </h3>
                </div>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
                >
                  <Printer size={15} /> Print Official Invoice
                </button>
              </div>

              {/* Items Ledger */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedFolio.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-slate-500 font-mono">{item.date}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{item.description}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {item.type}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-extrabold ${
                            item.amount < 0 ? 'text-emerald-600' : 'text-slate-800'
                          }`}
                        >
                          {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-slate-500">Total Charges: </span>
                  <span className="text-slate-800">{selectedFolio.totalCharges.toLocaleString()} KES</span>
                </div>
                <div>
                  <span className="text-slate-500">Payments: </span>
                  <span className="text-emerald-600">{selectedFolio.totalPayments.toLocaleString()} KES</span>
                </div>
                <div>
                  <span className="text-slate-500">Net Outstanding: </span>
                  <span className="text-amber-700 text-sm">{selectedFolio.balance.toLocaleString()} KES</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'PAYMENTS' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Receipt #</th>
                <th className="px-6 py-3.5">Payer / Guest</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">M-Pesa Ref</th>
                <th className="px-6 py-3.5">Amount (KES)</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{p.receiptNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{p.guestName || 'Walk-in'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      {p.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                    {p.providerReference || 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">
                    {p.amount.toLocaleString()} KES
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Expense Date</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5">Approved By</th>
                <th className="px-6 py-3.5 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500 font-mono">{e.expenseDate}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{e.category}</td>
                  <td className="px-6 py-4 text-slate-700">{e.description}</td>
                  <td className="px-6 py-4 text-slate-600">{e.approvedBy}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                    {e.amount.toLocaleString()} KES
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showPrintModal && selectedFolio && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                {activeHotelier?.logoUrl ? (
                  <img
                    src={activeHotelier.logoUrl}
                    alt={activeHotelier.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                ) : null}
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {activeHotelier?.name || 'SERVIO HOTEL & RESORT'}
                  </h2>
                  <p className="text-xs text-slate-500">OFFICIAL TAX INVOICE / GUEST FOLIO</p>
                </div>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-slate-400 font-bold uppercase">Guest Information</p>
                <p className="font-extrabold text-slate-800 text-sm">{selectedFolio.guestName}</p>
                <p className="text-slate-600">Room Number: {selectedFolio.roomNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold uppercase">Invoice Details</p>
                <p className="font-mono font-bold text-slate-800">{selectedFolio.folioNumber}</p>
                <p className="text-slate-600">Issued: 2026-09-16</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {selectedFolio.items.map((i) => (
                <div key={i.id} className="py-2 flex justify-between">
                  <span>{i.description}</span>
                  <span className="font-mono font-bold">{i.amount.toLocaleString()} KES</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 text-right space-y-1">
              <p className="text-xs text-slate-500">Total Outstanding Balance</p>
              <p className="text-2xl font-extrabold text-emerald-600">
                {selectedFolio.balance.toLocaleString()} KES
              </p>
            </div>

            <button
              onClick={() => {
                alert('Sent invoice to connected printer!');
                setShowPrintModal(false);
              }}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Confirm Print Statement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
