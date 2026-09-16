// Servio Global Command Palette (Ctrl + K)

import React, { useState, useEffect } from 'react';
import { Search, X, BedDouble, Users, Calendar, UtensilsCrossed, Warehouse, ArrowRight } from 'lucide-react';
import { Room, Guest, Reservation, MenuItem, InventoryItem, ActiveTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  guests: Guest[];
  reservations: Reservation[];
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  onSelectTab: (tab: ActiveTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  rooms,
  guests,
  reservations,
  menuItems,
  inventory,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRooms = query.trim()
    ? rooms.filter((r) => r.roomNumber.includes(query) || r.currentGuestName?.toLowerCase().includes(query.toLowerCase()))
    : rooms.slice(0, 3);

  const filteredGuests = query.trim()
    ? guests.filter((g) => `${g.firstName} ${g.lastName}`.toLowerCase().includes(query.toLowerCase()) || g.phone.includes(query))
    : guests.slice(0, 3);

  const filteredMenuItems = query.trim()
    ? menuItems.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.code.toLowerCase().includes(query.toLowerCase()))
    : menuItems.slice(0, 3);

  const filteredInventory = query.trim()
    ? inventory.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.sku.toLowerCase().includes(query.toLowerCase()))
    : inventory.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rooms, guests, menu items, stock SKUs..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Rooms Section */}
          {filteredRooms.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BedDouble size={14} /> Rooms ({filteredRooms.length})
              </h4>
              <div className="space-y-1">
                {filteredRooms.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectTab('rooms');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {r.roomNumber}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{r.roomTypeName}</p>
                        <p className="text-[11px] text-slate-500">
                          {r.occupancyStatus === 'OCCUPIED' ? `Guest: ${r.currentGuestName}` : 'Vacant'} • Status: {r.status}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guests Section */}
          {filteredGuests.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users size={14} /> Guests ({filteredGuests.length})
              </h4>
              <div className="space-y-1">
                {filteredGuests.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      onSelectTab('guests');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {g.firstName} {g.lastName} {g.isVip && <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">VIP</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">{g.phone} • {g.email}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POS Menu Section */}
          {filteredMenuItems.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UtensilsCrossed size={14} /> POS Menu Items ({filteredMenuItems.length})
              </h4>
              <div className="space-y-1">
                {filteredMenuItems.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectTab('pos');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{m.name}</p>
                      <p className="text-[11px] text-slate-500">{m.categoryName} • {m.price.toLocaleString()} KES</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Items Section */}
          {filteredInventory.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Warehouse size={14} /> Pantry Inventory ({filteredInventory.length})
              </h4>
              <div className="space-y-1">
                {filteredInventory.map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      onSelectTab('pantry');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{i.name} ({i.sku})</p>
                      <p className="text-[11px] text-slate-500">Stock: {i.currentStock} {i.uom} • Location: {i.location}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Use <strong>Esc</strong> to exit</span>
          <span>Servio Enterprise Search</span>
        </div>
      </div>
    </div>
  );
};
