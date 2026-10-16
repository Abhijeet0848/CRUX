import React from 'react';
import PropTypes from 'prop-types';
import ComparisonSection from './ComparisonSection';
import CompareMethodsEmptyState from './CompareMethodsEmptyState';

/**
 * CompareMethodsPage
 *
 * Renders the multi-algorithm comparison section when source text or comparison results exist,
 * or the mobile-first CompareMethodsEmptyState when no summary has been run yet.
 */
export default function CompareMethodsPage({
  sourceText = '',
  compareData,
  loading = false,
  onRunCompare,
  referenceSummary = '',
  setReferenceSummary,
  onGoToSummarizer,
  onLoadSampleAndAnalyze,
}) {
  const hasSource = Boolean(sourceText?.trim());

  // Render unified mobile-first empty state when no article/summary is present
  if (!compareData && !loading && !hasSource) {
    return (
      <CompareMethodsEmptyState
        onGoToSummarizer={onGoToSummarizer}
      />
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 pb-24 sm:pb-8 lg:pb-6 space-y-5 animate-in fade-in duration-150">
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
