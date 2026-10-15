import React from 'react';
import { BarChart2, Zap, GitMerge, Sliders } from 'lucide-react';

/**
 * MethodSelector
 * Segmented pill control for selecting summarization algorithm
 * and auto-balancing hybrid weights (conditional visibility).
 */
export default function MethodSelector({
  method,
  setMethod,
  frequencyWeight = 50,
  setFrequencyWeight,
}) {
  const tfidfWeight = 100 - frequencyWeight;

  const methods = [
    { id: 'frequency', label: 'Word Frequency', shortLabel: 'Frequency', icon: BarChart2 },
    { id: 'tfidf', label: 'TF-IDF', shortLabel: 'TF-IDF', icon: Zap },
    { id: 'hybrid', label: 'Hybrid', shortLabel: 'Hybrid', icon: GitMerge },
  ];

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 sm:p-3.5 space-y-3">
      {/* Method Selection (Segmented Pills) */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Summarization Method
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-xl border border-slate-300/60">
          {methods.map((item) => {
            const Icon = item.icon;
            const isSelected = method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="inline sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hybrid Weight Sliders — Conditional Visibility (side-by-side in one row) */}
      {method === 'hybrid' && (
        <div className="pt-2 border-t border-slate-200/80 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hybrid Weights</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-normal text-slate-500">
              Auto-balanced (100%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Frequency Slider */}
            <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/70 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-700 font-medium">Frequency:</span>
                <span className="font-bold text-indigo-700 font-mono text-xs">
                  {frequencyWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={frequencyWeight}
                onChange={(e) => setFrequencyWeight(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                aria-label="Frequency weight percentage"
              />
            </div>

            {/* TF-IDF Slider (Auto-balanced) */}
            <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/70 shadow-2xs">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-700 font-medium">TF-IDF:</span>
                <span className="font-bold text-purple-700 font-mono text-xs">
                  {tfidfWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={tfidfWeight}
                onChange={(e) => setFrequencyWeight(100 - Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                aria-label="TF-IDF weight percentage"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
