// Servio Kitchen Display System (KDS) View

import React, { useState } from 'react';
import { CookingPot, Clock, CheckCircle2, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { KdsTicket, KdsStatus } from '../../types';

interface KdsViewProps {
  tickets: KdsTicket[];
  onUpdateTicketStatus: (ticketId: string, status: KdsStatus) => void;
}

export const KdsView: React.FC<KdsViewProps> = ({ tickets, onUpdateTicketStatus }) => {
  const [stationFilter, setStationFilter] = useState('ALL');

  const stations = ['ALL', 'Hot Kitchen Station', 'Grill Station', 'Bar Station'];

  const filteredTickets = tickets.filter(
    (t) => stationFilter === 'ALL' || t.stationName === stationFilter
  );

  const columns: { status: KdsStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'New Tickets', color: 'border-amber-400 bg-amber-500/10' },
    { status: 'PREPARING', label: 'In Preparation', color: 'border-emerald-400 bg-emerald-500/10' },
    { status: 'READY', label: 'Ready for Service', color: 'border-emerald-500 bg-emerald-500/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Station Filter Header */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <CookingPot size={22} />
          </div>
          <div>
            <h2 className="font-extrabold text-base tracking-wide">KITCHEN DISPLAY SYSTEM</h2>
            <p className="text-xs text-slate-400">Live order tickets synced with POS & Room Service</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl outline-none"
          >
            {stations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Kanban Workflow Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-200 text-xs tracking-wider uppercase flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.color}`}></span>
                  {col.label}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets Stack */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTickets.map((ticket) => {
                  const isUrgent = ticket.elapsedMinutes > 15;

                  return (
                    <div
                      key={ticket.id}
                      className={`p-4 rounded-xl border text-white transition-all space-y-3 ${
                        isUrgent
                          ? 'bg-amber-950/40 border-amber-600/80 shadow-lg shadow-amber-900/20'
                          : 'bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                        <div>
                          <span className="font-mono font-extrabold text-sm text-amber-400">
                            {ticket.ticketNumber}
                          </span>
                          <span className="block text-[11px] font-bold text-slate-300">
                            {ticket.locationInfo}
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              isUrgent
                                ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            <Clock size={10} className="inline mr-1" />
                            {ticket.elapsedMinutes} MINS
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1.5 text-xs">
                        {ticket.items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between">
                            <span className="font-bold text-slate-100">
                              {item.quantity}x {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-[10px] text-amber-400 italic">
                                ({item.notes})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-2">
                        {col.status === 'NEW' && (
                          <button
                            onClick={() => onUpdateTicketStatus(ticket.id, 'PREPARING')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all"
                          >
                            Start Preparing
                          </button>
                        )}
                        {col.status === 'PREPARING' && (
                          <button
                            onClick={() => onUpdateTicketStatus(ticket.id, 'READY')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all"
                          >
                            Mark Ready
                          </button>
                        )}
                        {col.status === 'READY' && (
                          <button
                            onClick={() => onUpdateTicketStatus(ticket.id, 'COMPLETED')}
                            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-extrabold text-xs rounded-lg transition-all"
                          >
                            Served / Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
