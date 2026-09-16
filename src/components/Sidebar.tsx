// Servio Navigation Sidebar Component

import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  BedDouble,
  Users,
  UserCheck,
  Sparkles,
  UtensilsCrossed,
  ReceiptText,
  CookingPot,
  Warehouse,
  BookOpenCheck,
  Truck,
  CreditCard,
  FileText,
  PieChart,
  UserCog,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hotel,
  ConciergeBell,
  Package,
  Layers,
  ArrowRightLeft,
  Building2,
  Globe,
} from 'lucide-react';
import { ActiveTab, HotelierProperty } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  kdsCount: number;
  lowStockCount: number;
  activeHotelier?: HotelierProperty;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  kdsCount,
  lowStockCount,
  activeHotelier,
}) => {
  const sections = [
    {
      title: 'SAAS PLATFORM',
      items: [
        { id: 'saas-admin' as ActiveTab, label: 'SaaS Super Admin', icon: Building2 },
      ],
    },
    {
      title: 'HOTEL PMS',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reservations' as ActiveTab, label: 'Reservations', icon: CalendarDays },
        { id: 'calendar' as ActiveTab, label: 'Stay Calendar', icon: Calendar },
        { id: 'rooms' as ActiveTab, label: 'Room Grid', icon: BedDouble },
        { id: 'guests' as ActiveTab, label: 'Guest Profiles', icon: Users },
        { id: 'checkin-checkout' as ActiveTab, label: 'Check-In / Out', icon: UserCheck },
        { id: 'housekeeping' as ActiveTab, label: 'Housekeeping', icon: Sparkles },
      ],
    },
    {
      title: 'RESTAURANT & POS',
      items: [
        { id: 'pos' as ActiveTab, label: 'POS Register', icon: UtensilsCrossed },
        { id: 'orders' as ActiveTab, label: 'POS Orders', icon: ReceiptText },
        { id: 'room-service' as ActiveTab, label: 'Room Service', icon: ConciergeBell },
        { id: 'menu' as ActiveTab, label: 'Menu Catalog', icon: Layers },
      ],
    },
    {
      title: 'KITCHEN KDS',
      items: [
        { id: 'kds' as ActiveTab, label: 'Kitchen Display', icon: CookingPot, badge: kdsCount },
      ],
    },
    {
      title: 'INVENTORY & RECIPES',
      items: [
        { id: 'pantry' as ActiveTab, label: 'Pantry / Stock', icon: Warehouse, badge: lowStockCount, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
        { id: 'recipes' as ActiveTab, label: 'BOM Recipes', icon: BookOpenCheck },
        { id: 'suppliers' as ActiveTab, label: 'Suppliers & POs', icon: Truck },
      ],
    },
    {
      title: 'FINANCE & FOLIOS',
      items: [
        { id: 'folios' as ActiveTab, label: 'Guest Folios', icon: FileText },
        { id: 'payments' as ActiveTab, label: 'Payments & M-Pesa', icon: CreditCard },
        { id: 'expenses' as ActiveTab, label: 'Expense Logs', icon: ArrowRightLeft },
      ],
    },
    {
      title: 'REPORTS & ADMIN',
      items: [
        { id: 'reports' as ActiveTab, label: 'Analytics & RevPAR', icon: PieChart },
        { id: 'staff' as ActiveTab, label: 'Staff & RBAC', icon: UserCog },
        { id: 'audit-logs' as ActiveTab, label: 'Audit Logs', icon: ShieldCheck },
        { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-[#121824] text-slate-300 border-r border-slate-800/80 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header & Hotelier Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          {activeHotelier?.logoUrl ? (
            <img
              src={activeHotelier.logoUrl}
              alt={activeHotelier.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md shrink-0 bg-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-900/40 shrink-0">
              S
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-white tracking-wide text-xs truncate">
                {activeHotelier?.name || 'SERVIO'}
              </span>
              <span className="text-[9px] text-emerald-400 font-extrabold tracking-widest uppercase truncate">
                {activeHotelier?.city || 'HOSPITALITY SAAS'}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.badgeColor || 'bg-emerald-500 text-slate-950 font-bold'
                      } ${collapsed ? 'absolute top-1 right-1 px-1 py-0.5 text-[9px]' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs border border-slate-700 shrink-0">
            GM
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium text-slate-200 truncate">
                Robert K.
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                General Manager
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
