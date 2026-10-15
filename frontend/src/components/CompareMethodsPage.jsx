import React from 'react';
import PropTypes from 'prop-types';
import ComparisonSection from './ComparisonSection';

/**
 * CompareMethodsPage
 * First-class page component for algorithm comparison view with on-brand EmptyState.
 */
export default function CompareMethodsPage({
  sourceText = '',
  compareData,
  loading,
  onRunCompare,
  referenceSummary,
  setReferenceSummary,
  onGoToSummarizer,
  onLoadSampleAndAnalyze,
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <ComparisonSection
        sourceText={sourceText}
        compareData={compareData}
        loading={loading}
        onRunCompare={onRunCompare}
        referenceSummary={referenceSummary}
        setReferenceSummary={setReferenceSummary}
        onGoToSummarizer={onGoToSummarizer}
        onLoadSampleAndAnalyze={onLoadSampleAndAnalyze}
      />
    </div>
  );
}

CompareMethodsPage.propTypes = {
  sourceText: PropTypes.string,
  compareData: PropTypes.object,
  loading: PropTypes.bool,
  onRunCompare: PropTypes.func.isRequired,
  referenceSummary: PropTypes.string,
  setReferenceSummary: PropTypes.func,
  onGoToSummarizer: PropTypes.func,
  onLoadSampleAndAnalyze: PropTypes.func,
};
