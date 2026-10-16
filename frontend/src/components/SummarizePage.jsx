import React from 'react';
import PropTypes from 'prop-types';
import MainLayout from './MainLayout';

/**
 * SummarizePage
 *
 * Serves as the primary Summarizer Studio page view, delegating layout
 * and component hierarchy to MainLayout.
 */
export default function SummarizePage(props) {
  return <MainLayout {...props} />;
}

SummarizePage.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
  numSentences: PropTypes.number.isRequired,
  setNumSentences: PropTypes.func.isRequired,
  frequencyWeight: PropTypes.number.isRequired,
  setFrequencyWeight: PropTypes.func.isRequired,
  onSummarize: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  summaryData: PropTypes.object,
  onClear: PropTypes.func,
};
