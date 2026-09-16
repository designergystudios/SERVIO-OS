// Servio Staff RBAC Management & Audit Logs Explorer View

import React, { useState } from 'react';
import { UserCog, ShieldCheck, Key, Lock, Eye } from 'lucide-react';
import { AuditLogItem, UserRole } from '../../types';

interface StaffViewProps {
  auditLogs: AuditLogItem[];
}

export const StaffView: React.FC<StaffViewProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'STAFF' | 'AUDIT'>('STAFF');

  const staffMembers = [
    { name: 'Robert K.', role: 'GENERAL_MANAGER', email: 'gm@servio.ke', status: 'ACTIVE' },
    { name: 'Alice Mwangi', role: 'HOTEL_MANAGER', email: 'alice@servio.ke', status: 'ACTIVE' },
    { name: 'Mary Wanjiku', role: 'RECEPTIONIST', email: 'reception@servio.ke', status: 'ACTIVE' },
    { name: 'Samuel Odhiambo', role: 'CASHIER', email: 'pos@servio.ke', status: 'ACTIVE' },
    { name: 'Chef James', role: 'CHEF', email: 'kitchen@servio.ke', status: 'ACTIVE' },
    { name: 'John Kiprop', role: 'HOUSEKEEPER', email: 'housekeeping@servio.ke', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STAFF' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Staff Accounts & RBAC Roles ({staffMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AUDIT' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Security Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'STAFF' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Staff Name</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Email / Account</th>
                <th className="px-6 py-3.5">Permissions Level</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {staffMembers.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      {s.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.email}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                    {s.role === 'GENERAL_MANAGER' ? 'Full Monolith Permissions' : 'Scoped Domain Access'}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Staff Member</th>
                <th className="px-6 py-3.5">Action</th>
                <th className="px-6 py-3.5">Domain Entity</th>
                <th className="px-6 py-3.5">Operation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {log.timestamp.slice(11, 19)}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{log.userName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{log.entity}</td>
                  <td className="px-6 py-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
