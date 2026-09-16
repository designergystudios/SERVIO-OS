// Servio Analytics, Reports & RevPAR View

import React from 'react';
import { PieChart as PieChartIcon, TrendingUp, BarChart3, Building2, UtensilsCrossed, Warehouse } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReportsView: React.FC = () => {
  const occupancyData = [
    { month: 'Apr', occupancy: 68 },
    { month: 'May', occupancy: 72 },
    { month: 'Jun', occupancy: 81 },
    { month: 'Jul', occupancy: 88 },
    { month: 'Aug', occupancy: 94 },
    { month: 'Sep', occupancy: 85 },
  ];

  const posCategorySales = [
    { name: 'Main Courses', value: 485000, color: '#10B981' },
    { name: 'Beverages & Bar', value: 290000, color: '#F59E0B' },
    { name: 'Starters & Sides', value: 145000, color: '#3B82F6' },
    { name: 'Coffee & Bakery', value: 98000, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Key Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RevPAR (Rev / Available Room)</span>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">11,475 KES</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+8.4% YoY</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ADR (Average Daily Rate)</span>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">13,500 KES</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+5.2% YoY</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Occupancy</span>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">85%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+12% vs targets</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">POS Gross Margin</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">79.8%</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Optimal Food Cost %</span>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy % Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Monthly Hotel Occupancy Trend (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="occupancy" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* POS Sales Category Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Restaurant POS Revenue by Category</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={posCategorySales}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {posCategorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
