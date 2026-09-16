// Servio Management & Executive Dashboard View

import React from 'react';
import {
  BedDouble,
  TrendingUp,
  ReceiptText,
  CookingPot,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Sparkles,
  Users,
  Building2,
  CalendarDays,
  UtensilsCrossed,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Room, Reservation, PosOrder, KdsTicket, InventoryItem, GuestFolio, ActiveTab } from '../../types';

interface DashboardViewProps {
  rooms: Room[];
  reservations: Reservation[];
  posOrders: PosOrder[];
  kdsTickets: KdsTicket[];
  inventory: InventoryItem[];
  folios: GuestFolio[];
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rooms,
  reservations,
  posOrders,
  kdsTickets,
  inventory,
  folios,
  onNavigateTab,
}) => {
  // KPI Calculations
  const occupiedRooms = rooms.filter((r) => r.occupancyStatus === 'OCCUPIED').length;
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const todayRevenue = folios.reduce((acc, f) => acc + f.totalCharges, 0) + posOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const posSalesTotal = posOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const activeKdsCount = kdsTickets.filter((k) => k.status !== 'COMPLETED').length;
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;
  const pendingCheckins = reservations.filter((r) => r.status === 'CONFIRMED').length;

  // Chart Mock Data
  const revenueTrend = [
    { day: 'Mon', pms: 45000, pos: 18000 },
    { day: 'Tue', pms: 52000, pos: 22000 },
    { day: 'Wed', pms: 48000, pos: 24000 },
    { day: 'Thu', pms: 61000, pos: 31000 },
    { day: 'Fri', pms: 85000, pos: 42000 },
    { day: 'Sat', pms: 94000, pos: 58000 },
    { day: 'Sun', pms: 72000, pos: 39000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles size={14} />
              <span>Hospitality Executive Intelligence</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Good Morning, General Manager
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nairobi Property • {occupancyRate}% Occupancy • KES {todayRevenue.toLocaleString()} Revenue Logged Today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('checkin-checkout')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Check-In / Out Hub
            </button>
            <button
              onClick={() => onNavigateTab('pos')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              Open POS Register
            </button>
          </div>
        </div>
      </div>

      {/* Primary 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Occupancy % */}
        <div
          onClick={() => onNavigateTab('rooms')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Occupancy</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BedDouble size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-800">{occupancyRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-bold text-emerald-600">{occupiedRooms}</span> of {totalRooms} rooms occupied
          </div>
        </div>

        {/* Total Today Revenue */}
        <div
          onClick={() => onNavigateTab('folios')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-800">
            {todayRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">KES</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-0.5">
            <ArrowUpRight size={12} /> +14.2% vs last week
          </div>
        </div>

        {/* POS Sales */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">POS Sales</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-800">
            {posSalesTotal.toLocaleString()} <span className="text-xs text-slate-400 font-normal">KES</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {posOrders.length} restaurant orders logged
          </div>
        </div>

        {/* Active KDS Tickets */}
        <div
          onClick={() => onNavigateTab('kds')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kitchen KDS</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CookingPot size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-800">{activeKdsCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Active tickets in kitchen
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => onNavigateTab('pantry')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-600">{lowStockCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Requires restock reorder
          </div>
        </div>

        {/* Pending Check-ins */}
        <div
          onClick={() => onNavigateTab('reservations')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Arrivals</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users size={16} />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-800">{pendingCheckins}</div>
          <div className="text-[11px] text-slate-500 mt-1">Confirmed guest arrivals</div>
        </div>
      </div>

      {/* Main Content Grid: Charts & Room Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Weekly Revenue Performance</h3>
              <p className="text-xs text-slate-400">Hotel PMS Charges vs. Restaurant POS Revenue (KES)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Hotel PMS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Restaurant POS</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="pmsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="pms" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#pmsGrad)" />
                <Area type="monotone" dataKey="pos" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#posGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Live Room Grid Matrix Quick View */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Room Status Overview</h3>
            <button
              onClick={() => onNavigateTab('rooms')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Grid →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 flex-1">
            {rooms.map((rm) => {
              const isOccupied = rm.occupancyStatus === 'OCCUPIED';
              const isClean = rm.status === 'CLEAN';
              return (
                <div
                  key={rm.id}
                  onClick={() => onNavigateTab('rooms')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isOccupied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                      : rm.status === 'DIRTY'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  title={`${rm.roomNumber} - ${rm.roomTypeName} (${rm.status})`}
                >
                  <span className="font-extrabold text-xs">{rm.roomNumber}</span>
                  <span className="text-[9px] font-medium opacity-80 uppercase tracking-tighter truncate w-full">
                    {isOccupied ? rm.currentGuestName?.split(' ')[0] : rm.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status Legend */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Occupied
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span> Vacant
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Dirty
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Arrivals & Kitchen Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Arrivals & Departures */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Today's Arrivals & Stays</h3>
            <span className="text-xs text-slate-400">Receptionist Desk</span>
          </div>
          <div className="divide-y divide-slate-100">
            {reservations.slice(0, 3).map((res) => (
              <div key={res.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {res.roomNumber}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{res.guestName}</p>
                    <p className="text-[11px] text-slate-500">
                      {res.roomTypeName} • {res.checkInDate} to {res.checkOutDate}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    res.status === 'CHECKED_IN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {res.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Kitchen KDS Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Active Kitchen Tickets</h3>
            <button
              onClick={() => onNavigateTab('kds')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              Open KDS Screen →
            </button>
          </div>
          <div className="space-y-2">
            {kdsTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{ticket.ticketNumber}</span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      • {ticket.locationInfo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {ticket.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      ticket.status === 'PREPARING'
                        ? 'bg-amber-100 text-amber-800'
                        : ticket.status === 'READY'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {ticket.elapsedMinutes} mins ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
