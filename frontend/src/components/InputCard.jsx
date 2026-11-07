import React, { useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FileText,
  Sparkles,
  X,
  Loader2,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import MethodSelector from './MethodSelector';

/**
 * InputCard Component
 *
 * Spacious, modern enterprise input card for Crux:
 * 1. Card Container: `flex flex-col h-full min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 lg:p-6 overflow-y-auto`
 * 2. Unified Header: `w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600`, `text-lg font-bold text-slate-900`, `text-sm text-slate-500`
 * 3. Textarea: Dominates space with `flex-1 min-h-[250px] flex flex-col mb-4`, soft placeholder `placeholder:text-slate-400`
 * 4. Controls Group: Grouped in single clean container `flex flex-col gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100`
 * 5. Action Button: Striking enabled state `w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl`
 */
export default function InputCard({
  text,
  setText,
  method,
  setMethod,
  numSentences,
  setNumSentences,
  frequencyWeight = 50,
  setFrequencyWeight,
  onSummarize,
  loading,
  error,
  onClear,
}) {
  const textareaRef = useRef(null);

  // Clean text calculation for accurate counts
  const cleanClientText = useMemo(() => {
    return text
      .replace(/\[(?:\\\[|\[)?\s*\d+\s*(?:\\\]|\])?\]\([^)]+\)/g, '')
      .replace(/\[([^\[\]]+)\]\((?:\\\(|\\\)|[^)])+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/(?:\\\[|\[)\s*\d+\s*(?:\\\]|\])/g, '')
      .replace(/\[\s*(?:edit|citation needed|[a-zA-Z\s]+)\s*\]/g, '')
      .replace(/\\([\[\]\(\)])/g, '$1')
      .replace(/\s*\|\s*/g, '। ')
      .trim();
  }, [text]);

  // Accurate word count: filters out standalone bullet symbols (-, *, •, –, —)
  const wordTokens = useMemo(() => {
    return cleanClientText
      ? cleanClientText.split(/\s+/).filter((w) => /[a-zA-Z0-9\u0900-\u097F]/.test(w))
      : [];
  }, [cleanClientText]);
  const wordCount = wordTokens.length;
  const charCount = text.length;

  // Dynamic sentence counting via useMemo: handles punctuated sentences, newlines, and bullet points
  const sentenceCount = useMemo(() => {
    if (!cleanClientText) return 0;

    const rawLines = cleanClientText.split('\n').map((l) => l.trim()).filter(Boolean);
    let mergedClientLines = [];
    for (let i = 0; i < rawLines.length; i++) {
      const l = rawLines[i];
      if ((l.endsWith(':') || l.endsWith(':-')) && i + 1 < rawLines.length) {
        mergedClientLines.push(`${l} ${rawLines[i + 1]}`);
        i++;
      } else {
        mergedClientLines.push(l);
      }
    }

    let clientSentences = [];
    for (const line of mergedClientLines) {
      if (/[.!?।॥]/.test(line)) {
        const parts = line.match(/[^.!?।॥]+(?:[.!?।॥]+["'”’\)\]]*|$)/g) || [];
        for (const p of parts) {
          const trimmed = p.trim();
          if (trimmed && /[a-zA-Z0-9\u0900-\u097F]/.test(trimmed)) {
            clientSentences.push(trimmed);
          }
        }
      } else if (/[a-zA-Z0-9\u0900-\u097F]/.test(line)) {
        clientSentences.push(line);
      }
    }
    return clientSentences.length;
  }, [cleanClientText]);

  // Dynamic slider range bound to actual sentence count (max capped at 20 sentences, default 20 when empty)
  const maxSliderValue = sentenceCount === 0 ? 20 : Math.min(sentenceCount, 20);
  const currentSliderVal = Math.min(Math.max(1, numSentences), maxSliderValue);

  // Auto-clamp requested summary length if input has fewer sentences than previous slider value
  useEffect(() => {
    if (sentenceCount > 0 && numSentences > maxSliderValue) {
      setNumSentences(maxSliderValue);
    } else if (sentenceCount > 0 && numSentences < 1) {
      setNumSentences(1);
    }
  }, [sentenceCount, maxSliderValue, numSentences, setNumSentences]);

  // Auto-expand textarea on mobile screens to eliminate inner scrollbars
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        if (window.innerWidth < 1024) {
          const minHeight = window.innerWidth < 640 ? 120 : 250;
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.max(minHeight, textareaRef.current.scrollHeight)}px`;
        } else {
          textareaRef.current.style.height = '';
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [text]);

  // Live compression estimate
  const compressionEstimate = sentenceCount > 0
    ? Math.min(100, Math.round((currentSliderVal / sentenceCount) * 100))
    : null;

  // Language check (Devanagari vs. Latin script)
  const isHindi = /[\u0900-\u097F]/.test(text);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (wordCount >= 3 && !loading) {
        onSummarize();
      }
    }
  };

  const handleClearAll = () => {
    setText('');
    if (onClear) onClear();
  };

  const isSummarizeDisabled = wordCount < 3 || loading;
  const tfidfWeight = 100 - frequencyWeight;

  return (
    /* 1. Left Card: Spacious container commanding the left view */
    <div className="flex flex-col w-full flex-none bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-6 lg:flex-1 lg:h-full lg:min-h-0 lg:overflow-y-auto">
      {/* 5. Card Header (Unified SaaS Header) */}
      <div className="flex-shrink-0 min-w-0 mb-4">
        <div className="flex items-center justify-between gap-3 min-w-0 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon Badge: w-10 h-10 rounded-xl bg-indigo-50 */}
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Original Text
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-snug">
                Input your source document to summarize
              </p>
            </div>
          </div>

          {/* Language Indicator */}
          {text.trim() && (
            <span
              className={`flex-shrink-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                isHindi
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              {isHindi ? '🇮🇳 Hindi' : '🌐 English'}
            </span>
          )}
        </div>

        {/* Counter badges & File action buttons */}
        <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {charCount.toLocaleString()} chars
            </span>
            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium">
              {wordCount.toLocaleString()} words
            </span>
            {sentenceCount > 0 && (
              <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-medium">
                {sentenceCount} {sentenceCount === 1 ? 'sentence' : 'sentences'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {text && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 
        1. Left Card - Textarea (CRITICAL):
        Textarea wrapper expands naturally on mobile and commands space with `lg:flex-1`.
        Textarea auto-expands on mobile with `overflow-hidden min-h-[120px] sm:min-h-[250px]`, eliminating inner scrollbars.
      */}
      <div className="w-full min-h-[120px] sm:min-h-[250px] flex flex-col mb-3 sm:mb-4 relative lg:flex-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (window.innerWidth < 1024) {
              const minHeight = window.innerWidth < 640 ? 120 : 250;
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.max(minHeight, e.target.scrollHeight)}px`;
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type your English or Hindi article here..."
          className="w-full min-h-[120px] sm:min-h-[250px] resize-none overflow-hidden lg:overflow-y-auto lg:h-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 sm:p-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none text-xs sm:text-sm leading-relaxed"
        />
      </div>

      {/* 
        2. Left Card - Controls Section & Summarize Button:
        Neatly grouped in single container without feeling boxy.
      */}
      <div className="flex-shrink-0 flex flex-col gap-3 sm:gap-4">
        {/* Unified Controls Container */}
        <div className="flex flex-col gap-3.5 sm:gap-5 p-3.5 sm:p-5 bg-slate-50/50 rounded-xl sm:rounded-2xl border border-slate-100">
          {/* Summarization Method Selector */}
          <MethodSelector
            method={method}
            setMethod={setMethod}
            frequencyWeight={frequencyWeight}
            setFrequencyWeight={setFrequencyWeight}
          />

          {/* Hybrid Weights Sliders (flows naturally without nested bordered box) */}
          {method === 'hybrid' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Hybrid Weights</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Auto-balanced (100%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Frequency Weight Slider Card */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-600 font-medium text-xs">Frequency:</span>
                    <span className="font-bold text-indigo-600 font-mono text-xs">{frequencyWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={frequencyWeight}
                    onChange={(e) => setFrequencyWeight(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                    aria-label="Frequency weight percentage"
                  />
                </div>

                {/* TF-IDF Weight Slider Card */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-600 font-medium text-xs">TF-IDF:</span>
                    <span className="font-bold text-indigo-600 font-mono text-xs">{tfidfWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={tfidfWeight}
                    onChange={(e) => setFrequencyWeight(100 - Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                    aria-label="TF-IDF weight percentage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary Length Budget Slider (dynamically bounded to input sentences) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span className="text-slate-900 font-bold">Summary Length</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-indigo-600">
                  {currentSliderVal} {currentSliderVal === 1 ? 'sentence' : 'sentences'}
                </span>
                {sentenceCount > 0 && compressionEstimate !== null && (
                  <span className="text-slate-500 font-normal">
                    ({compressionEstimate}% of original)
                  </span>
                )}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max={maxSliderValue}
              step="1"
              value={currentSliderVal}
              disabled={sentenceCount === 1}
              onChange={(e) => setNumSentences(Number(e.target.value))}
              className={`w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none my-1 ${
                sentenceCount === 1 ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="Summary length in sentences"
            />

            <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-500 font-medium px-0.5 whitespace-nowrap gap-1">
              <span className="shrink-0">1 sentence</span>
              {maxSliderValue > 1 && (
                <span className="text-slate-400 font-normal truncate">
                  {currentSliderVal} (~{Math.round((currentSliderVal / maxSliderValue) * 100)}%)
                </span>
              )}
              {maxSliderValue > 1 && (
                <span className="shrink-0 text-right">
                  {maxSliderValue} {maxSliderValue === 1 ? 'sentence' : 'sentences'}
                </span>
              )}
            </div>

            {/* Warning Toast: When slider > 50% of document sentences */}
            {sentenceCount > 1 && currentSliderVal > sentenceCount * 0.5 && (
              <div
                role="status"
                className="flex items-start gap-2.5 p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs shadow-xs animate-in fade-in slide-in-from-top-1 duration-200 mt-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  <strong>Warning:</strong> Summary length is too high. The summary will just be a copy of the original text.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Left Card - Summarize Button (Dynamic Active/Disabled States) */}
        <button
          type="button"
          onClick={onSummarize}
          disabled={isSummarizeDisabled}
          title={wordCount < 3 ? 'Enter at least 3 words to summarize' : 'Summarize Text'}
          className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isSummarizeDisabled
              ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 border border-transparent text-white cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className={`w-4 h-4 animate-spin flex-shrink-0 ${isSummarizeDisabled ? 'text-slate-400' : 'text-white'}`} />
              <span>Summarizing...</span>
            </>
          ) : (
            <>
              <Sparkles className={`w-4 h-4 flex-shrink-0 ${isSummarizeDisabled ? 'text-slate-400' : 'text-white'}`} />
              <span>Summarize Text</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

InputCard.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  numSentences: PropTypes.number.isRequired,
  setNumSentences: PropTypes.func.isRequired,
  frequencyWeight: PropTypes.number,
  setFrequencyWeight: PropTypes.func.isRequired,
  onSummarize: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onClear: PropTypes.func,
};
