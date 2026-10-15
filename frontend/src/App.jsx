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

export default function App() {
  const [currentView, setCurrentView] = useState('workspace'); // 'workspace' | 'nlp_analysis' | 'ranking' | 'analytics' | 'compare' | 'history'

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

  // Clear any stale errors whenever navigating between tabs
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

  const renderEmptyState = (title, description) => (
    <div className="min-h-[calc(100vh-250px)] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:px-10 sm:py-12 text-center shadow-sm max-w-xl w-full mx-auto space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-xs">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">{description}</p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('workspace')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl px-6 py-3 font-medium cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
          >
            <Zap className="w-[18px] h-[18px]" />
            <span>Go to Summarizer</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    /* Root Wrapper: h-screen w-screen max-w-full overflow-hidden flex flex-col (prevents page-level scrollbars) */
    <div className="h-screen w-screen max-w-full overflow-hidden flex flex-col bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100/90 text-slate-900 font-sans">
      {/* Top Navigation: flex-shrink-0 (pinned at top) */}
      <NavBar
        currentView={currentView}
        setView={setCurrentView}
        onOpenRouge={() => setIsRougeOpen(true)}
        hasSummary={!!summaryData}
      />

      {/* Main Container: flex-1 w-full max-w-full min-h-0 min-w-0 px-4 lg:px-6 py-4 flex flex-col overflow-x-hidden lg:overflow-hidden */}
      {/* min-w-0 prevents horizontal overflow and allows flex/grid children to shrink below intrinsic content width */}
      <main className="flex-1 w-full max-w-full min-h-0 min-w-0 px-4 lg:px-6 py-4 flex flex-col overflow-x-hidden overflow-y-auto lg:overflow-hidden">
        {/* Error Alert */}
        {error && (
          <div className="flex-shrink-0 min-w-0 mb-3 p-3 bg-red-50/90 border border-red-200 rounded-xl text-xs sm:text-sm font-semibold text-red-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="flex-shrink-0">⚠️</span>
              <span className="truncate">{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 font-bold text-sm cursor-pointer ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Summarizer Studio View: flex-1 min-h-0 min-w-0 overflow-hidden */}
        {/* min-w-0 prevents workspace container from forcing horizontal expansion */}
        {currentView === 'workspace' && (
          <div className="flex-1 w-full min-h-0 min-w-0 flex flex-col overflow-hidden">
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
            />

            {/* Mobile-only additional metrics (<1024px) allowing vertical page scrolling on small viewports */}
            {summaryData && (
              <div className="lg:hidden space-y-4 animate-fade-up mt-4 pb-24">
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
          <div className="w-full">
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
          <div className="w-full">
            <SentenceScoresPage
              sentences={summaryData?.sentences}
              onGoToSummarizer={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 4. Stats & Charts Analytics View */}
        {currentView === 'analytics' && (
          <div className="w-full">
            <StatsChartsPage
              summaryData={summaryData}
              originalText={text}
              onGoToSummarizer={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 5. Algorithm Comparison View */}
        {currentView === 'compare' && (
          <div className="w-full">
            <CompareMethodsPage
              sourceText={text}
              compareData={compareData}
              loading={compareLoading}
              onRunCompare={handleRunCompare}
              referenceSummary={referenceSummary}
              setReferenceSummary={setReferenceSummary}
              onGoToSummarizer={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 6. History Database View */}
        {currentView === 'history' && (
          <div className="w-full">
            <HistoryPage
              onSelectRecord={handleSelectHistoryRecord}
              onBackToWorkspace={() => setCurrentView('workspace')}
            />
          </div>
        )}

        {/* 7. Accuracy Check View */}
        {currentView === 'accuracy' && (
          <div className="w-full">
            <AccuracyCheckPage
              candidateSummary={summaryData?.summary || ''}
              onGoToSummarizer={() => setCurrentView('workspace')}
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

      {/* Footer: flex-shrink-0 compact status bar */}
      <footer className="flex-shrink-0 border-t border-slate-200/80 bg-white py-1.5 px-4 sm:px-6 text-center lg:text-left text-[11px] text-slate-400 font-medium pb-20 lg:pb-1.5">
        <p>SummaSphere v1.0.0 · Intelligent Extractive Text Summarization System</p>
      </footer>

      {/* Floating Sticky Bottom Navigation Bar */}
      <BottomNavBar
        currentView={currentView}
        setView={setCurrentView}
        onOpenRouge={() => setIsRougeOpen(true)}
        hasSummary={!!summaryData}
      />
    </div>
  );
}
