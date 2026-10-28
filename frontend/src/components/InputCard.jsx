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
  Sliders,
} from 'lucide-react';
import MethodSelector from './MethodSelector';
import { extractDocument } from '../services/api';

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
  const tfidfWeight = 100 - frequencyWeight;

  return (
    /* 1. Left Card: Spacious container commanding the left view */
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-y-auto p-4 sm:p-5 lg:p-6">
      {/* 5. Card Header (Unified SaaS Header) */}
      <div className="flex-shrink-0 min-w-0 mb-4">
        <div className="flex items-center justify-between gap-3 min-w-0 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon Badge: w-10 h-10 rounded-xl bg-indigo-50 */}
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">
                Original Text
              </h2>
              <p className="text-sm text-slate-500 font-normal truncate">
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={extracting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
              title="Upload .txt, .md, or .pdf"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
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
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Ingested Document Metadata Banner */}
        {docMeta && (
          <div className="mt-2.5 p-2 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
              <FileCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-semibold text-indigo-900 truncate">{docMeta.filename}</span>
              <span className="text-slate-500">· {docMeta.wordCount?.toLocaleString()} words</span>
            </div>
            <button
              type="button"
              onClick={() => setDocMeta(null)}
              aria-label="Dismiss file banner"
              className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* File Error Toast */}
        {fileError && (
          <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 truncate">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="truncate">{fileError}</span>
            </div>
            <button
              type="button"
              onClick={() => setFileError('')}
              aria-label="Dismiss error"
              className="text-red-700 hover:text-red-900 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 
        1. Left Card - Textarea (CRITICAL):
        Textarea wrapper commands space with `flex-1 min-h-[250px] flex flex-col mb-4`.
        Textarea stretches with `w-full h-full resize-none bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow`.
        Placeholder is softer (`placeholder:text-slate-400`).
      */}
      <div
        className="flex-1 min-h-[250px] flex flex-col mb-4 relative"
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
          className="w-full h-full resize-none bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none text-sm leading-relaxed overflow-y-auto disabled:opacity-50"
        />

        {extracting && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center text-indigo-700 gap-2 p-4 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold text-slate-900">Parsing document in RAM...</span>
          </div>
        )}
      </div>

      {/* 
        2. Left Card - Controls Section & Summarize Button:
        Neatly grouped in single container without feeling boxy.
      */}
      <div className="flex-shrink-0 flex flex-col gap-4">
        {/* Unified Controls Container */}
        <div className="flex flex-col gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
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

          {/* Summary Length Budget Slider (flows naturally without nested bordered box) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
              <span className="text-slate-900 font-bold">Summary Length</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-indigo-600">
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
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none my-1"
              aria-label="Summary length in sentences"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-medium px-0.5">
              <span>1 sentence</span>
              {sentenceCount > 1 && (
                <span>{Math.max(1, Math.floor(sentenceCount / 2))} sentences (50%)</span>
              )}
              <span>{Math.max(5, Math.min(10, sentenceCount || 10))} sentences</span>
            </div>
          </div>
        </div>

        {/* 3. Left Card - Summarize Button (Dynamic Active/Disabled States) */}
        <button
          type="button"
          onClick={onSummarize}
          disabled={isSummarizeDisabled}
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
