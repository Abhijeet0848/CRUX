import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  History,
  Search,
  Trash2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Inbox,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchHistory, deleteHistoryRecord, clearAllHistory, fetchHistoryRecord } from '../services/api';
import EmptyState from './EmptyState';
import { emptyStatesConfig } from '../config/emptyStates';

/**
 * Method Color & Badge Formatting System
 * Standardized across entire app:
 * - FREQUENCY: bg-slate-100 text-slate-700 border-slate-200
 * - TFIDF:     bg-indigo-50 text-indigo-700 border-indigo-200
 * - HYBRID:    bg-purple-50 text-purple-700 border-purple-200
 */
const getMethodBadgeClass = (method) => {
  const m = (method || '').toLowerCase();
  if (m.includes('freq')) {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
  if (m.includes('tfidf') || m.includes('key')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }
  if (m.includes('hybrid') || m.includes('comb')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const getMethodLabel = (method) => {
  const m = (method || '').toLowerCase();
  if (m.includes('freq')) return 'Frequency';
  if (m.includes('tfidf') || m.includes('key')) return 'TF-IDF';
  if (m.includes('hybrid') || m.includes('comb')) return 'Hybrid';
  return method || 'Summary';
};

export default function HistoryPage({ onSelectRecord, onBackToWorkspace }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('all');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchHistory();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load summarization history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete record #${id}?`)) return;
    try {
      await deleteHistoryRecord(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Delete ALL saved summaries? This cannot be undone.')) return;
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      alert(err.message || 'Failed to clear history.');
    }
  };

  const handleOpenRecord = async (item) => {
    try {
      const fullRecord = await fetchHistoryRecord(item.id);
      onSelectRecord(fullRecord);
      if (onBackToWorkspace) onBackToWorkspace();
    } catch (err) {
      onSelectRecord(item);
      if (onBackToWorkspace) onBackToWorkspace();
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesMethod =
      selectedMethodFilter === 'all' ||
      (item.method && item.method.toLowerCase().includes(selectedMethodFilter.toLowerCase()));
    const matchesSearch =
      (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.original_text && item.original_text.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMethod && matchesSearch;
  });

  // Empty state when there is no history at all
  if (!loading && history.length === 0) {
    const config = emptyStatesConfig.history;
    return (
      <EmptyState
        icon={config.icon}
        accent={config.accent}
        title={config.title}
        description={config.description}
        preview={config.preview}
        onPrimary={onBackToWorkspace}
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm my-3 sm:my-5 animate-in fade-in duration-150">
      {/* 1. Header Row with History Lucide icon (32px, text-purple-600 in bg-purple-50 container) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 shadow-xs">
            <History size={32} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Saved Summaries
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Search, reopen, and manage your past summaries.
            </p>
          </div>
        </div>

        {/* Header Actions: Back and Clear All */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onBackToWorkspace && (
            <button
              type="button"
              onClick={onBackToWorkspace}
              className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer text-sm shadow-xs active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="border border-red-200 text-red-600 rounded-lg px-4 py-2 font-medium hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer text-sm shadow-xs active:scale-95"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-indigo-500 outline-none text-slate-800 font-normal placeholder:text-slate-400 transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="history-method-filter" className="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
            Method:
          </label>
          <select
            id="history-method-filter"
            value={selectedMethodFilter}
            onChange={(e) => setSelectedMethodFilter(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:border-indigo-500 outline-none text-slate-800 font-medium cursor-pointer shadow-2xs"
          >
            <option value="all">All Methods</option>
            <option value="frequency">Word Frequency</option>
            <option value="tfidf">Key Words (TF-IDF)</option>
            <option value="hybrid">Combined (Hybrid)</option>
          </select>
        </div>
      </div>

      {/* Local Error Alert */}
      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 font-medium flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="text-red-800 font-bold underline cursor-pointer ml-2 hover:text-red-950"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. History Items List */}
      <div className="divide-y divide-slate-200">
        {loading ? (
          <div className="py-14 text-center text-slate-500 text-xs sm:text-sm font-normal flex flex-col items-center justify-center gap-2">
            <RefreshCw size={24} className="animate-spin text-purple-600" />
            <span>Loading saved records...</span>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-14 text-center text-slate-500 text-xs sm:text-sm font-normal flex flex-col items-center justify-center gap-2">
            <Inbox className="w-8 h-8 text-slate-400" />
            <p>
              {searchTerm || selectedMethodFilter !== 'all'
                ? 'No records match your search or filter.'
                : 'No saved summaries yet. Summarize an article to create your first record.'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="py-4 hover:bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
              onClick={() => handleOpenRecord(item)}
            >
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">#{item.id}</span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getMethodBadgeClass(
                      item.method
                    )}`}
                  >
                    {getMethodLabel(item.method)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    {item.num_selected_sentences} sentences
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>{item.created_at}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    title="Delete record"
                    aria-label={`Delete record #${item.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Summary Text Content */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal line-clamp-3 my-1.5">
                "{item.summary}"
              </p>

              {/* Telemetry Footer */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-600 font-medium mt-3 pt-2 border-t border-slate-100">
                <span>
                  Original: <strong className="text-slate-800">{item.original_word_count}</strong> words
                </span>
                <span>&bull;</span>
                <span>
                  Summary: <strong className="text-slate-800">{item.summary_word_count}</strong> words
                </span>
                <span>&bull;</span>
                <span className="text-emerald-700 font-semibold">
                  -{Math.round((1 - item.compression_ratio) * 100)}% shorter
                </span>
                <span className="ml-auto text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-colors group-hover:underline">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

HistoryPage.propTypes = {
  onSelectRecord: PropTypes.func.isRequired,
  onBackToWorkspace: PropTypes.func,
};
