// Servio Visual Room Cards Grid View

import React, { useState } from 'react';
import { BedDouble, Sparkles, AlertTriangle, CheckCircle, User, ShieldAlert, Edit3 } from 'lucide-react';
import { Room, RoomStatus } from '../../types';

interface RoomsViewProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({ rooms, onUpdateRoomStatus }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CLEAN' | 'DIRTY' | 'INSPECTED' | 'OUT_OF_SERVICE'>('ALL');

  const filtered = rooms.filter((r) => filterType === 'ALL' || r.status === filterType);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['ALL', 'CLEAN', 'DIRTY', 'INSPECTED', 'OUT_OF_SERVICE'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterType(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {rooms.length} Rooms
        </span>
      </div>

      {/* Visual Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((room) => {
          const isOccupied = room.occupancyStatus === 'OCCUPIED';

          return (
            <div
              key={room.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                isOccupied
                  ? 'bg-white border-emerald-300 ring-2 ring-emerald-500/10'
                  : room.status === 'DIRTY'
                  ? 'bg-amber-50/40 border-amber-300'
                  : room.status === 'OUT_OF_SERVICE'
                  ? 'bg-slate-100/80 border-slate-300 opacity-75'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Card Top Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {room.roomNumber}
                  </span>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        isOccupied
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {room.occupancyStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Floor {room.floor}</span>
                  </div>
                </div>

                {/* Room Info */}
                <h4 className="font-bold text-slate-800 text-sm">{room.roomTypeName}</h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {room.nightlyRate.toLocaleString()} KES / night
                </p>

                {/* Guest / Housekeeper detail */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  {isOccupied ? (
                    <div className="flex items-center gap-2 text-slate-700">
                      <User size={14} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold truncate">
                        Guest: {room.currentGuestName || 'Assigned Guest'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px]">Vacant & Ready</div>
                  )}

                  {room.assignedHousekeeper && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Sparkles size={13} className="text-amber-500 shrink-0" />
                      <span>Cleaner: {room.assignedHousekeeper}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Controls */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    room.status === 'CLEAN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : room.status === 'DIRTY'
                      ? 'bg-amber-100 text-amber-800'
                      : room.status === 'INSPECTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {room.status}
                </span>

                {/* Quick Status Toggle buttons */}
                <div className="flex items-center gap-1">
                  {room.status === 'DIRTY' && (
                    <button
                      onClick={() => onUpdateRoomStatus(room.id, 'CLEAN')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs"
                    >
                      Mark Clean
                    </button>
                  )}
                  {room.status === 'CLEAN' && (
                    <button
                      onClick={() => onUpdateRoomStatus(room.id, 'INSPECTED')}
                      className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs"
                    >
                      Inspect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
