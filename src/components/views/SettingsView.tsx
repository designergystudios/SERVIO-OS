// Servio System Settings & Property Configuration View

import React, { useState } from 'react';
import { Settings, Building2, Globe, Phone, Layers, ShieldCheck, CheckCircle2, Upload } from 'lucide-react';
import { HotelierProperty } from '../../types';

interface SettingsViewProps {
  activeHotelier?: HotelierProperty;
  onUpdateLogo?: (id: string, logoUrl: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ activeHotelier, onUpdateLogo }) => {
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState(
    activeHotelier?.logoUrl ||
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80'
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result);
          if (activeHotelier && onUpdateLogo) {
            onUpdateLogo(activeHotelier.id, reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">Property & System Settings</h3>
            <p className="text-xs text-slate-500">Configure property parameters, custom hotelier logo & integrations</p>
          </div>
          {activeHotelier && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full">
              {activeHotelier.plan} TENANT PLAN
            </span>
          )}
        </div>

        {saved && (
          <div className="p-4 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> Property configuration & logo saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Hotelier Logo & Branding Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Hotelier Property Logo & Branding
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={logoPreview}
                alt="Hotelier Logo"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 bg-white shadow-xs"
              />
              <div className="space-y-2 text-center sm:text-left">
                <p className="font-bold text-slate-800 text-xs">
                  {activeHotelier?.name || 'Servio Hotel'} Official Logo
                </p>
                <p className="text-[11px] text-slate-500">
                  This logo will appear on POS receipts, guest folios, PDF invoices, and top navigation header.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer text-xs shadow-xs">
                  <Upload size={14} /> Upload Hotel Logo Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* General Property Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">General Property</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Property Name</label>
                <input
                  type="text"
                  defaultValue={activeHotelier?.name || 'Servio Hotel & Resort'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">Location / City</label>
                <input
                  type="text"
                  defaultValue={activeHotelier?.city || 'Nairobi, Kenya'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Primary Currency</label>
                <input
                  type="text"
                  disabled
                  defaultValue="KES (Kenyan Shilling)"
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">System Timezone</label>
                <input
                  type="text"
                  disabled
                  defaultValue="Africa/Nairobi (EAT +03:00)"
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Integration Adapters */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Third-Party API Integration Adapters</h4>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">Safaricom Daraja M-Pesa STK Push</h5>
                  <p className="text-[11px] text-slate-500">Live mobile money collection bridge</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  CONNECTED
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">VikBooking / OTA Sync Bridge</h5>
                  <p className="text-[11px] text-slate-500">Two-way channel manager reservation sync</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Save Configuration Changes
          </button>
        </form>
      </div>
    </div>
  );
};

