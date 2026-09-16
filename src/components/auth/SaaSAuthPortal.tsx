// Servio Multi-Tenant SaaS Landing & Authentication Portal

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe,
  DollarSign,
  Hotel,
  ShieldAlert,
  ChevronRight,
  Zap,
  Utensils,
  ChefHat,
  Receipt,
  PackageCheck,
  CreditCard,
  TrendingUp,
  Users,
  BarChart3,
  Check,
  SlidersHorizontal,
  Sun,
  Moon,
} from 'lucide-react';
import { Tenant, UserRole } from '../../types';

// Image Assets generated for Servio SaaS Landing (East Africa Context)
import heroPmsImg from '../../assets/images/hero_ea_hotel_pms_1789549270636.jpg';
import featurePosImg from '../../assets/images/feature_ea_pos_kds_1789549288162.jpg';
import featurePantryImg from '../../assets/images/feature_ea_pantry_1789549305250.jpg';
import featureFolioImg from '../../assets/images/feature_ea_folio_mpesa_1789549320139.jpg';
import featureSaasAdminImg from '../../assets/images/feature_ea_saas_admin_1789549335638.jpg';

interface SaaSAuthPortalProps {
  tenants: Tenant[];
  onLoginAsHotelier: (tenantId: string, role?: UserRole) => void;
  onLoginAsPlatformAdmin: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SaaSAuthPortal: React.FC<SaaSAuthPortalProps> = ({
  tenants,
  onLoginAsHotelier,
  onLoginAsPlatformAdmin,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [activeModal, setActiveModal] = useState<'HOTELIER' | 'ADMIN' | null>(null);
  const [activeTab, setActiveTab] = useState<'HOTELIER' | 'ADMIN'>('HOTELIER');
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id || 'hot-01');

  // Hotelier Auth Form
  const [hotelierEmail, setHotelierEmail] = useState('gm@servio.ke');
  const [hotelierPassword, setHotelierPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('GENERAL_MANAGER');

  // Platform Admin Auth Form
  const [adminEmail, setAdminEmail] = useState('admin@serviosaas.com');
  const [adminPassword, setAdminPassword] = useState('••••••••');

  const handleHotelierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAsHotelier(selectedTenantId, selectedRole);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAsPlatformAdmin();
  };

  const scrollToLogin = () => {
    const el = document.getElementById('login-portal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveModal('HOTELIER');
    }
  };

  // Feature Showcase Content
  const features = [
    {
      id: 'pms',
      title: 'Front Desk & Hotel PMS',
      subtitle: 'Seamless Reservations & Room Operations',
      image: heroPmsImg,
      icon: Hotel,
      badge: 'PROPERTY MANAGEMENT',
      description:
        'Manage room inventory, guest check-ins, reservations calendar, and housekeeping inspection statuses in real time across single or multi-property hotels.',
      bullets: [
        'Interactive Visual Room Matrix & Calendar View',
        'Express Check-In & Check-Out with ID Verification',
        'Automated Guest History, Preferences & VIP Tracking',
        'Housekeeping Cleaning & Inspection Workflows',
      ],
    },
    {
      id: 'pos-kds',
      title: 'Touch POS & Kitchen KDS',
      subtitle: 'High-Velocity Dining & Kitchen Dispatch',
      image: featurePosImg,
      icon: Utensils,
      badge: 'RESTAURANT & BAR',
      description:
        'Empower waiters with tablet order-taking and instant room charge transfers, paired with kitchen station displays for Hot Kitchen, Cold Kitchen, Bar, and Pastry.',
      bullets: [
        'Touchscreen Table & Room-Service Order Entry',
        'Direct Room Charge Posting to Guest Folio',
        'Real-Time Kitchen Display System (KDS) Status Timers',
        'Split Bills, Modifiers & Variant Pricing',
      ],
    },
    {
      id: 'pantry',
      title: 'Pantry Inventory & Recipe Costing',
      subtitle: 'Automated Stock Depletion & Margin Control',
      image: featurePantryImg,
      icon: PackageCheck,
      badge: 'INVENTORY & RECIPES',
      description:
        'Track ingredients and stock levels automatically. Every dish sold in the POS dynamically depletes kitchen inventory, warning storekeepers before stockouts occur.',
      bullets: [
        'Recipe Ingredient Yield & Food Cost Percentage',
        'Automated Depletion on POS Item Settlement',
        'Low-Stock Alerting & Supplier Purchase Orders',
        'Wastage & Goods Received Tracking',
      ],
    },
    {
      id: 'folios',
      title: 'Guest Folios & M-Pesa Payments',
      subtitle: 'Instant Billing & Automated STK Push',
      image: featureFolioImg,
      icon: CreditCard,
      badge: 'FINANCE & PAYMENTS',
      description:
        'Consolidate room tariffs, restaurant dining, laundry, and mini-bar charges into a clean single guest folio with instant M-Pesa Daraja STK mobile payments.',
      bullets: [
        'Unified Folio Aggregation Across All Outlets',
        'Automated M-Pesa Daraja Mobile Money Push Receipts',
        'Tax Invoicing & KRA Compliant Receipts',
        'Expenses & Multi-Currency Ledger Support (KES / USD)',
      ],
    },
    {
      id: 'saas-admin',
      title: 'Multi-Tenant SaaS Command Center',
      subtitle: 'Super Admin Governance & Growth Metrics',
      image: featureSaasAdminImg,
      icon: ShieldCheck,
      badge: 'SUPER ADMIN CONTROL',
      description:
        'Scale your hospitality software business with multi-tenant row-level security, tenant provisioning, custom hotel branding, and subscription analytics.',
      bullets: [
        'One-Click Hotel Tenant Provisioning & Setup',
        'Custom Hotel Logo Uploads & Color Customizers',
        'Tenant Lifecycle Management (Active / Suspended / Trial)',
        'Live MRR, Total Rooms & Platform Revenue Analytics',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-lg">SERVIO</span>
            <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase block -mt-1">
              HOSPITALITY SAAS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            Platform Capabilities
          </a>
          <a href="#benefits" className="hover:text-emerald-400 transition-colors">
            Why Servio
          </a>
          <a href="#hoteliers" className="hover:text-emerald-400 transition-colors">
            Active Hotels
          </a>
          <a href="#login-portal-section" className="hover:text-emerald-400 transition-colors">
            Sign In
          </a>
        </nav>

        {/* Dual Primary Auth Buttons & Theme Switcher */}
        <div className="flex items-center gap-3">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                theme === 'dark'
                  ? 'bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('HOTELIER');
              scrollToLogin();
            }}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all border border-slate-700 flex items-center gap-2 shadow-sm"
          >
            <Hotel size={16} className="text-emerald-400" />
            <span className="hidden sm:inline">Hotelier Portal</span>
            <span className="sm:hidden">Hotelier</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ADMIN');
              scrollToLogin();
            }}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Super Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-12 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Multi-Tenant Enterprise Hospitality Operating System
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              The All-in-One Cloud OS for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Hotels & Restaurants
              </span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed max-w-xl font-normal">
              Empower hotel owners, front desk managers, restaurant waiters, chefs, and accountants with isolated multi-tenant PMS, POS, KDS, inventory recipe costing, and automated M-Pesa guest folios.
            </p>

            {/* Main Call to Action Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  setActiveTab('HOTELIER');
                  scrollToLogin();
                }}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Access Hotelier Portal</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('ADMIN');
                  scrollToLogin();
                }}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-sm rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>Super Admin Login</span>
              </button>
            </div>

            {/* Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-extrabold text-white text-sm sm:text-base">Row-Level RLS</p>
                <p className="text-slate-500 text-[11px]">Strict Tenant Isolation</p>
              </div>
              <div>
                <p className="font-extrabold text-white text-sm sm:text-base">M-Pesa STK Push</p>
                <p className="text-slate-500 text-[11px]">Automated Daraja Billing</p>
              </div>
              <div>
                <p className="font-extrabold text-white text-sm sm:text-base">KES Standard</p>
                <p className="text-slate-500 text-[11px]">Kenya Shillings & EAT</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Feature Graphic */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src={heroPmsImg}
                alt="Servio Hotel Management System Interface"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Live Indicator Badges */}
              <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="font-extrabold text-white text-[11px]">Live PMS & POS Operations</p>
                  <p className="text-[10px] text-slate-400">Multi-Tenant Scoped Active</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Folio Settlement & M-Pesa</p>
                    <p className="text-[10px] text-slate-400">Direct Room Charge + Restaurant Bills</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  KES 24,500
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Direct Login Section */}
      <section id="login-portal-section" className="py-16 px-6 sm:px-12 bg-slate-900/50 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              AUTHENTICATION CENTER
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Select whether you are logging in as a Hotelier property team member or a SaaS Super Administrator.
            </p>

            {/* Login Tab Switcher */}
            <div className="inline-flex p-1.5 bg-slate-950 border border-slate-800 rounded-2xl gap-2 mt-4">
              <button
                onClick={() => setActiveTab('HOTELIER')}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                  activeTab === 'HOTELIER'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Hotel size={16} />
                <span>Hotelier Property Staff</span>
              </button>

              <button
                onClick={() => setActiveTab('ADMIN')}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                  activeTab === 'ADMIN'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck size={16} />
                <span>SaaS Super Admin</span>
              </button>
            </div>
          </div>

          {/* Login Card Containers */}
          <div className="max-w-2xl mx-auto">
            {activeTab === 'HOTELIER' ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400">
                    <Hotel size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">Hotelier Staff Workspace Login</h3>
                    <p className="text-xs text-slate-400">Access your hotel property's isolated PMS & POS environment</p>
                  </div>
                </div>

                <form onSubmit={handleHotelierSubmit} className="space-y-5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Select Subscribed Hotel Property</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tenants.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTenantId(t.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            selectedTenantId === t.id
                              ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={t.logo_url}
                            alt={t.hotel_name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <p className="font-extrabold text-xs truncate">{t.hotel_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              {t.city} • {t.rooms_count} Rooms
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-extrabold mb-1">Staff Work Email</label>
                      <input
                        type="email"
                        required
                        value={hotelierEmail}
                        onChange={(e) => setHotelierEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-extrabold mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={hotelierPassword}
                        onChange={(e) => setHotelierPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Operational Staff Role Perspective</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold outline-none focus:border-emerald-500 text-xs"
                    >
                      <option value="HOTEL_OWNER">Hotel Owner (Full Property Governance)</option>
                      <option value="GENERAL_MANAGER">General Manager (PMS & Operations)</option>
                      <option value="RECEPTIONIST">Front Desk Receptionist (Check-In & Guests)</option>
                      <option value="WAITER">Restaurant Waiter (POS Ordering & Room Service)</option>
                      <option value="CHEF">Head Chef (Kitchen KDS Display & Recipes)</option>
                      <option value="STOREKEEPER">Storekeeper (Pantry & Inventory Stock)</option>
                      <option value="ACCOUNTANT">Hotel Accountant (Folios & Payments)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Launch Hotelier PMS Workspace</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Quick Demo Shortcuts */}
                  <div className="pt-4 border-t border-slate-800/80">
                    <p className="text-[11px] text-slate-400 font-extrabold mb-2 uppercase tracking-wider">
                      Quick Demo Role Presets:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('GENERAL_MANAGER');
                          onLoginAsHotelier(selectedTenantId, 'GENERAL_MANAGER');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors"
                      >
                        👔 General Manager
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('RECEPTIONIST');
                          onLoginAsHotelier(selectedTenantId, 'RECEPTIONIST');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors"
                      >
                        🛎️ Front Desk
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('WAITER');
                          onLoginAsHotelier(selectedTenantId, 'WAITER');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors"
                      >
                        🍽️ Restaurant Waiter
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('CHEF');
                          onLoginAsHotelier(selectedTenantId, 'CHEF');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-800 transition-colors"
                      >
                        👨‍🍳 Kitchen Chef
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg">SaaS Super Admin Command Center</h3>
                    <p className="text-xs text-slate-400">Platform Administrator Domain</p>
                  </div>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-5 text-xs">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-300 space-y-1">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
                      <ShieldAlert size={16} />
                      <span>Platform Security Governance</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Access central tenant management, hotelier provisioning, subscription billing, and custom branding controls across all property tenants.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1">Platform Administrator Email</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1">Super Admin Security Token</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-cyan-500/20 text-sm transition-all flex items-center justify-center gap-2 group"
                    >
                      <ShieldCheck size={18} />
                      <span>Authenticate Super Admin Console</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities & Feature Deep-Dive Section */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
            ENTERPRISE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built for Modern Hotel & Restaurant Excellence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore the core operational modules engineered specifically for hospitality properties in East Africa and beyond.
          </p>
        </div>

        {/* Feature Interactive Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Feature Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = selectedFeature === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFeature(idx)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-xl ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <IconComp size={20} />
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase block mb-0.5">
                      {item.badge}
                    </span>
                    <h3 className="font-extrabold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Selected Feature Visual Showcase */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-[260px] sm:h-[320px]">
              <img
                src={features[selectedFeature].image}
                alt={features[selectedFeature].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-xs">
                <p className="font-black text-white text-sm">
                  {features[selectedFeature].title}
                </p>
                <p className="text-slate-400 text-xs">
                  {features[selectedFeature].subtitle}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {features[selectedFeature].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features[selectedFeature].bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Benefits Grid Section */}
      <section id="benefits" className="py-20 px-6 sm:px-12 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
              BUSINESS ROI & BENEFITS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Hoteliers & SaaS Admins Choose Servio
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered to eliminate operational bottlenecks, reduce food wastage, and maximize RevPAR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Row-Level Tenant Isolation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Guaranteed cryptographic tenant scoping ensures zero cross-property data leakages between independent hoteliers, franchises, or competitors.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <Receipt size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Automated M-Pesa STK Push</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Send instant M-Pesa payment prompts directly to guest mobile phones during checkout or restaurant dining, auto-reconciling folios in real time.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <PackageCheck size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Pantry Stock Protection</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Eliminate pilferage with recipe ingredient yield tracking that automatically decrements stock every time a dish or drink is sold in POS.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <ChefHat size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Real-Time Kitchen KDS</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Replace noisy paper ticket printers with visual station monitors for Hot Kitchen, Cold Kitchen, Bar, and Pastry with ticket timers.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Role-Based Staff Access</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tailor operational views for General Managers, Front Desk Receptionists, Waiters, Chefs, Storekeepers, and Accountants with strict privileges.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Multi-Property SaaS Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Track platform monthly recurring revenue (MRR), total active rooms, subscription health, and custom branding across hoteliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribed Hoteliers Showcase */}
      <section id="hoteliers" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Globe size={16} />
              <span>LIVE SAAS NETWORK</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Active Subscribed Hoteliers ({tenants.length})
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('HOTELIER');
              scrollToLogin();
            }}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 w-fit"
          >
            <span>Log In to Property Workspace</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 hover:border-emerald-500/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.logo_url}
                      alt={t.hotel_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 bg-slate-950"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {t.hotel_name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {t.city}, {t.country}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      t.account_status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {t.subscription_plan}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Rooms Count</span>
                    <span className="font-extrabold text-slate-200">{t.rooms_count} Rooms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Tenant Code</span>
                    <span className="font-mono text-emerald-400 text-xs font-bold">{t.tenant_code}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTenantId(t.id);
                  setActiveTab('HOTELIER');
                  scrollToLogin();
                }}
                className="w-full py-2.5 bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-800 hover:border-emerald-500 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Launch PMS Workspace</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 sm:px-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">
              S
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">SERVIO Hospitality SaaS Platform</p>
              <p className="text-[11px] text-slate-500">Enterprise Multi-Tenant Hotel & Restaurant OS</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform Status: Operational
            </span>
            <span>KES Currency & EAT Timezone Standard</span>
            <span>Row-Level Cryptographic Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
