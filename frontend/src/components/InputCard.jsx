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
import { extractDocument } from '../services/api';

export default function InputCard({
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
  onClear,
}) {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [docMeta, setDocMeta] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [fileError, setFileError] = useState('');

  // Clean text calculation for accurate counts
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

  // Live compression estimate
  const compressionEstimate = sentenceCount > 0
    ? Math.min(100, Math.round((numSentences / sentenceCount) * 100))
    : null;

  // Language check (Devanagari vs. Latin script)
  const isHindi = /[\u0900-\u097F]/.test(text);

  // File Ingestion Handler
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
    /* 
      InputCard Container:
      - Mobile (< 640px): w-full, p-3.5, natural height (no fixed height), rounded-2xl
      - Tablet (640-1023px): sm:p-5, natural height
      - Desktop (>= 1024px): lg:h-full lg:min-h-0 lg:p-6 lg:overflow-hidden (viewport-locked)
    */
    <div className="w-full min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 lg:p-6 lg:h-full lg:min-h-0 lg:overflow-hidden transition-shadow hover:shadow-md">
      {/* 1. Header Row */}
      <div className="flex-shrink-0 min-w-0 mb-2 sm:mb-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              {/* Typography scale: text-base sm:text-lg */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                Original Text
              </h2>
              {/* Typography scale: text-xs sm:text-sm */}
              <p className="text-xs sm:text-xs text-slate-500 font-medium truncate">
                Input your source document to summarize
              </p>
            </div>
          </div>

          {/* Language Tag */}
          {text.trim() && (
            <span
              className={`flex-shrink-0 whitespace-nowrap text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border transition-all ${
                isHindi
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200'
              }`}
            >
              {isHindi ? '🇮🇳 Hindi (हिंदी)' : '🌐 English (EN)'}
            </span>
          )}
        </div>

        {/* Ingestion Meta Banner */}
        {docMeta && (
          <div className="mt-2 p-2 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 min-w-0 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <FileCheck className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              <div className="min-w-0 flex-1 truncate">
                <div className="font-bold text-indigo-950 truncate text-xs">
                  {docMeta.filename}
                </div>
                <div className="text-[10px] sm:text-xs text-indigo-800 flex flex-wrap items-center gap-1 font-medium min-w-0">
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

        {/* File Error Toast */}
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

      {/* 
        2. Textarea Container:
        - Mobile (< 640px): w-full, min-h-[140px], resize-none, break-words whitespace-pre-wrap
        - Tablet (640-1023px): min-h-[160px]
        - Desktop (>= 1024px): lg:flex-1 lg:min-h-0 lg:h-auto overflow-y-auto
      */}
      <div
        className="w-full min-w-0 flex flex-col relative group lg:flex-1 lg:min-h-0"
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
          className="w-full min-w-0 resize-none overflow-y-auto break-words whitespace-pre-wrap text-sm sm:text-base min-h-[140px] sm:min-h-[160px] lg:min-h-0 lg:flex-1 p-3 sm:p-3.5 bg-slate-50/60 hover:bg-slate-50/90 focus:bg-white border border-slate-200/90 focus:border-indigo-500 rounded-xl transition-all outline-none leading-relaxed text-slate-900 font-normal disabled:opacity-50 placeholder:text-slate-400 shadow-inner overflow-x-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
        />

        {extracting && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-indigo-700 gap-2 p-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs sm:text-sm font-bold text-slate-900">Parsing and extracting document in RAM...</span>
          </div>
        )}
      </div>

      {/* 
        3. Textarea Controls & Actions:
        - Mobile (< 640px): Stacked or wrapped flex-col sm:flex-row to prevent overlapping
        - Action buttons ("Upload File", "Clear") placed neatly without overlapping placeholder
      */}
      <div className="flex-shrink-0 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 my-2.5">
        {/* Counter badges: flex-wrap so they wrap on narrow screens */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 font-mono text-[11px] sm:text-xs text-slate-600">
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

        {/* Action Buttons: Upload File, Clear */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 min-w-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={extracting}
            className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
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

          {text && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-shrink-0 whitespace-nowrap inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none active:scale-95"
              title="Clear text and summary"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Method Selection */}
      <div className="flex-shrink-0 min-w-0 mb-2.5">
        <MethodSelector
          method={method}
          setMethod={setMethod}
          frequencyWeight={frequencyWeight}
          setFrequencyWeight={setFrequencyWeight}
        />
      </div>

      {/* 
        5. Summary Length Budget Slider:
        - Full width, labels positioned above and below to prevent inline squishing
      */}
      <div className="flex-shrink-0 min-w-0 mb-2.5 bg-slate-50/80 border border-slate-200 rounded-xl p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 gap-1 mb-1.5 min-w-0">
          <span className="truncate text-slate-900 font-bold">Summary Length</span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-indigo-700">
              {numSentences} {numSentences === 1 ? 'sentence' : 'sentences'}
            </span>
            {compressionEstimate !== null && (
              <span className="text-slate-500 font-normal">
                · ~{compressionEstimate}% of original
              </span>
            )}
          </div>
        </div>

        <input
          type="range"
          min="1"
          max={Math.max(5, Math.min(10, sentenceCount || 10))}
          value={numSentences}
          onChange={(e) => setNumSentences(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none my-1"
          aria-label="Summary length in sentences"
        />

        <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 font-medium px-0.5 mt-1 min-w-0">
          <span className="flex-shrink-0">1 sentence</span>
          {sentenceCount > 1 && (
            <span className="truncate text-center px-1">
              {Math.max(1, Math.floor(sentenceCount / 2))} sentences (50%)
            </span>
          )}
          <span className="flex-shrink-0">
            {Math.max(5, Math.min(10, sentenceCount || 10))} sentences
          </span>
        </div>
      </div>

      {/* 6. Action CTA Button */}
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
  );
}

InputCard.propTypes = {
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
  onClear: PropTypes.func,
};
