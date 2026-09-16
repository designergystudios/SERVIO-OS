// Servio Top Header Component

import React from 'react';
import {
  Search,
  Plus,
  Bell,
  Building2,
  Clock,
  UserCheck2,
  ChevronDown,
  Sparkles,
  Building,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole, HotelierProperty } from '../types';

interface HeaderProps {
  activeTabTitle: string;
  onOpenSearch: () => void;
  onOpenQuickAction: () => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  hoteliers?: HotelierProperty[];
  activeHotelier?: HotelierProperty;
  onSwitchHotelier?: (id: string) => void;
  onSignOut?: () => void;
  authDomain?: 'PLATFORM_ADMIN' | 'HOTELIER' | null;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTabTitle,
  onOpenSearch,
  onOpenQuickAction,
  activeRole,
  onChangeRole,
  hoteliers = [],
  activeHotelier,
  onSwitchHotelier,
  onSignOut,
  authDomain,
  theme = 'light',
  onToggleTheme,
}) => {
  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'SAAS_SUPER_ADMIN', label: 'SaaS Platform Super Admin' },
    { role: 'SUPER_ADMIN', label: 'Hotelier / GM' },
    { role: 'RECEPTIONIST', label: 'Receptionist' },
    { role: 'WAITER', label: 'Waiter / POS Staff' },
    { role: 'CHEF', label: 'Chef / Kitchen KDS' },
    { role: 'STOREKEEPER', label: 'Storekeeper' },
    { role: 'ACCOUNTANT', label: 'Accountant' },
  ];

  return (
    <header className={`h-16 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-800'} border-b px-6 flex items-center justify-between sticky top-0 z-20 transition-colors shadow-xs`}>
      {/* Active Context Title & Hotelier Property Switcher */}
      <div className="flex items-center gap-3">
        {/* Hotelier Tenant Selector */}
        {hoteliers.length > 0 && onSwitchHotelier ? (
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 transition-all">
              {activeHotelier?.logoUrl ? (
                <img
                  src={activeHotelier.logoUrl}
                  alt={activeHotelier.name}
                  className="w-5 h-5 rounded-md object-cover border border-slate-300"
                />
              ) : (
                <Building2 size={16} className="text-emerald-600" />
              )}
              <span className="truncate max-w-[140px]">{activeHotelier?.name || 'Servio Hotel'}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Hotelier Tenant
              </div>
              {hoteliers.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onSwitchHotelier(h.id)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                    activeHotelier?.id === h.id ? 'font-extrabold text-emerald-700 bg-emerald-50/60' : 'text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <img src={h.logoUrl} alt={h.name} className="w-5 h-5 rounded object-cover border" />
                    <span className="truncate">{h.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${h.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {h.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Servio Multi-Tenant SaaS
            </span>
          </div>
        )}

        <span className="text-slate-300">/</span>
        <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          {activeTabTitle}
        </h1>
      </div>

      {/* Center Command Palette Bar */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-slate-500 text-xs w-72 transition-all shadow-2xs"
      >
        <Search size={15} className="text-slate-400" />
        <span className="flex-1 text-left truncate">
          Search rooms, guests, orders...
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded-md text-slate-500 shadow-2xs">
          Ctrl+K
        </kbd>
      </button>

      {/* Right Action Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher for Testing */}
        <div className="relative group hidden lg:block">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer">
            <UserCheck2 size={14} className="text-emerald-600" />
            <span>Role: {activeRole.replace('_', ' ')}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
          <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
              Switch Perspective
            </div>
            {roleOptions.map((opt) => (
              <button
                key={opt.role}
                onClick={() => onChangeRole(opt.role)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                  activeRole === opt.role ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Currency / Time Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-xl text-xs font-semibold">
          <span>KES</span>
          <span className="text-amber-300">|</span>
          <Clock size={13} className="text-amber-600" />
          <span>Africa/Nairobi</span>
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenSearch}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        {/* Light / Dark Mode Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-2 px-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
              theme === 'dark'
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 shadow-xs'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-slate-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        )}

        {/* Primary Operational Action */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>Quick Action</span>
        </button>

        {/* Sign Out to SaaS Portal */}
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-extrabold text-xs rounded-xl border border-slate-700 transition-all"
            title="Sign out and return to SaaS Landing Portal"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};
