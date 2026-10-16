import React from 'react';
import PropTypes from 'prop-types';
import SentenceTable from './SentenceTable';
import SentenceScoresEmptyState from './SentenceScoresEmptyState';

/**
 * SentenceScoresPage
 * Renders the ranked sentence score table when summary data is present,
 * or the mobile-first SentenceScoresEmptyState with mock score preview when empty.
 */
export default function SentenceScoresPage({
  sentences,
  onGoToSummarizer,
}) {
  const hasSentences = Array.isArray(sentences) && sentences.length > 0;

  if (!hasSentences) {
    return (
      <SentenceScoresEmptyState
        onGoToSummarizer={onGoToSummarizer}
      />
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6 space-y-5 animate-in fade-in duration-150">
      <SentenceTable sentences={sentences} />
    </div>
  );
}

SentenceScoresPage.propTypes = {
  sentences: PropTypes.array,
  onGoToSummarizer: PropTypes.func.isRequired,
};
