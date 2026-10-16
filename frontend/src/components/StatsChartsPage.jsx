import React from 'react';
import PropTypes from 'prop-types';
import { Zap, Sparkles } from 'lucide-react';
import StatsGrid from './StatsGrid';
import ScoreChart from './ScoreChart';
import EmptyState from './EmptyState';
import { emptyStatesConfig } from '../config/emptyStates';

/**
 * StatsChartsPage
 * Renders statistical KPI cards and charts when summary data is present,
 * or the customized blue EmptyState when empty.
 */
export default function StatsChartsPage({
  summaryData,
  originalText,
  onGoToSummarizer,
}) {
  if (!summaryData) {
    const config = emptyStatesConfig.statsCharts;
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

  const sentences = summaryData.sentences || [];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <StatsGrid stats={summaryData} />
      {sentences.length > 0 ? (
        <ScoreChart
          sentences={sentences}
          wordFrequencies={summaryData.word_frequencies}
          stats={summaryData}
          originalText={originalText}
        />
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs">
          No sentence details available for this summary.
        </div>
      )}
    </div>
  );
}

StatsChartsPage.propTypes = {
  summaryData: PropTypes.object,
  originalText: PropTypes.string,
  onGoToSummarizer: PropTypes.func.isRequired,
};
