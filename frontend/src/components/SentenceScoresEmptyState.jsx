import React from 'react';
import PropTypes from 'prop-types';
import {
  ListOrdered,
  TrendingUp,
  Percent,
  Highlighter,
} from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * MockScorePreview
 *
 * Mock score preview (#1, #2, #3 badges with colored progress bars) displayed
 * directly above the feature cards in the Sentence Scores empty state.
 */
function MockScorePreview() {
  const mockScores = [
    { rank: '#1', width: 'w-4/5', score: '0.94', gradient: 'from-purple-500 to-indigo-600' },
    { rank: '#2', width: 'w-3/5', score: '0.78', gradient: 'from-purple-400 to-indigo-500' },
    { rank: '#3', width: 'w-2/5', score: '0.61', gradient: 'from-purple-300 to-indigo-400' },
  ];

  return (
    <div
      aria-hidden="true"
      className="inline-flex flex-col gap-2.5 bg-gray-50/90 border border-gray-100 rounded-xl p-3 sm:p-4 mt-5 mx-auto w-full max-w-sm shadow-2xs select-none"
    >
      {mockScores.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-3 text-sm">
          <span className="w-8 h-8 rounded-md bg-purple-100 text-purple-600 border border-purple-200/80 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {item.rank}
          </span>
          <div className="flex-1 bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${item.gradient} ${item.width}`} />
          </div>
          <span className="font-mono text-gray-600 font-semibold text-xs tabular-nums shrink-0">
            {item.score}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * SentenceScoresEmptyState
 *
 * Mobile-first empty state for the Sentence Scores (Ranking) view when no summary has been run.
 * Powered by the shared EmptyState component to guarantee 100% visual and structural
 * alignment with NLP Analysis and Compare Methods across all breakpoints.
 */
export default function SentenceScoresEmptyState({
  onGoToSummarizer,
  showHeader = false,
  showBottomNav = false,
  currentView = 'ranking',
  setView,
}) {
  const features = [
    {
      id: 'ranked_list',
      icon: TrendingUp,
      title: 'Ranked List',
      subtitle: 'Sentences ordered by mathematical importance and salience score.',
    },
    {
      id: 'score_breakdown',
      icon: Percent,
      title: 'Score Breakdown',
      subtitle: 'Luhn word frequency, TF-IDF weights, and composite ranking factors.',
    },
    {
      id: 'selected_extract',
      icon: Highlighter,
      title: 'Selected Extract',
      subtitle: 'Visual color-coding of top-K sentences chosen for the final summary.',
    },
  ];

  return (
    <EmptyState
      icon={ListOrdered}
      iconColor="purple"
      accent="purple"
      title="No Sentence Scores Yet"
      description="Run a summary to see every sentence scored, ranked, and color-coded by its contribution to the final extract."
      preview={MockScorePreview}
      features={features}
      ctaLabel="Run a Summary"
      ctaAction={onGoToSummarizer}
      secondaryLabel="Go to Summarize"
      onSecondary={onGoToSummarizer}
      showHeader={showHeader}
      showBottomNav={showBottomNav}
      currentView={currentView}
      setView={setView}
    />
  );
}

SentenceScoresEmptyState.propTypes = {
  onGoToSummarizer: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
  showBottomNav: PropTypes.bool,
  currentView: PropTypes.string,
  setView: PropTypes.func,
};
