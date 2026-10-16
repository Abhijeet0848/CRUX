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
