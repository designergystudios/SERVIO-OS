// Servio Bill of Materials (BOM) Recipes & Costing View

import React, { useState } from 'react';
import { BookOpenCheck, DollarSign, Percent, TrendingUp, Sparkles } from 'lucide-react';
import { Recipe } from '../../types';

interface RecipesViewProps {
  recipes: Recipe[];
}

export const RecipesView: React.FC<RecipesViewProps> = ({ recipes }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(recipes[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      {/* Left Col: Recipes Catalog */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">BOM Menu Recipes</h3>
          <span className="text-xs font-semibold text-slate-500">{recipes.length} Active Recipes</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {recipes.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecipe(rec)}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between ${
                selectedRecipe?.id === rec.id ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''
              }`}
            >
              <div>
                <h4 className="font-bold text-slate-800 text-xs">{rec.menuItemName}</h4>
                <p className="text-[11px] text-slate-500">
                  Selling Price: {rec.sellingPrice.toLocaleString()} KES
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  {rec.foodCostPercentage}% Food Cost
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 2 Cols: Ingredient Costing Breakdown Card */}
      {selectedRecipe && (
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                BOM Recipe Breakdown
              </span>
              <h3 className="font-extrabold text-slate-800 text-lg">{selectedRecipe.menuItemName}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Selling Price</span>
              <p className="text-xl font-extrabold text-slate-800">
                {selectedRecipe.sellingPrice.toLocaleString()} KES
              </p>
            </div>
          </div>

          {/* Key Costing Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Ingredient Cost</span>
              <p className="text-xl font-extrabold text-slate-800 mt-1">
                {selectedRecipe.totalIngredientCost.toLocaleString()} KES
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Food Cost %</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">
                {selectedRecipe.foodCostPercentage}%
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Gross Margin %</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">
                {selectedRecipe.grossMargin}%
              </p>
            </div>
          </div>

          {/* Ingredients Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Required Ingredient Quantities</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Ingredient Name</th>
                    <th className="px-4 py-2.5">Quantity per Portion</th>
                    <th className="px-4 py-2.5">Cost / Unit</th>
                    <th className="px-4 py-2.5 text-right">Subtotal Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold text-slate-800">{ing.inventoryItemName}</td>
                      <td className="px-4 py-3">
                        {ing.quantityRequired} {ing.uom}
                      </td>
                      <td className="px-4 py-3">{ing.costPerUnit.toLocaleString()} KES</td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-800">
                        {ing.totalCost.toLocaleString()} KES
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
