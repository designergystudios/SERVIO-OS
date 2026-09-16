// Servio Receptionist Check-In & Check-Out Hub View

import React, { useState } from 'react';
import { UserCheck, UserX, Receipt, CheckCircle2, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { Reservation, Room, GuestFolio, Payment } from '../../types';

interface CheckInCheckOutViewProps {
  reservations: Reservation[];
  rooms: Room[];
  folios: GuestFolio[];
  onCheckIn: (resId: string) => void;
  onCheckOut: (resId: string, folioId: string) => void;
  onAddPayment: (pay: Payment) => void;
}

export const CheckInCheckOutView: React.FC<CheckInCheckOutViewProps> = ({
  reservations,
  rooms,
  folios,
  onCheckIn,
  onCheckOut,
  onAddPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'ARRIVALS' | 'DEPARTURES'>('ARRIVALS');
  const [selectedFolio, setSelectedFolio] = useState<GuestFolio | null>(null);
  const [settlementSuccess, setSettlementSuccess] = useState('');

  const arrivals = reservations.filter((r) => r.status === 'CONFIRMED');
  const departures = reservations.filter((r) => r.status === 'CHECKED_IN');

  const handleSettleAndCheckOut = (res: Reservation) => {
    if (!res.folioId) return;
    const folio = folios.find((f) => f.id === res.folioId);
    if (folio && folio.balance > 0) {
      // Record settling payment
      const pay: Payment = {
        id: `pay-${Date.now()}`,
        receiptNumber: `RCT-2026-${Math.floor(100 + Math.random() * 900)}`,
        guestName: res.guestName,
        roomNumber: res.roomNumber,
        method: 'MPESA',
        amount: folio.balance,
        currency: 'KES',
        providerReference: `QK${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      };
      onAddPayment(pay);
    }
    onCheckOut(res.id, res.folioId);
    setSettlementSuccess(`Folio for ${res.guestName} settled & Room ${res.roomNumber} checked out!`);
    setTimeout(() => setSettlementSuccess(''), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ARRIVALS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'ARRIVALS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck size={16} /> Pending Arrivals ({arrivals.length})
          </button>
          <button
            onClick={() => setActiveTab('DEPARTURES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'DEPARTURES'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/10'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserX size={16} /> Today's Check-Outs ({departures.length})
          </button>
        </div>
      </div>

      {settlementSuccess && (
        <div className="p-4 bg-emerald-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 size={18} /> {settlementSuccess}
        </div>
      )}

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'ARRIVALS' ? (
          arrivals.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {res.reservationNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">{res.guestName}</h3>
                    <p className="text-xs text-slate-500">{res.guestPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-slate-800">
                      Room {res.roomNumber}
                    </span>
                    <p className="text-[10px] text-slate-400">{res.roomTypeName}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-in Date:</span>
                    <span className="font-semibold">{res.checkInDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Rate:</span>
                    <span className="font-bold text-slate-800">{res.totalAmount.toLocaleString()} KES</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deposit Paid:</span>
                    <span className="font-bold text-emerald-600">{res.depositPaid.toLocaleString()} KES</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onCheckIn(res.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> Fast 1-Click Check In
              </button>
            </div>
          ))
        ) : (
          departures.map((res) => {
            const folio = folios.find((f) => f.id === res.folioId);
            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      Room {res.roomNumber} ({res.roomTypeName})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      In-House
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-base">{res.guestName}</h3>
                  <p className="text-xs text-slate-500">Checked In: {res.checkInDate}</p>

                  {folio && (
                    <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-amber-900 font-semibold">Total Folio Charges:</span>
                        <span className="font-bold">{folio.totalCharges.toLocaleString()} KES</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-900 font-semibold">Payments Received:</span>
                        <span className="font-bold text-emerald-700">{folio.totalPayments.toLocaleString()} KES</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-amber-200/60 font-extrabold text-sm">
                        <span>Balance Due:</span>
                        <span className={folio.balance > 0 ? 'text-amber-900' : 'text-emerald-700'}>
                          {folio.balance.toLocaleString()} KES
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSettleAndCheckOut(res)}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Receipt size={16} /> Settle Folio & Complete Check-Out
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
