import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Inbox,
} from 'lucide-react';

/**
 * SummaryPanel (Right Panel Card)
 *
 * LAYOUT ARCHITECTURE:
 * - Card Container: `flex flex-col h-full min-h-0 overflow-hidden`
 *   CRITICAL: `min-h-0` is strictly required on this flex child. Without `min-h-0`,
 *   the default CSS flex item `min-height: auto` causes the card to expand to fit
 *   its content, breaking internal scrolling and producing page-level scrollbars.
 *
 * - Header: `flex-shrink-0`
 *   Pins the title, salience metrics, and Copy/Download action buttons at the top.
 *
 * - Output Body: `flex-1 min-h-0 overflow-y-auto`
 *   CRITICAL: `min-h-0` with `flex-1` allows the summary text container to shrink
 *   and activate internal vertical scrolling (`overflow-y-auto`) exclusively.
 */
export default function SummaryPanel({
  summary = '',
  method = 'hybrid',
  compressionRatio = 0,
  loading = false,
  error = '',
  onRetry = null,
}) {
  const [copied, setCopied] = useState(false);

  const formatSentenceLines = (text) => {
    if (!text) return [];
    if (text.includes('\n')) {
      return text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    }
    // Fallback: split on terminal sentence punctuation preserving clauses
    return (text.match(/[^.!?।॥\n]+(?:[.!?।॥]+["'”’\)\]]*|$)/g) || [text])
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const sentenceLines = formatSentenceLines(summary);
  const formattedSummaryText = sentenceLines.join('\n\n');

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(formattedSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([formattedSummaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `summary_${method}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const compressionPercent = compressionRatio
    ? Math.round((1 - compressionRatio) * 100)
    : 0;

  const summaryWordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    /* Card Container: flex flex-col h-full min-h-0 min-w-0 w-full overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 */
    /* min-w-0 is critical so SummaryPanel shrinks to fit 50% grid column without horizontal overflow */
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 overflow-hidden transition-shadow hover:shadow-md">
      {/* 1. Card Header: flex-shrink-0 min-w-0 (Pinned at top, never scrolls) */}
      {/* min-w-0 allows the header row to shrink without clipping header content */}
      <div className="flex-shrink-0 min-w-0 flex items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-3">
        {/* Title block: min-w-0 flex-1 */}
        {/* min-w-0 enables title and subtext to truncate if viewport is tight */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
                Summary
              </h2>
              {summary && !loading && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verbatim Extractive</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {summary && !loading
                ? `${summaryWordCount} words · ${compressionPercent}% shorter · ${sentenceLines.length} ${sentenceLines.length === 1 ? 'sentence' : 'sentences'}`
                : 'Extracted salient sentences'}
            </p>
          </div>
        </div>

        {/* Pinned Action Buttons: Copy & Download (flex-shrink-0 whitespace-nowrap) */}
        {summary && !loading && (
          <div className="flex items-center gap-1.5 flex-shrink-0 min-w-0">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy summary to clipboard"
              className={`flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              aria-label="Download summary as text file"
              className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none"
            >
              <Download className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Scrollable Output Body: flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden w-full */}
      {/* min-w-0 ensures the output body never exceeds its parent width */}
      <div
        aria-live="polite"
        className="flex-1 min-h-0 min-w-0 w-full p-3.5 sm:p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed overflow-y-auto overflow-x-hidden"
      >
        {/* Loading State: Skeleton Loader */}
        {loading ? (
          <div className="space-y-3.5 py-2">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-700 mb-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>Generating extractive summary...</span>
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded-md w-full"></div>
              <div className="h-4 bg-slate-200 rounded-md w-11/12"></div>
              <div className="h-4 bg-slate-200 rounded-md w-4/5"></div>
              <div className="h-4 bg-slate-200 rounded-md w-10/12"></div>
              <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
            </div>
          </div>
        ) : error ? (
          /* Error State with Retry Button */
          <div className="p-4 bg-red-50/90 border border-red-200 rounded-xl text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-900">Summarization Error</h4>
                <p className="text-xs text-red-800 mt-0.5 font-normal">{error}</p>
              </div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : sentenceLines.length > 0 ? (
          /* Summary Sentences (verbatim extractive output with clean line separation) */
          <div className="space-y-3">
            {sentenceLines.map((sentence, index) => (
              <p
                key={index}
                className="text-slate-900 font-normal leading-relaxed text-xs sm:text-sm"
              >
                {sentence}
              </p>
            ))}
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-slate-400 text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-600 max-w-xs">
              Your extractive summary will appear here once you click Summarize Text.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports Luhn Word Frequency, TF-IDF, and Hybrid ranking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

SummaryPanel.propTypes = {
  summary: PropTypes.string,
  method: PropTypes.string,
  compressionRatio: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};
