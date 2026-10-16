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
} from 'lucide-react';

/**
 * SummaryCard (SummaryPanel)
 *
 * Right panel of the Summarizer workspace:
 * Breakpoint strategy:
 * - Mobile (< 640px): Full-width card in natural page flow, internal summary output
 *   limited to max-h-[60vh] with overflow-y-auto, action buttons (Copy/Download)
 *   compact with icon-only displays to avoid header crowding.
 * - Tablet (640px - 1023px): Full-width card in single-column scrollable page flow,
 *   action buttons display both icon and text.
 * - Desktop (>= 1024px): Viewport-locked (lg:h-full lg:min-h-0 lg:overflow-hidden),
 *   internal output expands to fill available height (lg:flex-1 lg:min-h-0 lg:max-h-none).
 */
export default function SummaryCard({
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
    /* 
      SummaryCard Container:
      - Mobile (< 640px): w-full, p-3.5, natural height (no fixed height), rounded-2xl
      - Tablet (640-1023px): sm:p-5, natural height
      - Desktop (>= 1024px): lg:h-full lg:min-h-0 lg:p-6 lg:overflow-hidden (viewport-locked)
    */
    <div className="w-full min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 lg:p-6 lg:h-full lg:min-h-0 lg:overflow-hidden transition-shadow hover:shadow-md">
      {/* 1. Card Header */}
      <div className="flex-shrink-0 min-w-0 flex items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-slate-100 mb-2.5 sm:mb-3">
        {/* Title block */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Typography scale: text-base sm:text-lg */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                Summary
              </h2>
              {summary && !loading && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verbatim Extractive</span>
                </span>
              )}
            </div>
            {/* Typography scale: text-xs sm:text-sm */}
            <p className="text-xs sm:text-xs text-slate-500 font-medium truncate">
              {summary && !loading
                ? `${summaryWordCount} words · ${compressionPercent}% shorter · ${sentenceLines.length} ${sentenceLines.length === 1 ? 'sentence' : 'sentences'}`
                : 'Extracted salient sentences'}
            </p>
          </div>
        </div>

        {/* 
          Action Buttons: Copy & Download
          - Mobile (< 640px): compact buttons (shrink to icons with titles to save header space)
          - Tablet & Desktop (>= 640px): show both icon and descriptive text label
        */}
        {summary && !loading && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 min-w-0">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy summary to clipboard"
              title={copied ? 'Copied to clipboard!' : 'Copy summary'}
              className={`flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              aria-label="Download summary as text file"
              title="Download summary as TXT"
              className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none"
            >
              <Download className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        )}
      </div>

      {/* 
        2. Output Body Container:
        - Mobile (< 640px): max-h-[60vh] overflow-y-auto (page scrolls naturally)
        - Tablet (640-1023px): max-h-[65vh] overflow-y-auto
        - Desktop (>= 1024px): lg:flex-1 lg:min-h-0 lg:max-h-none lg:overflow-y-auto (viewport-locked)
      */}
      <div
        aria-live="polite"
        className="w-full min-w-0 p-3 sm:p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed overflow-y-auto overflow-x-hidden break-words max-h-[60vh] sm:max-h-[65vh] lg:max-h-none lg:flex-1 lg:min-h-0"
      >
        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-indigo-700 mb-3 animate-pulse">
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
          /* Error Banner with Retry */
          <div className="p-3.5 sm:p-4 bg-red-50/90 border border-red-200 rounded-xl text-red-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-red-900">Summarization Error</h4>
                <p className="text-xs sm:text-sm text-red-800 mt-0.5 font-normal">{error}</p>
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
          /* Summary Sentences (verbatim extractive output) */
          <div className="space-y-3">
            {sentenceLines.map((sentence, index) => (
              <p
                key={index}
                className="text-slate-900 font-normal leading-relaxed text-sm sm:text-base break-words"
              >
                {sentence}
              </p>
            ))}
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="flex flex-col items-center justify-center min-h-[160px] lg:h-full text-slate-400 text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xs">
              Your extractive summary will appear here once you click Summarize Text.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Supports Luhn Word Frequency, TF-IDF, and Hybrid ranking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  summary: PropTypes.string,
  method: PropTypes.string,
  compressionRatio: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};
