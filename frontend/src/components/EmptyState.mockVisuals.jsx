import React from 'react';

/**
 * RankedListMockVisual
 * Tiny mock ranked list with 3 bars of varying width in indigo → purple gradient
 * Used in Sentence Scores empty state.
 */
export function RankedListMockVisual() {
  return (
    <div
      aria-hidden="true"
      className="mb-6 p-3.5 bg-slate-50 border border-slate-100 rounded-xl max-w-sm mx-auto space-y-2 shadow-2xs select-none"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded shadow-2xs">
          #1
        </span>
        <div className="flex-1 bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 w-4/5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold">0.94</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs">
          #2
        </span>
        <div className="flex-1 bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 w-3/5" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold">0.78</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs">
          #3
        </span>
        <div className="flex-1 bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 w-2/5" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold">0.61</span>
      </div>
    </div>
  );
}

/**
 * ChartMockVisual
 * Mini mock distribution chart with 5 blue bars.
 * Used in Stats & Charts empty state.
 */
export function ChartMockVisual() {
  return (
    <div
      aria-hidden="true"
      className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl max-w-xs mx-auto flex items-end justify-center gap-3 h-20 shadow-2xs select-none"
    >
      <div className="w-5 bg-blue-300 rounded-t-sm h-7" />
      <div className="w-5 bg-blue-400 rounded-t-sm h-11" />
      <div className="w-5 bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-sm h-16 shadow-2xs" />
      <div className="w-5 bg-blue-400 rounded-t-sm h-9" />
      <div className="w-5 bg-blue-300 rounded-t-sm h-5" />
    </div>
  );
}

/**
 * CompareMockVisual
 * Mini 3-column method overlap preview.
 * Used in Compare Methods empty state.
 */
export function CompareMockVisual() {
  return (
    <div
      aria-hidden="true"
      className="mb-6 p-2.5 bg-slate-50 border border-slate-100 rounded-xl max-w-xs mx-auto grid grid-cols-3 gap-2 text-center text-[10px] font-medium shadow-2xs select-none"
    >
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 py-1.5 rounded-lg font-semibold">
        Frequency
      </div>
      <div className="bg-emerald-600 text-white py-1.5 rounded-lg font-bold shadow-xs">
        Hybrid
      </div>
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 py-1.5 rounded-lg font-semibold">
        TF-IDF
      </div>
    </div>
  );
}

/**
 * HistoryMockVisual
 * Mini mock history timeline/records visual.
 * Used in History empty state.
 */
export function HistoryMockVisual() {
  return (
    <div
      aria-hidden="true"
      className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl max-w-xs mx-auto space-y-1.5 text-left text-[11px] shadow-2xs select-none"
    >
      <div className="flex items-center justify-between bg-white border border-slate-200 p-1.5 rounded-lg">
        <span className="font-mono text-slate-500">#42 • Hybrid</span>
        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">62% ratio</span>
      </div>
      <div className="flex items-center justify-between bg-white/70 border border-slate-200/80 p-1.5 rounded-lg opacity-80">
        <span className="font-mono text-slate-400">#41 • TF-IDF</span>
        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">48% ratio</span>
      </div>
    </div>
  );
}

/**
 * AccuracyMockVisual
 * Mini ROUGE metric tags visual.
 * Used in Accuracy Check empty state.
 */
export function AccuracyMockVisual() {
  return (
    <div
      aria-hidden="true"
      className="mb-6 p-2.5 bg-slate-50 border border-slate-100 rounded-xl max-w-xs mx-auto flex items-center justify-center gap-2 text-center text-xs font-mono shadow-2xs select-none"
    >
      <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold shadow-2xs">
        R-1: 0.54
      </span>
      <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold shadow-2xs">
        R-2: 0.38
      </span>
      <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold shadow-2xs">
        R-L: 0.49
      </span>
    </div>
  );
}
