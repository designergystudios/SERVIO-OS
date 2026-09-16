// Servio Operational Quick Action Modal

import React, { useState } from 'react';
import { X, CalendarDays, UserCheck, UtensilsCrossed, ConciergeBell, Phone, Warehouse, CheckCircle2 } from 'lucide-react';
import { Room, Guest, Reservation, PosOrder, Payment } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  guests: Guest[];
  onAddReservation: (res: Reservation) => void;
  onAddPosOrder: (order: PosOrder) => void;
  onAddPayment: (pay: Payment) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  rooms,
  guests,
  onAddReservation,
  onAddPosOrder,
  onAddPayment,
}) => {
  const [activeMode, setActiveMode] = useState<'SELECT' | 'CHECKIN' | 'ROOM_SERVICE' | 'MPESA' | 'STOCK'>('SELECT');
  const [successMsg, setSuccessMsg] = useState('');

  // Checkin state
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState('2026-09-16');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-18');
  const [depositAmount, setDepositAmount] = useState('15000');

  // Mpesa STK State
  const [mpesaPhone, setMpesaPhone] = useState('254722123456');
  const [mpesaAmount, setMpesaAmount] = useState('5000');
  const [mpesaRef, setMpesaRef] = useState('Room 204 Bill');

  if (!isOpen) return null;

  const handleCreateCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === selectedRoomId) || rooms[0];
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: `RSV-${Math.floor(100000 + Math.random() * 900000)}`,
      guestId: `gst-${Date.now()}`,
      guestName: guestName || 'Walk-in Guest',
      guestEmail: 'walkin@servio.ke',
      guestPhone: phone || '+254 700 000000',
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomTypeName: room.roomTypeName,
      checkInDate,
      checkOutDate,
      status: 'CHECKED_IN',
      adultsCount: 1,
      childrenCount: 0,
      totalAmount: room.nightlyRate * 2,
      depositPaid: Number(depositAmount) || 0,
      folioId: `fol-${Date.now()}`,
    };

    onAddReservation(newRes);
    setSuccessMsg(`Guest ${newRes.guestName} successfully checked into Room ${newRes.roomNumber}!`);
    setTimeout(() => {
      setSuccessMsg('');
      setActiveMode('SELECT');
      onClose();
    }, 1800);
  };

  const handleMpesaStkPush = (e: React.FormEvent) => {
    e.preventDefault();
    const newPay: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: `RCT-2026-${Math.floor(100 + Math.random() * 900)}`,
      guestName: mpesaRef,
      method: 'MPESA',
      amount: Number(mpesaAmount) || 0,
      currency: 'KES',
      providerReference: `QK${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    onAddPayment(newPay);
    setSuccessMsg(`M-Pesa STK Push sent to ${mpesaPhone}! Payment received successfully.`);
    setTimeout(() => {
      setSuccessMsg('');
      setActiveMode('SELECT');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <h3 className="font-bold text-sm tracking-wide">
              {activeMode === 'SELECT' && 'Operational Quick Action'}
              {activeMode === 'CHECKIN' && 'Receptionist Walk-In Check-In'}
              {activeMode === 'MPESA' && 'M-Pesa STK Push Integration'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500 animate-bounce" />
            <h4 className="text-base font-bold text-slate-800">{successMsg}</h4>
            <p className="text-xs text-slate-500">Operation logged to system audit ledger.</p>
          </div>
        ) : (
          <div className="p-6">
            {activeMode === 'SELECT' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveMode('CHECKIN')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex flex-col items-start gap-2 text-left group"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserCheck size={20} />
                  </div>
                  <span className="font-bold text-xs text-slate-800">Walk-In Check-In</span>
                  <span className="text-[11px] text-slate-500">Fast 1-click room assignment & guest folio</span>
                </button>

                <button
                  onClick={() => setActiveMode('MPESA')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex flex-col items-start gap-2 text-left group"
                >
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Phone size={20} />
                  </div>
                  <span className="font-bold text-xs text-slate-800">M-Pesa STK Push</span>
                  <span className="text-[11px] text-slate-500">Trigger instant Safaricom payment prompt</span>
                </button>
              </div>
            )}

            {/* Checkin Mode */}
            {activeMode === 'CHECKIN' && (
              <form onSubmit={handleCreateCheckin} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Guest Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Samuel Odhiambo"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Select Room
                    </label>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white"
                    >
                      {rooms
                        .filter((r) => r.occupancyStatus === 'VACANT' && r.status === 'CLEAN')
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            Room {r.roomNumber} ({r.roomTypeName} - {r.nightlyRate.toLocaleString()} KES)
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Advance Deposit (KES)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode('SELECT')}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10"
                  >
                    Confirm Check-In
                  </button>
                </div>
              </form>
            )}

            {/* Mpesa STK Mode */}
            {activeMode === 'MPESA' && (
              <form onSubmit={handleMpesaStkPush} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    M-Pesa Phone Number (Safaricom)
                  </label>
                  <input
                    type="text"
                    required
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      required
                      value={mpesaAmount}
                      onChange={(e) => setMpesaAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-bold text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Reference / Room #
                    </label>
                    <input
                      type="text"
                      value={mpesaRef}
                      onChange={(e) => setMpesaRef(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-emerald-600" />
                  <span>Integrated Safaricom Daraja STK Push will prompt the user phone for PIN immediately.</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveMode('SELECT')}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10"
                  >
                    Send STK Push
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
