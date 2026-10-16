import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart3,
  Scissors,
  Filter,
  GitBranch,
} from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * NlpAnalysisEmptyState
 *
 * Mobile-first empty state for the NLP Analysis view when no summary has been run.
 * Powered by the shared EmptyState component to guarantee 100% visual and structural
 * alignment with Sentence Scores and Compare Methods across all breakpoints.
 */
export default function NlpAnalysisEmptyState({
  onGoToSummarizer,
  showHeader = false,
  showBottomNav = false,
  currentView = 'nlp_analysis',
  setView,
}) {
  const features = [
    {
      id: 'tokenization',
      icon: Scissors,
      title: 'Tokenization',
      subtitle: 'Word & sentence boundary segmentation for granular linguistic units.',
    },
    {
      id: 'stopwords',
      icon: Filter,
      title: 'Stop-word Removal',
      subtitle: 'Noise filtering per language to isolate semantic content words.',
    },
    {
      id: 'lemmatization',
      icon: GitBranch,
      title: 'Lemmatization',
      subtitle: 'Root-form normalization mapping inflected words to dictionary lemmas.',
    },
  ];

  return (
    <EmptyState
      icon={BarChart3}
      iconColor="indigo"
      accent="indigo"
      title="No NLP Analysis Data Yet"
      description="Run a summary to unlock tokenization, stop-word removal, and lemmatization insights computed live on your source text."
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

NlpAnalysisEmptyState.propTypes = {
  onGoToSummarizer: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
  showBottomNav: PropTypes.bool,
  currentView: PropTypes.string,
  setView: PropTypes.func,
};
