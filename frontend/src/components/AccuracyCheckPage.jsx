import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Upload,
  Zap,
  Sparkles,
  CheckCircle2,
  Scale,
  RefreshCw,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { evaluateRouge, extractDocument } from '../services/api';
import EmptyState from './EmptyState';
import { emptyStatesConfig } from '../config/emptyStates';

/**
 * AccuracyCheckPage
 * Renders the ROUGE accuracy evaluation workspace, or the rose EmptyState
 * when no candidate/reference summary is loaded yet.
 */
export default function AccuracyCheckPage({
  candidateSummary = '',
  onGoToSummarizer,
}) {
  const [reference, setReference] = useState('');
  const [candidate, setCandidate] = useState(candidateSummary || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractingFile, setExtractingFile] = useState(null);
  const [error, setError] = useState('');

  const candidateFileRef = useRef(null);
  const referenceFileRef = useRef(null);

  React.useEffect(() => {
    if (candidateSummary) {
      setCandidate(candidateSummary);
    }
  }, [candidateSummary]);

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
      setError(err.message || 'Evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  // If there is no candidate summary and no user input reference, show the custom EmptyState
  const hasInput = candidate.trim().length > 0 || reference.trim().length > 0;

  if (!hasInput) {
    const config = emptyStatesConfig.accuracyCheck;
    return (
      <EmptyState
        icon={config.icon}
        accent={config.accent}
        title={config.title}
        description={config.description}
        preview={config.preview}
        onPrimary={onGoToSummarizer}
      />
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6 space-y-5 max-w-4xl mx-auto w-full animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <Scale className="w-5 h-5" />
              </span>
              <span>Accuracy Check &bull; ROUGE Evaluation</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Compare your extractive summary against a reference human summary to compute statistical overlap.
            </p>
          </div>
          {onGoToSummarizer && (
            <button
              type="button"
              onClick={onGoToSummarizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <span>Back to Summarizer</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Two-column Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Extracted Summary:</span>
              </label>
              <button
                type="button"
                onClick={() => candidateFileRef.current?.click()}
                disabled={extractingFile === 'candidate'}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{extractingFile === 'candidate' ? 'Reading...' : 'Upload File'}</span>
              </button>
              <input
                ref={candidateFileRef}
                type="file"
                accept=".txt,.md"
                onChange={(e) => handleFileUpload(e.target.files?.[0], 'candidate')}
                className="hidden"
              />
            </div>
            <textarea
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
              placeholder="Paste or upload the generated candidate summary..."
              className="w-full h-36 p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white resize-none text-slate-800"
            />
          </div>

          {/* Reference Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span>Reference Summary (Ground Truth):</span>
              </label>
              <button
                type="button"
                onClick={() => referenceFileRef.current?.click()}
                disabled={extractingFile === 'reference'}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{extractingFile === 'reference' ? 'Reading...' : 'Upload File'}</span>
              </button>
              <input
                ref={referenceFileRef}
                type="file"
                accept=".txt,.md"
                onChange={(e) => handleFileUpload(e.target.files?.[0], 'reference')}
                className="hidden"
              />
            </div>
            <textarea
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Paste or upload ground truth reference text..."
              className="w-full h-36 p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-rose-500 focus:bg-white resize-none text-slate-800"
            />
          </div>
        </div>

        {/* Evaluate Button */}
        <button
          type="button"
          onClick={handleEvaluate}
          disabled={loading || !candidate.trim() || !reference.trim()}
          className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Evaluating Accuracy...</span>
            </>
          ) : (
            <>
              <Scale className="w-4 h-4" />
              <span>Evaluate Accuracy (ROUGE-1, ROUGE-2, ROUGE-L)</span>
            </>
          )}
        </button>

        {/* Results */}
        {results && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wider">
              ROUGE Metric Evaluation Scores:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
                <div className="text-xs font-semibold text-slate-600 mb-1">ROUGE-1 (Unigram)</div>
                <div className="text-xl font-bold text-rose-600 font-mono">
                  {results.rouge1 ? (results.rouge1.f1 * 100).toFixed(1) : 0}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  P: {(results.rouge1?.precision * 100 || 0).toFixed(0)}% &bull; R: {(results.rouge1?.recall * 100 || 0).toFixed(0)}%
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
                <div className="text-xs font-semibold text-slate-600 mb-1">ROUGE-2 (Bigram)</div>
                <div className="text-xl font-bold text-purple-600 font-mono">
                  {results.rouge2 ? (results.rouge2.f1 * 100).toFixed(1) : 0}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  P: {(results.rouge2?.precision * 100 || 0).toFixed(0)}% &bull; R: {(results.rouge2?.recall * 100 || 0).toFixed(0)}%
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-2xs">
                <div className="text-xs font-semibold text-slate-600 mb-1">ROUGE-L (Subsequence)</div>
                <div className="text-xl font-bold text-indigo-600 font-mono">
                  {results.rougeL ? (results.rougeL.f1 * 100).toFixed(1) : 0}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  P: {(results.rougeL?.precision * 100 || 0).toFixed(0)}% &bull; R: {(results.rougeL?.recall * 100 || 0).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AccuracyCheckPage.propTypes = {
  candidateSummary: PropTypes.string,
  onGoToSummarizer: PropTypes.func.isRequired,
};
