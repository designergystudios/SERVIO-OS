// Servio Guests Directory View

import React, { useState } from 'react';
import { Search, UserPlus, Star, Phone, Mail, FileText, Sparkles, Building2 } from 'lucide-react';
import { Guest } from '../../types';

interface GuestsViewProps {
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
}

export const GuestsView: React.FC<GuestsViewProps> = ({ guests, onAddGuest }) => {
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(guests[0] || null);

  const filtered = guests.filter(
    (g) =>
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.idNumber.includes(search)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Left 2 Cols: Guests List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, passport, or ID number..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((guest) => (
              <div
                key={guest.id}
                onClick={() => setSelectedGuest(guest)}
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between ${
                  selectedGuest?.id === guest.id ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {guest.firstName[0]}
                    {guest.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {guest.firstName} {guest.lastName}
                      </h4>
                      {guest.isVip && (
                        <span className="px-2 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {guest.nationality} • ID: {guest.idNumber} ({guest.idType.replace('_', ' ')})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-xs text-slate-800">
                    {guest.totalSpent.toLocaleString()} KES
                  </span>
                  <span className="block text-[11px] text-slate-400">{guest.totalStays} total stays</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Col: Guest Detailed Profile Panel */}
      {selectedGuest && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-md mb-3">
              {selectedGuest.firstName[0]}
              {selectedGuest.lastName[0]}
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">
              {selectedGuest.firstName} {selectedGuest.lastName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{selectedGuest.nationality} Guest</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-400">
                <Phone size={14} /> Phone:
              </span>
              <span className="font-semibold text-slate-800">{selectedGuest.phone}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-400">
                <Mail size={14} /> Email:
              </span>
              <span className="font-semibold text-slate-800">{selectedGuest.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2 text-slate-400">
                <FileText size={14} /> Identification:
              </span>
              <span className="font-semibold text-slate-800">
                {selectedGuest.idNumber} ({selectedGuest.idType})
              </span>
            </div>
          </div>

          {/* Notes */}
          {selectedGuest.notes && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles size={13} /> Preferences & Notes:
              </span>
              <p className="text-[11px] leading-relaxed">{selectedGuest.notes}</p>
            </div>
          )}

          {/* Historical Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Stays</span>
              <p className="text-lg font-extrabold text-slate-800">{selectedGuest.totalStays}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Lifetime Revenue</span>
              <p className="text-lg font-extrabold text-emerald-600">
                {selectedGuest.totalSpent.toLocaleString()} KES
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
