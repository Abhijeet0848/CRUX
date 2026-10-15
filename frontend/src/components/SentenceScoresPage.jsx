import React from 'react';
import PropTypes from 'prop-types';
import { Zap, Sparkles } from 'lucide-react';
import SentenceTable from './SentenceTable';
import EmptyState from './EmptyState';
import { emptyStatesConfig } from '../config/emptyStates';

/**
 * SentenceScoresPage
 * Renders the ranked sentence score table when summary data is present,
 * or the customized purple EmptyState with ranked list mock visual when empty.
 */
export default function SentenceScoresPage({
  sentences,
  onGoToSummarizer,
}) {
  const hasSentences = Array.isArray(sentences) && sentences.length > 0;

  if (!hasSentences) {
    const config = emptyStatesConfig.sentenceScores;
    return (
      <EmptyState
        icon={config.icon}
        accent={config.accent}
        title={config.title}
        description={config.description}
        preview={config.preview}
        mockVisual={config.mockVisual}
        onPrimary={onGoToSummarizer}
      />
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <SentenceTable sentences={sentences} />
    </div>
  );
}

SentenceScoresPage.propTypes = {
  sentences: PropTypes.array,
  onGoToSummarizer: PropTypes.func.isRequired,
};
