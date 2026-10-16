import React, { useState, useEffect } from 'react';
import { BarChart3, Zap } from 'lucide-react';
import NavBar from './components/NavBar';
import SummarizePage from './components/SummarizePage';
import StatsGrid from './components/StatsGrid';
import NLPAnalysis from './components/NLPAnalysis';
import SentenceScoresPage from './components/SentenceScoresPage';
import StatsChartsPage from './components/StatsChartsPage';
import CompareMethodsPage from './components/CompareMethodsPage';
import HistoryPage from './components/HistoryPage';
import AccuracyCheckPage from './components/AccuracyCheckPage';
import RougeModal from './components/RougeModal';
import BottomNavBar from './components/BottomNavBar';
import { summarizeText, compareAlgorithms } from './services/api';

export const SAMPLE_ARTICLE = `Artificial intelligence is rapidly transforming modern healthcare delivery and clinical research. Machine learning models can analyze vast datasets of medical imaging and patient records far more rapidly than conventional methods. Researchers are deploying predictive algorithms to detect early warning signs of complex conditions before symptoms become severe. Diagnostic support tools powered by natural language processing help clinicians evaluate medical literature and synthesize relevant patient history. However, deploying automated intelligence requires strict adherence to data privacy, algorithmic transparency, and clinical validation. Health organizations must balance computational innovation with rigorous safeguards to protect sensitive patient records and maintain medical ethics.`;

/**
 * App Shell
 *
 * Root container for SummaSphere application:
 * Breakpoint strategy:
 * - Mobile (< 640px):
 *   - Root: w-full max-w-full min-h-screen (natural page scroll, no fixed height)
 *   - Header: compact h-14 with logo + title, desktop tabs hidden, icon-only Accuracy Check
 *   - Main layout: single column stacked, pb-24 reserving clearance for BottomNav
 *   - Bottom navigation: fixed at bottom (h-16), 5 navigation items
 * - Tablet (640px - 1023px):
 *   - Root: w-full max-w-full min-h-screen (smooth natural page scroll)
 *   - Header: h-16, top navigation visible with "More" dropdown
 *   - Main layout: single column stacked, natural scroll, sm:pb-8
 *   - Bottom navigation: hidden (sm:hidden)
 * - Desktop (>= 1024px):
 *   - Root: lg:h-screen lg:overflow-hidden (strict viewport-locked layout, no page scroll)
 *   - Header: lg:h-16 with full segmented navigation bar
 *   - Main layout: lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6 lg:min-h-0 lg:overflow-hidden
 *   - Bottom navigation: hidden
 */
export default function App() {
  const [currentView, setCurrentView] = useState('workspace'); // 'workspace' | 'nlp_analysis' | 'ranking' | 'analytics' | 'compare' | 'history' | 'accuracy'

  const [text, setText] = useState('');
  const [method, setMethod] = useState('hybrid');
  const [numSentences, setNumSentences] = useState(3);
  const [frequencyWeight, setFrequencyWeight] = useState(50); // 0-100% single state for auto-balancing

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Multi-Algorithm Comparison state
  const [compareData, setCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [referenceSummary, setReferenceSummary] = useState('');

  const [isRougeOpen, setIsRougeOpen] = useState(false);

  // Clear stale errors when navigating between tabs
  useEffect(() => {
    setError('');
  }, [currentView]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please paste, type, or upload an article before summarizing.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await summarizeText({
        text,
        method,
        num_sentences: numSentences,
        weight_frequency: frequencyWeight / 100,
        weight_tfidf: (100 - frequencyWeight) / 100,
      });
      setSummaryData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate summary. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCompare = async () => {
    if (!text.trim()) {
      return;
    }
    setError('');
    setCompareLoading(true);

    try {
      const data = await compareAlgorithms({
        text,
        num_sentences: numSentences,
        weight_frequency: frequencyWeight / 100,
        weight_tfidf: (100 - frequencyWeight) / 100,
        reference_summary: referenceSummary,
      });
      setCompareData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Algorithm comparison failed.');
    } finally {
      setCompareLoading(false);
    }
  };

  const handleLoadSample = () => {
    setText(SAMPLE_ARTICLE);
    setError('');
  };

  const handleSelectHistoryRecord = (record) => {
    if (record.original_text) {
      setText(record.original_text);
    }
    if (record.method) {
      setMethod(record.method);
    }
    if (record.weight_frequency !== undefined && record.weight_frequency !== null) {
      setFrequencyWeight(Math.round(record.weight_frequency * 100));
    }
    setSummaryData({
      summary: record.summary,
      method: record.method,
      original_sentence_count: record.original_sentence_count || record.num_selected_sentences,
      summary_sentence_count: record.num_selected_sentences,
      original_word_count: record.original_word_count,
      summary_word_count: record.summary_word_count,
      compression_ratio: record.compression_ratio,
      processing_time_ms: record.processing_time_ms,
      sentences: [],
    });
    setCurrentView('workspace');
  };

  return (
    /* 
      Root Container:
      - Mobile (< 640px) & Tablet (640-1023px): w-full max-w-full min-h-screen flex flex-col (allows natural vertical page scroll)
      - Desktop (>= 1024px): lg:h-screen lg:overflow-hidden (viewport-locked layout)
    */
    <div className="w-full max-w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 text-slate-900 font-sans">
      {/* Top Header: flex-shrink-0 (sticky at top) */}
      <NavBar
        currentView={currentView}
        setView={setCurrentView}
        onOpenRouge={() => setIsRougeOpen(true)}
        hasSummary={!!summaryData}
      />

      {/* 
        Main View Container:
        - Mobile (< 640px): flex-1 w-full max-w-full min-w-0 overflow-x-hidden (natural page scroll)
        - Desktop (>= 1024px): lg:overflow-hidden lg:flex-1 lg:min-h-0
      */}
      <main className="flex-1 w-full max-w-full min-h-0 min-w-0 flex flex-col overflow-x-hidden lg:overflow-hidden">
        {/* Error Alert */}
        {error && (
          <div className="flex-shrink-0 min-w-0 mx-3 sm:mx-6 my-2 p-3 bg-red-50/90 border border-red-200 rounded-xl text-xs sm:text-sm font-semibold text-red-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="flex-shrink-0">⚠️</span>
              <span className="truncate">{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 font-bold text-sm cursor-pointer ml-2 flex-shrink-0"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Summarizer Studio View */}
        {currentView === 'workspace' && (
          <div className="flex-1 w-full min-h-0 min-w-0 flex flex-col lg:overflow-hidden">
            <SummarizePage
              text={text}
              setText={setText}
              method={method}
              setMethod={setMethod}
              numSentences={numSentences}
              setNumSentences={setNumSentences}
              frequencyWeight={frequencyWeight}
              setFrequencyWeight={setFrequencyWeight}
              onSummarize={handleSummarize}
              loading={loading}
              error={error}
              summaryData={summaryData}
              onClear={() => {
                setText('');
                setSummaryData(null);
                setError('');
              }}
              onLoadSample={handleLoadSample}
            />

            {/* Mobile & Tablet Additional Metrics (< 1024px) */}
            {summaryData && (
              <div className="lg:hidden space-y-4 animate-fade-up px-3 sm:px-4 mt-2 pb-24 sm:pb-8">
                <StatsGrid stats={summaryData} />

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <button
                    onClick={() => setCurrentView('nlp_analysis')}
                    className="p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl text-left transition-all hover:shadow-md group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                      <span className="p-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">🔬</span>
                      <span>NLP Analysis</span>
                      <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto font-bold">→</span>
                    </div>
                    <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                      View tokens, removed stop-words, and word lemmas.
                    </p>
                  </button>

                  <button
                    onClick={() => setCurrentView('ranking')}
                    className="p-4 bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl text-left transition-all hover:shadow-md group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                      <span className="p-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">📋</span>
                      <span>Sentence Scores</span>
                      <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto font-bold">→</span>
                    </div>
                    <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                      View scores and ranking for each sentence.
                    </p>
                  </button>

                  <button
                    onClick={() => setCurrentView('analytics')}
                    className="p-4 bg-white border border-slate-200 hover:border-violet-500 rounded-2xl text-left transition-all hover:shadow-md group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                      <span className="p-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-100">📊</span>
                      <span>Stats & Charts</span>
                      <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto font-bold">→</span>
                    </div>
                    <p className="text-xs sm:text-sm font-normal text-slate-600 leading-relaxed">
                      Word frequencies and sentence score distributions.
                    </p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. NLP Analysis View */}
        {currentView === 'nlp_analysis' && (
          <div className="w-full min-w-0 flex-1 flex flex-col overflow-y-auto">
            <NLPAnalysis
              summaryData={summaryData}
              originalText={text}
              loading={loading}
              error={error}
              onGoToSummarizer={() => setCurrentView('workspace')}
              onRetry={handleSummarize}
            />
          </div>
        )}

        {/* 3. Sentence Ranking View */}
        {currentView === 'ranking' && (
          <div className="w-full min-w-0 flex-1 flex flex-col overflow-y-auto">
            <SentenceScoresPage
              sentences={summaryData?.sentences}
              onGoToSummarizer={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 4. Stats & Charts Analytics View */}
        {currentView === 'analytics' && (
          <div className="w-full min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-8 lg:pb-6 overflow-y-auto">
            <StatsChartsPage
              summaryData={summaryData}
              originalText={text}
              onGoToSummarizer={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 5. Algorithm Comparison View */}
        {currentView === 'compare' && (
          <div className="w-full min-w-0 flex-1 flex flex-col overflow-y-auto">
            <CompareMethodsPage
              sourceText={text}
              compareData={compareData}
              loading={compareLoading}
              onRunCompare={handleRunCompare}
              referenceSummary={referenceSummary}
              setReferenceSummary={setReferenceSummary}
              onGoToSummarizer={() => setCurrentView('workspace')}
              onLoadSampleAndAnalyze={handleLoadSample}
            />
          </div>
        )}

        {/* 6. History Database View */}
        {currentView === 'history' && (
          <div className="w-full min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-8 lg:pb-6 overflow-y-auto">
            <HistoryPage
              onSelectRecord={handleSelectHistoryRecord}
              onBackToWorkspace={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 7. Accuracy Check View */}
        {currentView === 'accuracy' && (
          <div className="w-full min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-8 lg:pb-6 overflow-y-auto">
            <AccuracyCheckPage
              candidateSummary={summaryData?.summary || ''}
              onGoToSummarizer={() => setCurrentView('workspace')}
              onLoadSampleAndAnalyze={handleLoadSample}
            />
          </div>
        )}
      </main>

      {/* ROUGE Modal */}
      <RougeModal
        isOpen={isRougeOpen}
        onClose={() => setIsRougeOpen(false)}
        candidateSummary={summaryData?.summary || ''}
      />

      {/* Footer: Compact status bar with clearance on mobile */}
      <footer className="flex-shrink-0 border-t border-slate-200/80 bg-white py-2 px-4 sm:px-6 text-center lg:text-left text-[11px] text-slate-400 font-medium pb-20 sm:pb-2 lg:pb-2">
        <p>SummaSphere v1.0.0 · Intelligent Extractive Text Summarization System</p>
      </footer>

      {/* Floating Sticky Bottom Navigation Bar (Visible only on mobile < 640px) */}
      <BottomNavBar
        currentView={currentView}
        setView={setCurrentView}
        onOpenRouge={() => setIsRougeOpen(true)}
        hasSummary={!!summaryData}
      />
    </div>
  );
}
