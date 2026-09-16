// Servio Housekeeping & Maintenance Management View

import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';
import { Room, RoomStatus } from '../../types';

interface HousekeepingViewProps {
  rooms: Room[];
  onUpdateRoomStatus: (roomId: string, newStatus: RoomStatus) => void;
}

export const HousekeepingView: React.FC<HousekeepingViewProps> = ({ rooms, onUpdateRoomStatus }) => {
  const dirtyRooms = rooms.filter((r) => r.status === 'DIRTY');
  const cleanRooms = rooms.filter((r) => r.status === 'CLEAN');
  const inspectedRooms = rooms.filter((r) => r.status === 'INSPECTED');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-800">Pending Cleaning</span>
            <p className="text-2xl font-extrabold text-amber-900">{dirtyRooms.length} Rooms</p>
          </div>
          <AlertTriangle size={32} className="text-amber-500" />
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-800">Cleaned & Ready</span>
            <p className="text-2xl font-extrabold text-emerald-900">{cleanRooms.length} Rooms</p>
          </div>
          <Sparkles size={32} className="text-emerald-500" />
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-800">Inspected / QC Passed</span>
            <p className="text-2xl font-extrabold text-emerald-900">{inspectedRooms.length} Rooms</p>
          </div>
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
      </div>

      {/* Housekeeper Operational Task List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Active Cleaning Assignments</h3>

        <div className="divide-y divide-slate-100">
          {dirtyRooms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              All rooms are currently cleaned and inspected!
            </div>
          ) : (
            dirtyRooms.map((room) => (
              <div key={room.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center">
                    {room.roomNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{room.roomTypeName}</h4>
                    <p className="text-xs text-slate-500">
                      Assigned to: {room.assignedHousekeeper || 'Unassigned Housekeeper'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'CLEAN')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Sparkles size={14} /> Mark Cleaning Completed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
