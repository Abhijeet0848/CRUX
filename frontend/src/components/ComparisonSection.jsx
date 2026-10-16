import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CompareMethodsEmptyState from './CompareMethodsEmptyState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Scale,
  Zap,
  Plus,
  Minus,
  Columns,
  Repeat,
  Gauge,
  Upload,
  FileText,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export default function ComparisonSection({
  sourceText = '',
  compareData,
  loading = false,
  onRunCompare,
  referenceSummary = '',
  setReferenceSummary,
  onGoToSummarizer,
}) {
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'visuals' | 'summaries'
  const [showRefInput, setShowRefInput] = useState(false);
  const [copiedMethod, setCopiedMethod] = useState(null);

  const hasSource = Boolean(sourceText?.trim());

  const handleCopy = (summary, method) => {
    navigator.clipboard.writeText(summary);
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2000);
  };

  // Pre-comparison State (Card with inline warning, preview grid, and action buttons)
  if (!compareData && !loading) {
    if (!hasSource) {
      return <CompareMethodsEmptyState onGoToSummarizer={onGoToSummarizer} />;
    }

    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6">
        <div
          role="region"
          aria-label="Algorithm Comparison Setup"
          className="max-w-3xl w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center transition-all"
        >
          {/* 1. Hero Icon (Scale from Lucide, 32px in w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600) */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <Scale size={32} className="w-8 h-8" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            Compare All 3 Summarization Methods
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            See summaries created by Word Frequency, Key Words (TF-IDF), and Combined (Hybrid) side-by-side.
          </p>

          {/* 6. Preview Grid: 3-column preview grid before the buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="mb-2">
                <Columns className="w-5 h-5 text-emerald-600" size={20} />
              </div>
              <div className="text-sm font-semibold text-slate-800">Side-by-Side</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-normal">Sentence overlap diff</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="mb-2">
                <Repeat className="w-5 h-5 text-emerald-600" size={20} />
              </div>
              <div className="text-sm font-semibold text-slate-800">Overlap Matrix</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-normal">Shared vs. unique picks</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="mb-2">
                <Gauge className="w-5 h-5 text-emerald-600" size={20} />
              </div>
              <div className="text-sm font-semibold text-slate-800">ROUGE Delta</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-normal">Which method scores higher</div>
            </div>
          </div>

          {/* 2. Button Row (Secondary on Left, Primary on Right) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Secondary Button: "Add Reference for Accuracy" */}
            <button
              type="button"
              onClick={() => setShowRefInput((prev) => !prev)}
              className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 rounded-xl px-5 py-3 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              {showRefInput ? <Minus size={16} /> : <Plus size={16} />}
              <span>{showRefInput ? 'Hide Reference Text' : 'Add Reference for Accuracy'}</span>
            </button>

            {/* 3. Primary Button: "Compare Methods" with conditional disable */}
            <button
              type="button"
              onClick={hasSource ? onRunCompare : undefined}
              disabled={!hasSource || loading}
              title={!hasSource ? 'Add an article in the Summarizer first' : undefined}
              className={`w-full sm:w-auto rounded-xl px-6 py-3 font-medium flex items-center justify-center gap-2 transition-all ${
                !hasSource
                  ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}
            >
              <Zap size={18} />
              <span>{loading ? 'Comparing...' : 'Compare Methods'}</span>
            </button>
          </div>

          {/* Collapsible Reference Textarea */}
          {showRefInput && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-left animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText size={16} className="text-slate-500" />
                  <span>Reference / Human Summary (Optional):</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg cursor-pointer transition-all active:scale-95 shadow-xs">
                  <Upload size={14} />
                  <span>Upload .TXT / .MD</span>
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fileText = await file.text();
                        setReferenceSummary?.(fileText);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                value={referenceSummary || ''}
                onChange={(e) => setReferenceSummary?.(e.target.value)}
                placeholder="Paste or upload a human-written summary file here to measure accuracy scores..."
                className="w-full h-28 p-3 text-xs sm:text-sm font-normal bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white resize-none text-slate-800 placeholder:text-slate-400 transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <RefreshCw size={28} className="animate-spin text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Comparing Methods...</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Running Frequency, TF-IDF, and Hybrid pipelines concurrently to compute side-by-side metrics.
          </p>
        </div>
      </div>
    );
  }

  const results = compareData?.results || [];
  const hasRef = compareData?.has_reference;

  // Prepare chart dataset
  const chartData = results.map((r) => {
    const item = {
      name: r.method_name.replace(' (Weighted Blend)', '').replace('Based', '').trim(),
      methodKey: r.method,
      words: r.summary_word_count,
      timeMs: r.processing_time_ms,
      compressionPct: Math.round((1 - r.compression_ratio) * 100),
      avgScore: Number(r.average_sentence_score.toFixed(4)),
    };
    if (r.rouge) {
      item.rouge1 = Number((r.rouge.rouge_1.f1 * 100).toFixed(1));
      item.rouge2 = Number((r.rouge.rouge_2.f1 * 100).toFixed(1));
      item.rougeL = Number((r.rouge.rouge_l.f1 * 100).toFixed(1));
    }
    return item;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs my-3 sm:my-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Side-by-Side Method Comparison</span>
          </h3>
          <p className="text-xs sm:text-sm font-normal text-slate-600 mt-0.5">
            Comparing how each method summarized your text.
          </p>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs sm:text-sm w-full sm:w-auto justify-between gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all text-center ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Results</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visuals')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all text-center ${
                activeTab === 'visuals'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('summaries')}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all text-center ${
                activeTab === 'summaries'
                  ? 'bg-white text-purple-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Summaries</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRunCompare}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Comparing...' : 'Compare Again'}</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="mt-4">
        {/* 1. Comparison Metrics Table */}
        {activeTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                  <th className="py-2.5 px-3 text-right">Words</th>
                  <th className="py-2.5 px-3 text-right">Shortened By</th>
                  <th className="py-2.5 px-3 text-right">Avg Score</th>
                  {hasRef && (
                    <>
                      <th className="py-2.5 px-3 text-right text-indigo-700">Word Match</th>
                      <th className="py-2.5 px-3 text-right text-purple-700">Phrase Match</th>
                      <th className="py-2.5 px-3 text-right text-emerald-700">Structure Match</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {results.map((item) => (
                  <tr key={item.method} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                      <span>{item.method_name}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-600">
                      {item.processing_time_ms} ms
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-600">
                      {item.summary_word_count}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-emerald-600">
                      {Math.round((1 - item.compression_ratio) * 100)}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                      {item.average_sentence_score.toFixed(4)}
                    </td>
                    {hasRef && (
                      <>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-indigo-600">
                          {item.rouge ? `${(item.rouge.rouge_1.f1 * 100).toFixed(1)}%` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-purple-600">
                          {item.rouge ? `${(item.rouge.rouge_2.f1 * 100).toFixed(1)}%` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-600">
                          {item.rouge ? `${(item.rouge.rouge_l.f1 * 100).toFixed(1)}%` : '-'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Visual Comparison Chart */}
        {activeTab === 'visuals' && (
          <div className="space-y-4">
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} stroke="#cbd5e1" />
                  <YAxis tick={{ fontSize: 12, fill: '#475569' }} stroke="#cbd5e1" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#475569', paddingTop: '10px' }} />
                  <Bar dataKey="words" name="Summary Words" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="compressionPct" name="Reduction %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="timeMs" name="Time (ms)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  {hasRef && (
                    <>
                      <Bar dataKey="rouge1" name="Word Match %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rougeL" name="Structure Match %" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 3. Extracted Summaries Grid */}
        {activeTab === 'summaries' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {results.map((item) => (
              <div
                key={item.method}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                      {item.method_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.summary, item.method)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 ${
                        copiedMethod === item.method
                          ? 'bg-emerald-600 text-white border border-emerald-600'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {copiedMethod === item.method ? (
                        <>
                          <Check size={12} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {(item.summary.includes('\n')
                      ? item.summary.split(/\n+/).map((s) => s.trim()).filter(Boolean)
                      : (item.summary.match(/[^.!?।॥\n]+(?:[.!?।॥]+["'”’\)\]]*|$)/g) || [item.summary])
                          .map((s) => s.trim())
                          .filter(Boolean)
                    ).map((sent, sIdx) => (
                      <p key={sIdx}>{sent}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between font-mono font-medium">
                  <span>{item.summary_word_count} words</span>
                  <span>{item.processing_time_ms} ms</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ComparisonSection.propTypes = {
  sourceText: PropTypes.string,
  compareData: PropTypes.object,
  loading: PropTypes.bool,
  onRunCompare: PropTypes.func.isRequired,
  referenceSummary: PropTypes.string,
  setReferenceSummary: PropTypes.func,
  onGoToSummarizer: PropTypes.func,
};
