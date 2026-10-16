import React from 'react';
import PropTypes from 'prop-types';
import { BarChart2, Zap, GitMerge, Sliders } from 'lucide-react';

/**
 * MethodSelector
 *
 * Responsive summarization method selector:
 * - Mobile (< 640px): Stacked vertically with full-width buttons and stacked sliders
 * - Tablet & Desktop (>= 640px): 3-column segmented tabs and side-by-side auto-balanced sliders
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
    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 sm:p-3.5 space-y-3 min-w-0 w-full">
      {/* Method Selection Heading */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
          Summarization Method
        </label>

        {/* 
          Method Tabs Container:
          - Mobile (< 640px): flex flex-col gap-2 (full-width stacked buttons)
          - Tablet & Desktop (>= 640px): sm:grid sm:grid-cols-3 sm:gap-1.5 (segmented pill tabs)
        */}
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-1.5 bg-slate-100/90 sm:bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 min-w-0">
          {methods.map((item) => {
            const Icon = item.icon;
            const isSelected = method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`w-full py-2 px-3 sm:py-1.5 sm:px-2 rounded-lg text-xs sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/90 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                aria-pressed={isSelected}
              >
                <Icon className={`w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                {/* On mobile full text is readable; on tablet/desktop it adapts */}
                <span className="inline truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hybrid Weight Sliders — Conditional Visibility */}
      {method === 'hybrid' && (
        <div className="pt-2.5 border-t border-slate-200/80 space-y-2 animate-in fade-in duration-150 min-w-0">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 min-w-0">
            <span className="flex items-center gap-1.5 truncate">
              <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Hybrid Weights</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-normal text-slate-500 shrink-0">
              Auto-balanced (100%)
            </span>
          </div>

          {/* 
            Hybrid Sliders Grid:
            - Mobile (< 640px): grid-cols-1 gap-2.5 (stacked vertically)
            - Tablet & Desktop (>= 640px): sm:grid-cols-2 sm:gap-3 (side-by-side)
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
            {/* Frequency Slider */}
            <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/70 shadow-2xs min-w-0">
              <div className="flex justify-between items-center text-xs mb-1 min-w-0">
                <span className="text-slate-700 font-medium truncate">Frequency Weight:</span>
                <span className="font-bold text-indigo-700 font-mono text-xs shrink-0 ml-1">
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
            <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/70 shadow-2xs min-w-0">
              <div className="flex justify-between items-center text-xs mb-1 min-w-0">
                <span className="text-slate-700 font-medium truncate">TF-IDF Weight:</span>
                <span className="font-bold text-purple-700 font-mono text-xs shrink-0 ml-1">
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

MethodSelector.propTypes = {
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  frequencyWeight: PropTypes.number,
  setFrequencyWeight: PropTypes.func.isRequired,
};
