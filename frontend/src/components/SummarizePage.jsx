import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FileText,
  Upload,
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import MethodSelector from './MethodSelector';
import SummaryPanel from './SummaryPanel';
import { extractDocument } from '../services/api';


/**
 * SummarizePage
 *
 * LAYOUT ARCHITECTURE (Single-Viewport No-Page-Scroll System):
 *
 * - Outer Grid Container: `flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 overflow-hidden`
 *   CRITICAL: `min-h-0` is required here because it is a direct child of the App flex root.
 *   In CSS Flexbox, children default to `min-height: auto`. Setting `min-h-0` allows the
 *   grid to calculate its boundaries based on viewport height, enabling internal scroll regions.
 *
 * - Left Panel (Input Card):
 *   `flex flex-col h-full min-h-0 bg-white rounded-2xl shadow-sm p-4 lg:p-5 overflow-hidden`
 *   - Card Header: `flex-shrink-0` (Pinned at top)
 *   - Textarea: `flex-1 min-h-[120px] resize-none overflow-y-auto` (ONLY this element scrolls internally)
 *   - Controls & Pills: `flex-shrink-0` (Pinned counters and ghost actions)
 *   - Method Selector: `flex-shrink-0` (Pinned algorithm toggle + auto-balanced weights)
 *   - Length Slider: `flex-shrink-0` (Pinned sentence budget slider)
 *   - CTA Button: `flex-shrink-0` (Pinned "Summarize Text" button, never scrolls off-screen)
 *
 * - Right Panel (SummaryPanel):
 *   Refer to SummaryPanel.jsx for `min-h-0` and `overflow-y-auto` documentation.
 */
export default function SummarizePage({
  text,
  setText,
  method,
  setMethod,
  numSentences,
  setNumSentences,
  frequencyWeight,
  setFrequencyWeight,
  onSummarize,
  loading,
  error,
  summaryData,
  onClear,
}) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [docMeta, setDocMeta] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [fileError, setFileError] = useState('');

  // Clean text calculation for accurate character, word, and sentence counts
  const cleanClientText = text
    .replace(/\[(?:\\\[|\[)?\s*\d+\s*(?:\\\]|\])?\]\([^)]+\)/g, '')
    .replace(/\[([^\[\]]+)\]\((?:\\\(|\\\)|[^)])+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/(?:\\\[|\[)\s*\d+\s*(?:\\\]|\])/g, '')
    .replace(/\[\s*(?:edit|citation needed|[a-zA-Z\s]+)\s*\]/g, '')
    .replace(/\\([\[\]\(\)])/g, '$1')
    .replace(/\s*\|\s*/g, '। ')
    .trim();

  const wordCount = cleanClientText ? cleanClientText.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const sentenceList = cleanClientText
    ? (cleanClientText.match(/[^.!?।॥\n]+(?:[.!?।॥]+["'”’\)\]]*|$)/g) || []).filter((s) => s.trim().length > 0)
    : [];
  const sentenceCount = sentenceList.length;

  // Live compression estimate: (numSentences / totalSentences) * 100
  const compressionEstimate = sentenceCount > 0
    ? Math.min(100, Math.round((numSentences / sentenceCount) * 100))
    : null;

  // Language check (Devanagari vs. English)
  const isHindi = /[\u0900-\u097F]/.test(text);

  // File Ingestion Handler supporting .txt, .md, and .pdf
  const processFile = async (file) => {
    if (!file) return;
    setFileError('');

    const lowerName = file.name.toLowerCase();
    const isValidType =
      lowerName.endsWith('.txt') ||
      lowerName.endsWith('.md') ||
      lowerName.endsWith('.pdf');

    if (!isValidType) {
      setFileError('Unsupported format. Please upload a .TXT, .MD, or .PDF file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10 MB limit.');
      return;
    }

    setExtracting(true);
    try {
      const data = await extractDocument(file);
      setText(data.text);
      setDocMeta({
        filename: data.filename,
        wordCount: data.word_count,
        sentenceCount: data.sentence_count,
        fileSizeBytes: data.file_size_bytes,
        extension: data.extension,
      });
    } catch (err) {
      console.error(err);
      setFileError(err.message || 'Could not parse text from this document.');
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() && !loading && !extracting) {
        onSummarize();
      }
    }
  };


  const handleClearAll = () => {
    setText('');
    setDocMeta(null);
    setFileError('');
    if (onClear) onClear();
  };

  const isSummarizeDisabled = !text.trim() || loading || extracting;

  return (
    /* Outer Main Grid: flex-1 w-full max-w-full min-h-0 min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 overflow-hidden items-stretch */
    /* min-w-0 is critical so grid container can shrink below intrinsic content width */
    <div className="flex-1 w-full max-w-full min-h-0 min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 overflow-hidden items-stretch">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Input Card & Controls                                        */}
      {/* min-w-0 enables horizontal shrinking; min-h-0 enables vertical shrinking  */}
      {/* ========================================================================= */}
      <div className="flex flex-col h-full min-h-0 min-w-0 w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 lg:p-6 overflow-hidden transition-shadow hover:shadow-md">
        {/* 1. Card Header: flex-shrink-0 min-w-0 (Pinned at top) */}
        {/* min-w-0 ensures the header row flex container can shrink without clipping text */}
        <div className="flex-shrink-0 min-w-0 mb-2.5">
          <div className="flex items-center justify-between gap-3 min-w-0 flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
                  Original Text
                </h2>
                <p className="text-[11px] text-slate-500 font-medium truncate">Input your source document</p>
              </div>
              {text.trim() && (
                <span
                  className={`flex-shrink-0 whitespace-nowrap text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                    isHindi
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}
                >
                  {isHindi ? '🇮🇳 Hindi (हिंदी)' : '🌐 English (EN)'}
                </span>
              )}
            </div>
          </div>

          {/* Document Ingestion Metadata Banner */}
          {docMeta && (
            <div className="mt-2 p-2 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 min-w-0 text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <FileCheck className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                <div className="min-w-0 flex-1 truncate">
                  <div className="font-bold text-indigo-950 truncate text-xs">
                    {docMeta.filename}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-indigo-800 flex flex-wrap items-center gap-1 font-medium min-w-0">
                    <span className="whitespace-nowrap"><strong>{docMeta.wordCount?.toLocaleString() || 0}</strong> words</span>
                    <span>&bull;</span>
                    <span className="whitespace-nowrap"><strong>{docMeta.sentenceCount || 0}</strong> sentences</span>
                    <span>&bull;</span>
                    <span className="whitespace-nowrap"><strong>{((docMeta.fileSizeBytes || 0) / 1024).toFixed(1)} KB</strong></span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDocMeta(null)}
                aria-label="Dismiss file banner"
                className="text-indigo-800 hover:text-indigo-950 p-1 text-xs cursor-pointer font-bold ml-1 flex-shrink-0 rounded hover:bg-indigo-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* File Error Toast / Banner */}
          {fileError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 flex justify-between items-center gap-2 min-w-0 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="truncate">{fileError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFileError('')}
                aria-label="Dismiss error"
                className="text-red-800 hover:text-red-950 p-0.5 rounded flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Textarea Container: flex-1 min-h-0 min-w-0 w-full */}
        {/* min-w-0 prevents textarea from expanding parent width; overflow-y-auto keeps scroll internal */}
        <div
          className="flex-1 min-h-0 min-w-0 w-full flex flex-col relative group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (docMeta) setDocMeta(null);
              if (fileError) setFileError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste or type your English or Hindi article here, or drag & drop a .TXT / .MD / .PDF file..."
            disabled={extracting}
            className="flex-1 min-h-[120px] min-w-0 w-full p-3 text-xs sm:text-sm bg-slate-50/60 hover:bg-slate-50/90 focus:bg-white border border-slate-200/90 focus:border-indigo-500 rounded-xl transition-all outline-none resize-none leading-relaxed text-slate-900 font-normal disabled:opacity-50 placeholder:text-slate-400 shadow-inner overflow-y-auto overflow-x-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
          />

          {extracting && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-indigo-700 gap-2 p-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Parsing and extracting document in RAM...</span>
            </div>
          )}
        </div>

        {/* 3. Textarea Footer Controls: flex-shrink-0 min-w-0 */}
        {/* min-w-0 enables container to contract and badges to wrap gracefully without clipping */}
        <div className="flex-shrink-0 min-w-0 flex items-center justify-between gap-3 text-xs text-slate-500 font-medium my-2">
          {/* Live Counters as Pills: flex items-center gap-2 flex-wrap min-w-0 */}
          {/* min-w-0 prevents counters row from forcing parent panel wider */}
          <div className="flex items-center gap-2 flex-wrap min-w-0 font-mono text-[11px] text-slate-600">
            <span className="flex-shrink-0 whitespace-nowrap bg-slate-100 rounded-full px-2.5 py-0.5 border border-slate-200/80 font-semibold shadow-2xs">
              {charCount.toLocaleString()} chars
            </span>
            <span className="flex-shrink-0 whitespace-nowrap bg-slate-100 rounded-full px-2.5 py-0.5 border border-slate-200/80 font-semibold shadow-2xs">
              {wordCount.toLocaleString()} words
            </span>
            {sentenceCount > 0 && (
              <span className="flex-shrink-0 whitespace-nowrap bg-indigo-50 text-indigo-800 rounded-full px-2.5 py-0.5 border border-indigo-200/80 font-semibold shadow-2xs">
                {sentenceCount} sentences
              </span>
            )}
          </div>

          {/* Action Buttons: flex-shrink-0 whitespace-nowrap */}
          <div className="flex items-center gap-1.5 flex-shrink-0 min-w-0">
            {text && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none active:scale-95"
                title="Clear text and summary"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting}
              className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-900 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/90 rounded-lg transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
              title="Upload .txt, .md, or .pdf document"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-700 flex-shrink-0" />
              <span>Upload File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload document file"
            />
          </div>
        </div>

        {/* 4. Method Selection: flex-shrink-0 min-w-0 (Frequency / TF-IDF / Hybrid + Side-by-Side Sliders) */}
        {/* min-w-0 ensures method selector does not force horizontal stretch */}
        <div className="flex-shrink-0 min-w-0 mb-2">
          <MethodSelector
            method={method}
            setMethod={setMethod}
            frequencyWeight={frequencyWeight}
            setFrequencyWeight={setFrequencyWeight}
          />
        </div>

        {/* 5. Summary Length Budget Slider: flex-shrink-0 min-w-0 */}
        {/* min-w-0 ensures slider card contracts properly on narrow viewports */}
        <div className="flex-shrink-0 min-w-0 mb-2 bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 sm:p-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-1 min-w-0">
            <span className="truncate">Summary Length</span>
            <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
              <span className="font-bold text-indigo-700">
                {numSentences} {numSentences === 1 ? 'sentence' : 'sentences'}
                {compressionEstimate !== null && (
                  <span className="font-normal text-slate-500 ml-1.5">
                    · ~{compressionEstimate}% of original
                  </span>
                )}
              </span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max={Math.max(5, Math.min(10, sentenceCount || 10))}
            value={numSentences}
            onChange={(e) => setNumSentences(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
            aria-label="Summary length in sentences"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5 mt-0.5 min-w-0">
            <span className="flex-shrink-0 whitespace-nowrap">1 sentence</span>
            {sentenceCount > 1 && <span className="truncate text-center">{Math.max(1, Math.floor(sentenceCount / 2))} sentences (50%)</span>}
            <span className="flex-shrink-0 whitespace-nowrap">{Math.max(5, Math.min(10, sentenceCount || 10))} sentences</span>
          </div>
        </div>

        {/* 6. Action CTA Button: flex-shrink-0 min-w-0 (Pinned at bottom, always visible) */}
        {/* min-w-0 ensures button container stays inside card bounds */}
        <div className="flex-shrink-0 min-w-0 pt-0.5">
          <button
            type="button"
            onClick={onSummarize}
            disabled={isSummarizeDisabled}
            title={!text.trim() ? 'Enter or upload text to summarize' : ''}
            className={`w-full py-2.5 sm:py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 select-none tracking-wide transition-all duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-none ${
              isSummarizeDisabled
                ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 border border-slate-300'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white flex-shrink-0" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
                <span>Summarize Text</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-400 mt-1 text-center font-normal truncate">
            Press Ctrl+Enter to summarize
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Output Summary Panel                                        */}
      {/* ========================================================================= */}
      <SummaryPanel
        summary={summaryData?.summary || ''}
        method={summaryData?.method || method}
        compressionRatio={summaryData?.compression_ratio || 0}
        loading={loading}
        error={error}
        onRetry={onSummarize}
      />
    </div>
  );
}

SummarizePage.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  numSentences: PropTypes.number.isRequired,
  setNumSentences: PropTypes.func.isRequired,
  frequencyWeight: PropTypes.number.isRequired,
  setFrequencyWeight: PropTypes.func.isRequired,
  onSummarize: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  summaryData: PropTypes.object,
  onClear: PropTypes.func,
};
