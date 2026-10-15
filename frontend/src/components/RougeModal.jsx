import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Target,
  FileText,
  CheckCircle2,
  Upload,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { evaluateRouge, extractDocument } from '../services/api';

/**
 * RougeModal
 * Accuracy Evaluation modal computing ROUGE-1, ROUGE-2, and ROUGE-L metrics.
 */
export default function RougeModal({ isOpen, onClose, candidateSummary = '' }) {
  const [reference, setReference] = useState('');
  const [candidate, setCandidate] = useState(candidateSummary || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractingFile, setExtractingFile] = useState(null); // 'candidate' | 'reference'
  const [error, setError] = useState('');

  const candidateFileRef = useRef(null);
  const referenceFileRef = useRef(null);

  useEffect(() => {
    if (candidateSummary) {
      setCandidate(candidateSummary);
    }
  }, [candidateSummary]);

  // Reset or clear error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  const handleFileUpload = async (file, target) => {
    if (!file) return;
    setError('');
    setExtractingFile(target);

    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        if (target === 'candidate') setCandidate(text);
        if (target === 'reference') setReference(text);
      } else {
        const data = await extractDocument(file);
        if (target === 'candidate') setCandidate(data.text);
        if (target === 'reference') setReference(data.text);
      }
    } catch (err) {
      setError(`Failed to read file: ${err.message || 'Unknown error'}`);
    } finally {
      setExtractingFile(null);
      if (candidateFileRef.current) candidateFileRef.current.value = '';
      if (referenceFileRef.current) referenceFileRef.current.value = '';
    }
  };

  const handleEvaluate = async () => {
    if (!candidate.trim() || !reference.trim()) {
      setError('Please provide both your generated summary and the reference summary.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await evaluateRouge({ candidate, reference });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Evaluation failed. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rouge-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* 2. Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-start gap-4 bg-white">
          <div>
            <h3
              id="rouge-modal-title"
              className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5"
            >
              <Target size={20} className="text-rose-600 shrink-0" />
              <span>Accuracy Evaluation (ROUGE Metrics)</span>
            </h3>
            <p className="text-xs sm:text-sm font-normal text-slate-600 mt-1 leading-relaxed">
              Paste or upload your candidate summary and ground truth reference file to evaluate precision, recall, and F1 scores.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {error && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs sm:text-sm font-medium flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Two-Column Responsive Textarea Inputs (Stacked on mobile, side-by-side on sm+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Generated / Candidate Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileText size={16} className="text-indigo-600 shrink-0" />
                  <span>Generated Summary:</span>
                </label>
                <button
                  type="button"
                  onClick={() => candidateFileRef.current?.click()}
                  disabled={extractingFile === 'candidate'}
                  className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Upload size={14} className="text-slate-500 shrink-0" />
                  <span>{extractingFile === 'candidate' ? 'Reading...' : 'Upload File'}</span>
                </button>
                <input
                  ref={candidateFileRef}
                  type="file"
                  accept=".txt,.md,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files?.[0], 'candidate')}
                  className="hidden"
                />
              </div>
              <textarea
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                placeholder="Paste or upload generated summary text..."
                className="w-full h-36 sm:h-44 p-3.5 text-xs sm:text-sm font-normal bg-slate-50 focus:bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-400 transition-all shadow-inner"
              />
            </div>

            {/* Reference Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Reference Summary:</span>
                </label>
                <button
                  type="button"
                  onClick={() => referenceFileRef.current?.click()}
                  disabled={extractingFile === 'reference'}
                  className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Upload size={14} className="text-slate-500 shrink-0" />
                  <span>{extractingFile === 'reference' ? 'Reading...' : 'Upload File'}</span>
                </button>
                <input
                  ref={referenceFileRef}
                  type="file"
                  accept=".txt,.md,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files?.[0], 'reference')}
                  className="hidden"
                />
              </div>
              <textarea
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Paste or upload ground truth reference text..."
                className="w-full h-36 sm:h-44 p-3.5 text-xs sm:text-sm font-normal bg-slate-50 focus:bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Evaluate Accuracy Primary Button */}
          <button
            type="button"
            onClick={handleEvaluate}
            disabled={loading || !candidate.trim() || !reference.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin text-white shrink-0" />
                <span>Evaluating Accuracy...</span>
              </>
            ) : (
              <>
                <Target size={18} className="text-white shrink-0" />
                <span>Evaluate Accuracy (ROUGE-1, ROUGE-2, ROUGE-L)</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {results && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider">
                  Accuracy Evaluation Results:
                </h4>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  ROUGE Output
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ROUGE-1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-indigo-900 mb-0.5">
                      ROUGE-1 (Unigram Overlap)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono my-1">
                      {(results.rouge_1.f1 * 100).toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mb-2">
                      Vocabulary & content coverage overlap.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-mono font-medium flex justify-between">
                    <span>P: {(results.rouge_1.precision * 100).toFixed(0)}%</span>
                    <span>R: {(results.rouge_1.recall * 100).toFixed(0)}%</span>
                    <span className="font-semibold text-indigo-700">
                      F1: {results.rouge_1.f1.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* ROUGE-2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-purple-900 mb-0.5">
                      ROUGE-2 (Bigram Overlap)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono my-1">
                      {(results.rouge_2.f1 * 100).toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mb-2">
                      2-word phrase fluency & context preservation.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-mono font-medium flex justify-between">
                    <span>P: {(results.rouge_2.precision * 100).toFixed(0)}%</span>
                    <span>R: {(results.rouge_2.recall * 100).toFixed(0)}%</span>
                    <span className="font-semibold text-purple-700">
                      F1: {results.rouge_2.f1.toFixed(3)}
                    </span>
                  </div>
                </div>

                {/* ROUGE-L */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-900 mb-0.5">
                      ROUGE-L (Longest Subsequence)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono my-1">
                      {(results.rouge_l.f1 * 100).toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mb-2">
                      Structural word sequence & sentence flow.
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-600 font-mono font-medium flex justify-between">
                    <span>P: {(results.rouge_l.precision * 100).toFixed(0)}%</span>
                    <span>R: {(results.rouge_l.recall * 100).toFixed(0)}%</span>
                    <span className="font-semibold text-emerald-700">
                      F1: {results.rouge_l.f1.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric Reference Guide */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Academic Metric Definitions:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <strong>Precision (P):</strong> Fraction of summary words in reference.
                  </div>
                  <div>
                    <strong>Recall (R):</strong> Fraction of reference words captured.
                  </div>
                  <div>
                    <strong>F1-Score:</strong> Harmonic balance of Precision and Recall.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Secondary "Close" Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2 font-medium hover:bg-slate-50 transition-colors cursor-pointer text-sm shadow-xs active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

RougeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidateSummary: PropTypes.string,
};
