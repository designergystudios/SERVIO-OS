// Servio Reservations & Stay Calendar View

import React, { useState } from 'react';
import { Plus, Search, Calendar, Filter, UserCheck, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { Reservation, Room } from '../../types';

interface ReservationsViewProps {
  reservations: Reservation[];
  rooms: Room[];
  onCheckInGuest: (resId: string) => void;
  onOpenFolio: (folioId?: string) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  rooms,
  onCheckInGuest,
  onOpenFolio,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dates = ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by guest name, reservation #, or room..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'LIST' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'CALENDAR' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
            >
              Calendar Grid
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'LIST' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Reservation #</th>
                  <th className="px-6 py-3.5">Guest Info</th>
                  <th className="px-6 py-3.5">Room</th>
                  <th className="px-6 py-3.5">Stay Dates</th>
                  <th className="px-6 py-3.5">Total (KES)</th>
                  <th className="px-6 py-3.5">Deposit Paid</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {res.reservationNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{res.guestName}</p>
                      <p className="text-[11px] text-slate-500">{res.guestPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">Room {res.roomNumber}</span>
                      <span className="block text-[10px] text-slate-400">{res.roomTypeName}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {res.checkInDate} → {res.checkOutDate}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">
                      {res.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {res.depositPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          res.status === 'CHECKED_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'CONFIRMED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {res.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {res.status === 'CONFIRMED' && (
                        <button
                          onClick={() => onCheckInGuest(res.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs"
                        >
                          Check In
                        </button>
                      )}
                      {res.folioId && (
                        <button
                          onClick={() => onOpenFolio(res.folioId)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200"
                        >
                          Guest Folio
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Stay Calendar Grid */
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs overflow-x-auto space-y-4">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 font-bold text-xs text-slate-600 border-b border-slate-200 pb-3">
              <div className="col-span-1 text-slate-400 uppercase">Room</div>
              {dates.map((d) => (
                <div key={d} className="col-span-1 text-center bg-slate-50 py-1 rounded-lg">
                  {d.slice(5)}
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {rooms.map((rm) => {
                const roomRes = reservations.find((r) => r.roomNumber === rm.roomNumber);
                return (
                  <div key={rm.id} className="grid grid-cols-8 gap-2 py-3 items-center">
                    <div className="col-span-1 font-extrabold text-xs text-slate-800 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px]">
                        {rm.roomNumber}
                      </span>
                      <span className="truncate text-[11px]">{rm.roomTypeName}</span>
                    </div>

                    {dates.map((d) => {
                      const isBooked = roomRes && d >= roomRes.checkInDate && d <= roomRes.checkOutDate;
                      return (
                        <div
                          key={d}
                          className={`col-span-1 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                            isBooked
                              ? roomRes?.status === 'CHECKED_IN'
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-amber-400 text-slate-900 shadow-xs'
                              : 'bg-slate-50 text-slate-300'
                          }`}
                        >
                          {isBooked ? roomRes?.guestName.split(' ')[0] : ''}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
