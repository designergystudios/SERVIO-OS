// Servio Multi-Tenant SaaS Hospitality Platform - Main Application

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { QuickActionModal } from './components/QuickActionModal';
import { SaaSAuthPortal } from './components/auth/SaaSAuthPortal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ReservationsView } from './components/views/ReservationsView';
import { RoomsView } from './components/views/RoomsView';
import { GuestsView } from './components/views/GuestsView';
import { CheckInCheckOutView } from './components/views/CheckInCheckOutView';
import { HousekeepingView } from './components/views/HousekeepingView';
import { PosView } from './components/views/PosView';
import { KdsView } from './components/views/KdsView';
import { InventoryView } from './components/views/InventoryView';
import { RecipesView } from './components/views/RecipesView';
import { PurchasingView } from './components/views/PurchasingView';
import { FinanceView } from './components/views/FinanceView';
import { ReportsView } from './components/views/ReportsView';
import { StaffView } from './components/views/StaffView';
import { SettingsView } from './components/views/SettingsView';
import { SaasAdminView } from './components/views/SaasAdminView';

// Security & Tenant Isolation Engine
import { scopeToTenant } from './lib/tenantIsolation';

// Mock Data
import {
  INITIAL_HOTELIERS,
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_GUESTS,
  INITIAL_MENU_ITEMS,
  INITIAL_POS_ORDERS,
  INITIAL_KDS_TICKETS,
  INITIAL_INVENTORY,
  INITIAL_RECIPES,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_FOLIOS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_AUDIT_LOGS,
} from './mockData';

import {
  ActiveTab,
  UserRole,
  RoomStatus,
  KdsStatus,
  Reservation,
  PosOrder,
  KdsTicket,
  Payment,
  Guest,
  Tenant,
  AuthSession,
  AccountStatus,
  InventoryItem,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('GENERAL_MANAGER');

  // Light / Dark Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('servio_theme') as 'light' | 'dark') || 'light';
  });

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('servio_theme', nextTheme);
  };

  // SaaS Multi-Tenant & Security Authentication Session State
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_HOTELIERS);
  const [activeTenantId, setActiveTenantId] = useState<string>('hot-01');

  const [authSession, setAuthSession] = useState<AuthSession>({
    isAuthenticated: false,
    user: null,
    authDomain: null,
    activeTenant: null,
  });

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Operational State
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [posOrders, setPosOrders] = useState(INITIAL_POS_ORDERS);
  const [kdsTickets, setKdsTickets] = useState(INITIAL_KDS_TICKETS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [folios, setFolios] = useState(INITIAL_FOLIOS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Authentication Handlers
  const handleLoginAsHotelier = (tenantId: string, role: UserRole = 'GENERAL_MANAGER') => {
    const target = tenants.find((t) => t.id === tenantId) || tenants[0];
    setActiveTenantId(target.id);
    setActiveRole(role);
    setAuthSession({
      isAuthenticated: true,
      user: {
        id: `usr-${Date.now()}`,
        tenant_id: target.id,
        name: 'Hotelier User',
        email: target.email,
        role,
      },
      authDomain: 'HOTELIER',
      activeTenant: target,
    });
    setActiveTab('dashboard');
  };

  const handleLoginAsPlatformAdmin = () => {
    setActiveRole('PLATFORM_SUPER_ADMIN');
    setAuthSession({
      isAuthenticated: true,
      user: {
        id: 'usr-admin-01',
        tenant_id: 'system',
        name: 'SaaS Platform Admin',
        email: 'admin@serviosaas.com',
        role: 'PLATFORM_SUPER_ADMIN',
      },
      authDomain: 'PLATFORM_ADMIN',
      activeTenant: tenants[0],
    });
    setActiveTab('saas-admin');
  };

  const handleSignOut = () => {
    setAuthSession({
      isAuthenticated: false,
      user: null,
      authDomain: null,
      activeTenant: null,
    });
  };

  // SaaS Super Admin Lifecycle Handlers
  const handleAddTenant = (newTenant: Tenant) => {
    setTenants([newTenant, ...tenants]);
    setActiveTenantId(newTenant.id);
  };

  const handleUpdateTenantStatus = (tenantId: string, status: AccountStatus) => {
    setTenants(
      tenants.map((t) =>
        t.id === tenantId
          ? {
              ...t,
              account_status: status,
              suspended_at: status === 'SUSPENDED' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const handleRemoveTenant = (tenantId: string) => {
    setTenants(
      tenants.map((t) =>
        t.id === tenantId
          ? { ...t, account_status: 'ARCHIVED', deleted_at: new Date().toISOString() }
          : t
      )
    );
  };

  const handleUpdateTenantBranding = (
    tenantId: string,
    logoUrl: string,
    primaryColor?: string,
    secondaryColor?: string
  ) => {
    setTenants(
      tenants.map((t) =>
        t.id === tenantId
          ? {
              ...t,
              logo_url: logoUrl,
              primary_color: primaryColor || t.primary_color,
              secondary_color: secondaryColor || t.secondary_color,
            }
          : t
      )
    );
  };

  const handleSwitchTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
    const target = tenants.find((t) => t.id === tenantId);
    if (target) {
      setAuthSession((prev) => ({
        ...prev,
        activeTenant: target,
      }));
    }
  };

  // Operational Handlers
  const handleUpdateRoomStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
  };

  const handleUpdateKdsStatus = (ticketId: string, newStatus: KdsStatus) => {
    setKdsTickets(kdsTickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t)));
  };

  const handleCheckInGuest = (resId: string) => {
    setReservations(
      reservations.map((res) => {
        if (res.id === resId) {
          setRooms(
            rooms.map((rm) =>
              rm.id === res.roomId
                ? { ...rm, occupancyStatus: 'OCCUPIED', currentGuestName: res.guestName }
                : rm
            )
          );
          return { ...res, status: 'CHECKED_IN' };
        }
        return res;
      })
    );
  };

  const handleCheckOutGuest = (resId: string, folioId: string) => {
    setReservations(
      reservations.map((res) => {
        if (res.id === resId) {
          setRooms(
            rooms.map((rm) =>
              rm.id === res.roomId
                ? { ...rm, occupancyStatus: 'VACANT', status: 'DIRTY', currentGuestName: undefined }
                : rm
            )
          );
          return { ...res, status: 'CHECKED_OUT' };
        }
        return res;
      })
    );

    setFolios(folios.map((f) => (f.id === folioId ? { ...f, status: 'CLOSED', balance: 0 } : f)));
  };

  const handleAddReservation = (newRes: Reservation) => {
    const scopedRes = { ...newRes, tenant_id: activeTenantId };
    setReservations([scopedRes, ...reservations]);
    setRooms(
      rooms.map((rm) =>
        rm.id === newRes.roomId
          ? { ...rm, occupancyStatus: 'OCCUPIED', currentGuestName: newRes.guestName }
          : rm
      )
    );
  };

  const handleAddPosOrder = (newOrder: PosOrder) => {
    setPosOrders([{ ...newOrder, tenant_id: activeTenantId }, ...posOrders]);
  };

  const handleAddKdsTicket = (newTicket: KdsTicket) => {
    setKdsTickets([{ ...newTicket, tenant_id: activeTenantId }, ...kdsTickets]);
  };

  const handleAddPayment = (newPay: Payment) => {
    setPayments([{ ...newPay, tenant_id: activeTenantId }, ...payments]);
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setInventory(inventory.map((i) => (i.id === itemId ? { ...i, currentStock: newStock } : i)));
  };

  const handleAddGuest = (newGuest: Guest) => {
    setGuests([{ ...newGuest, tenant_id: activeTenantId }, ...guests]);
  };

  // Enforce Tenant Scoping on Active Data
  const tenantContext = {
    userId: authSession.user?.id || 'anonymous',
    tenantId: activeTenantId,
    role: activeRole,
    isPlatformAdmin: authSession.authDomain === 'PLATFORM_ADMIN',
  };

  const scopedRooms = scopeToTenant(rooms, tenantContext);
  const scopedReservations = scopeToTenant(reservations, tenantContext);
  const scopedGuests = scopeToTenant(guests, tenantContext);
  const scopedPosOrders = scopeToTenant(posOrders, tenantContext);
  const scopedKdsTickets = scopeToTenant(kdsTickets, tenantContext);
  const scopedInventory = scopeToTenant(inventory, tenantContext);
  const scopedFolios = scopeToTenant(folios, tenantContext);
  const scopedPayments = scopeToTenant(payments, tenantContext);
  const scopedExpenses = scopeToTenant(expenses, tenantContext);

  // Badge Counts
  const activeKdsCount = (scopedKdsTickets as KdsTicket[]).filter((t) => t.status !== 'COMPLETED').length;
  const lowStockCount = (scopedInventory as InventoryItem[]).filter((i) => i.currentStock <= i.minStock).length;

  const getTitleForTab = (tab: ActiveTab): string => {
    switch (tab) {
      case 'saas-admin': return 'SaaS Platform Super Admin Command Center';
      case 'dashboard': return 'Executive Management Dashboard';
      case 'reservations': return 'Reservations & Stay Directory';
      case 'calendar': return 'Stay Calendar Grid';
      case 'rooms': return 'Room Cards & Status Matrix';
      case 'guests': return 'Guest Profiles Directory';
      case 'checkin-checkout': return 'Reception Check-In / Out Hub';
      case 'housekeeping': return 'Housekeeping & Room Cleaning';
      case 'pos': return 'Tablet POS Register';
      case 'orders': return 'POS Restaurant Orders';
      case 'room-service': return 'Room Service Dispatch';
      case 'menu': return 'Menu Items Catalog';
      case 'kds': return 'Kitchen Display System (KDS)';
      case 'pantry': return 'Pantry Inventory & Stock';
      case 'ingredients': return 'Raw Ingredients Ledger';
      case 'recipes': return 'BOM Recipe Costing';
      case 'suppliers': return 'Suppliers & Purchase Orders';
      case 'purchasing': return 'Purchasing & Receiving';
      case 'wastage': return 'Wastage & Stock Spoilage';
      case 'payments': return 'Payments & M-Pesa Log';
      case 'folios': return 'Guest Folios Ledger';
      case 'invoices': return 'Tax Invoices & Billing';
      case 'receipts': return 'Receipt Archive';
      case 'expenses': return 'Operating Expenses';
      case 'reports': return 'RevPAR & Analytics Reports';
      case 'staff': return 'Staff & RBAC Matrix';
      case 'audit-logs': return 'Security Audit Ledger';
      case 'settings': return 'System Settings';
      default: return 'Servio Multi-Tenant SaaS Platform';
    }
  };

  // 1. Render SaaS Auth Landing Portal if unauthenticated
  if (!authSession.isAuthenticated) {
    return (
      <SaaSAuthPortal
        tenants={tenants}
        onLoginAsHotelier={handleLoginAsHotelier}
        onLoginAsPlatformAdmin={handleLoginAsPlatformAdmin}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  // 2. Render Authenticated Operational Platform
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#FAF8F5] text-slate-800'} font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        kdsCount={activeKdsCount}
        lowStockCount={lowStockCount}
        activeHotelier={activeTenant}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen ${
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          activeTabTitle={getTitleForTab(activeTab)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenQuickAction={() => setQuickActionOpen(true)}
          activeRole={activeRole}
          onChangeRole={setActiveRole}
          hoteliers={tenants}
          activeHotelier={activeTenant}
          onSwitchHotelier={handleSwitchTenant}
          onSignOut={handleSignOut}
          authDomain={authSession.authDomain}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* View Component Renderer */}
        <main className="flex-1 p-6">
          {activeTab === 'saas-admin' && (
            <SaasAdminView
              tenants={tenants}
              activeTenantId={activeTenantId}
              onAddTenant={handleAddTenant}
              onUpdateTenantStatus={handleUpdateTenantStatus}
              onRemoveTenant={handleRemoveTenant}
              onUpdateTenantBranding={handleUpdateTenantBranding}
              onSwitchTenant={handleSwitchTenant}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              rooms={scopedRooms}
              reservations={scopedReservations}
              posOrders={scopedPosOrders}
              kdsTickets={scopedKdsTickets}
              inventory={scopedInventory}
              folios={scopedFolios}
              onNavigateTab={setActiveTab}
            />
          )}

          {(activeTab === 'reservations' || activeTab === 'calendar') && (
            <ReservationsView
              reservations={scopedReservations}
              rooms={scopedRooms}
              onCheckInGuest={handleCheckInGuest}
              onOpenFolio={() => setActiveTab('folios')}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomsView rooms={scopedRooms} onUpdateRoomStatus={handleUpdateRoomStatus} />
          )}

          {activeTab === 'guests' && (
            <GuestsView guests={scopedGuests} onAddGuest={handleAddGuest} />
          )}

          {activeTab === 'checkin-checkout' && (
            <CheckInCheckOutView
              reservations={scopedReservations}
              rooms={scopedRooms}
              folios={scopedFolios}
              onCheckIn={handleCheckInGuest}
              onCheckOut={handleCheckOutGuest}
              onAddPayment={handleAddPayment}
            />
          )}

          {activeTab === 'housekeeping' && (
            <HousekeepingView rooms={scopedRooms} onUpdateRoomStatus={handleUpdateRoomStatus} />
          )}

          {(activeTab === 'pos' || activeTab === 'orders' || activeTab === 'menu' || activeTab === 'room-service') && (
            <PosView
              menuItems={menuItems}
              rooms={scopedRooms}
              onAddPosOrder={handleAddPosOrder}
              onAddKdsTicket={handleAddKdsTicket}
            />
          )}

          {activeTab === 'kds' && (
            <KdsView tickets={scopedKdsTickets} onUpdateTicketStatus={handleUpdateKdsStatus} />
          )}

          {(activeTab === 'pantry' || activeTab === 'ingredients' || activeTab === 'wastage') && (
            <InventoryView inventory={scopedInventory} onUpdateStock={handleUpdateStock} />
          )}

          {activeTab === 'recipes' && <RecipesView recipes={recipes} />}

          {(activeTab === 'suppliers' || activeTab === 'purchasing') && (
            <PurchasingView suppliers={suppliers} purchaseOrders={purchaseOrders} />
          )}

          {(activeTab === 'folios' || activeTab === 'payments' || activeTab === 'expenses' || activeTab === 'invoices' || activeTab === 'receipts') && (
            <FinanceView folios={scopedFolios} payments={scopedPayments} expenses={scopedExpenses} activeHotelier={activeTenant} />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {(activeTab === 'staff' || activeTab === 'audit-logs') && (
            <StaffView auditLogs={auditLogs} />
          )}

          {activeTab === 'settings' && (
            <SettingsView activeHotelier={activeTenant} onUpdateLogo={(id, url) => handleUpdateTenantBranding(id, url)} />
          )}
        </main>
      </div>

      {/* Global Command Search Palette */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        rooms={scopedRooms}
        guests={scopedGuests}
        reservations={scopedReservations}
        menuItems={menuItems}
        inventory={scopedInventory}
        onSelectTab={setActiveTab}
      />

      {/* Quick Action Operational Modal */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        rooms={scopedRooms}
        guests={scopedGuests}
        onAddReservation={handleAddReservation}
        onAddPosOrder={handleAddPosOrder}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
}
