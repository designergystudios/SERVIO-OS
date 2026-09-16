// Servio SaaS Multi-Tenant Platform Super Admin Command Center

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Trash2,
  Upload,
  ExternalLink,
  ShieldAlert,
  DollarSign,
  Users,
  Building,
  Globe,
  Palette,
  Clock,
  Archive,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Tenant, SubscriptionPlan, AccountStatus, Currency } from '../../types';

interface SaasAdminViewProps {
  tenants: Tenant[];
  activeTenantId: string;
  onAddTenant: (newTenant: Tenant) => void;
  onUpdateTenantStatus: (tenantId: string, status: AccountStatus) => void;
  onRemoveTenant: (tenantId: string) => void;
  onUpdateTenantBranding: (tenantId: string, logoUrl: string, primaryColor?: string, secondaryColor?: string) => void;
  onSwitchTenant: (tenantId: string) => void;
}

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#8b5cf6'];

export const SaasAdminView: React.FC<SaasAdminViewProps> = ({
  tenants,
  activeTenantId,
  onAddTenant,
  onUpdateTenantStatus,
  onRemoveTenant,
  onUpdateTenantBranding,
  onSwitchTenant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // New Tenant Onboarding Form
  const [hotelName, setHotelName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan>('PRO');
  const [roomsCount, setRoomsCount] = useState('40');
  const [primaryColor, setPrimaryColor] = useState('#059669');
  const [secondaryColor, setSecondaryColor] = useState('#1e293b');
  const [logoPreview, setLogoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80'
  );

  // Platform Analytics Calculations
  const activeCount = tenants.filter((t) => t.account_status === 'ACTIVE').length;
  const suspendedCount = tenants.filter((t) => t.account_status === 'SUSPENDED').length;
  const pendingCount = tenants.filter((t) => t.account_status === 'PENDING').length;
  const archivedCount = tenants.filter((t) => t.account_status === 'ARCHIVED').length;

  const totalMRR = tenants
    .filter((t) => t.account_status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.monthly_fee, 0);

  const totalRooms = tenants.reduce((acc, curr) => acc + curr.rooms_count, 0);

  // Charts Data
  const growthData = [
    { month: 'Jan', tenants: 1, mrr: 35000 },
    { month: 'Mar', tenants: 2, mrr: 120000 },
    { month: 'Jun', tenants: 3, mrr: 155000 },
    { month: 'Aug', tenants: 4, mrr: 170000 },
  ];

  const planDistribution = [
    { name: 'Enterprise', value: tenants.filter((t) => t.subscription_plan === 'ENTERPRISE').length },
    { name: 'Pro', value: tenants.filter((t) => t.subscription_plan === 'PRO').length },
    { name: 'Basic', value: tenants.filter((t) => t.subscription_plan === 'BASIC').length },
  ];

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tenant_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.account_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName || !email) return;

    const feesMap: Record<SubscriptionPlan, number> = { BASIC: 15000, PRO: 35000, ENTERPRISE: 85000 };
    const code = tenantCode || `TNT-${city.slice(0, 3).toUpperCase() || 'KE'}-${Math.floor(10 + Math.random() * 90)}`;
    const slug = hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newTenant: Tenant = {
      id: `hot-${Date.now()}`,
      tenant_code: code,
      hotel_name: hotelName,
      legal_name: legalName || `${hotelName} Kenya Ltd`,
      slug,
      email,
      phone: phone || '+254 700 000 000',
      website: `https://${slug}.co.ke`,
      address: 'Central Business District',
      city: city || 'Nairobi',
      county: county || 'Nairobi County',
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      logo_url: logoPreview,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      subscription_plan: plan,
      subscription_status: 'ACTIVE',
      account_status: 'ACTIVE',
      rooms_count: Number(roomsCount) || 25,
      monthly_fee: feesMap[plan],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddTenant(newTenant);
    setShowAddModal(false);

    // Reset Form
    setHotelName('');
    setLegalName('');
    setTenantCode('');
    setEmail('');
    setPhone('');
    setCity('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive SaaS Super Admin Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} /> SaaS Platform Super Admin Environment
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              Kenya Standard (KES / EAT)
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Platform Multi-Tenant Executive Command Center
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            Monitor global tenant organizations, manage lifecycle states (Active/Suspended/Archived), enforce backend tenant isolation, and onboard hoteliers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Plus size={18} /> Onboard New Tenant Hotelier
        </button>
      </div>

      {/* Top Level KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subscribed Hotels</span>
            <Building className="text-slate-400" size={18} />
          </div>
          <p className="text-2xl font-black text-slate-900">{tenants.length}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className="text-emerald-600 font-bold">{activeCount} Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-bold">{suspendedCount} Suspended</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue</span>
            <DollarSign className="text-emerald-500" size={18} />
          </div>
          <p className="text-2xl font-black text-emerald-600">{totalMRR.toLocaleString()} KES</p>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Platform Subscription Revenue</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Managed Rooms</span>
            <Users className="text-slate-400" size={18} />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalRooms}</p>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Across all active hotel properties</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Security Domain</span>
            <ShieldCheck className="text-cyan-500" size={18} />
          </div>
          <p className="text-2xl font-black text-cyan-600">100% Isolated</p>
          <span className="text-[11px] text-slate-500 mt-1 block font-medium">Row-Level Tenant Scoping</span>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tenant MRR & Growth Trend */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">SaaS Growth & Subscription Revenue (KES)</h3>
              <p className="text-xs text-slate-500">Monthly recurring revenue trend across onboarded hoteliers</p>
            </div>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="mrr" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Plan Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Subscription Tier Mix</h3>
            <p className="text-xs text-slate-500">Distribution of Basic vs Pro vs Enterprise</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Enterprise Tier</span>
              <span>85,000 KES/mo</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-600" /> Pro Tier</span>
              <span>35,000 KES/mo</span>
            </div>
            <div className="flex justify-between font-bold text-slate-700">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Basic Tier</span>
              <span>15,000 KES/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Management Table Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hotel name, code, city, legal name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All Tenants ({tenants.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('SUSPENDED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'SUSPENDED' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Suspended ({suspendedCount})
          </button>
        </div>
      </div>

      {/* Primary Tenant Directory Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tenant Code & Hotel Branding</th>
                <th className="px-6 py-4">Legal Name & Contact</th>
                <th className="px-6 py-4">Location & Rooms</th>
                <th className="px-6 py-4">Plan & Fee (KES)</th>
                <th className="px-6 py-4">Account Lifecycle</th>
                <th className="px-6 py-4 text-right">Super Admin Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.map((t) => {
                const isActiveTenant = activeTenantId === t.id;

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isActiveTenant ? 'bg-emerald-50/40 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    {/* Hotel Name & Logo */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.logo_url}
                          alt={t.hotel_name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">{t.hotel_name}</h4>
                            {isActiveTenant && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white">
                                ACTIVE SCOPE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <span className="font-bold text-slate-600">{t.tenant_code}</span>
                            <span>•</span>
                            <span>/{t.slug}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Legal Name & Contact */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{t.legal_name}</p>
                      <p className="text-[11px] text-slate-500">{t.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{t.phone}</p>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700">{t.city}, {t.county}</p>
                      <span className="text-[11px] text-slate-500">{t.rooms_count} Managed Rooms</span>
                    </td>

                    {/* Plan & MRR */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          t.subscription_plan === 'ENTERPRISE'
                            ? 'bg-purple-100 text-purple-800'
                            : t.subscription_plan === 'PRO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.subscription_plan}
                      </span>
                      <p className="font-black text-slate-900 mt-1">
                        {t.monthly_fee.toLocaleString()} KES/mo
                      </p>
                    </td>

                    {/* Account Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                          t.account_status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.account_status === 'SUSPENDED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.account_status === 'ACTIVE' && <CheckCircle2 size={12} />}
                        {t.account_status === 'SUSPENDED' && <Ban size={12} />}
                        {t.account_status === 'ARCHIVED' && <Archive size={12} />}
                        {t.account_status}
                      </span>
                    </td>

                    {/* Action Controls */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onSwitchTenant(t.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold shadow-xs inline-flex items-center gap-1"
                        title="Impersonate & launch hotel PMS"
                      >
                        <ExternalLink size={12} /> Launch PMS
                      </button>

                      <button
                        onClick={() => setEditingTenant(t)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold border border-slate-200 inline-flex items-center gap-1"
                      >
                        <Palette size={12} /> Branding
                      </button>

                      {t.account_status === 'ACTIVE' ? (
                        <button
                          onClick={() => onUpdateTenantStatus(t.id, 'SUSPENDED')}
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold border border-amber-200"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateTenantStatus(t.id, 'ACTIVE')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-200"
                        >
                          Reactivate
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Soft-archive tenant ${t.hotel_name}?`)) {
                            onRemoveTenant(t.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Archive Tenant"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Onboard New Hotelier Tenant */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Onboard New Hotelier Tenant Organization</h3>
                <p className="text-xs text-slate-500">Creates isolated database scope and initializes hotel PMS/POS</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hotel Property Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samburu Heritage Lodge"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Legal Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Samburu Heritage Ltd"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tenant Code</label>
                  <input
                    type="text"
                    placeholder="Auto: TNT-SMB-05"
                    value={tenantCode}
                    onChange={(e) => setTenantCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    placeholder="gm@samburu.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+254 711 999 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Samburu"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">County Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Samburu County"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="BASIC">BASIC (15,000 KES/mo)</option>
                    <option value="PRO">PRO (35,000 KES/mo)</option>
                    <option value="ENTERPRISE">ENTERPRISE (85,000 KES/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Capacity</label>
                  <input
                    type="number"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>
              </div>

              {/* Branding Customizer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Color (Hex)</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-9 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Secondary Color (Hex)</label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-9 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              {/* Logo Upload Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hotel Logo File</label>
                <div className="flex items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer border border-slate-200 flex items-center gap-2">
                    <Upload size={14} /> Select Image File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLogoUpload(e, (url) => setLogoPreview(url))}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md"
                >
                  Provision Tenant Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Branding & Logo Editor */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Branding Customizer: {editingTenant.hotel_name}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <img
                  src={editingTenant.logo_url}
                  alt={editingTenant.hotel_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <label className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer text-xs flex items-center gap-2">
                  <Upload size={14} /> Replace Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleLogoUpload(e, (newUrl) => {
                        onUpdateTenantBranding(editingTenant.id, newUrl);
                        setEditingTenant(null);
                      })
                    }
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEditingTenant(null)}
                  className="w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
                >
                  Close Customizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
