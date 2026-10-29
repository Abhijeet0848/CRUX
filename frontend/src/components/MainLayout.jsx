import React from 'react';
import PropTypes from 'prop-types';
import InputCard from './InputCard';
import SummaryCard from './SummaryCard';

/**
 * MainLayout
 *
 * Core layout container for the Summarizer Studio:
 * - Height: Constrained to viewport (`h-full min-h-0 flex-1 overflow-hidden lg:h-[calc(100vh-100px)]`)
 * - Desktop: 2-column grid (`lg:grid lg:grid-cols-2 lg:gap-5`) with strictly pinned cards
 * - Mobile: Scrollable column with bottom-bar clearance (`pb-24`)
 */
export default function MainLayout({
  text,
  setText,
  method,
  setMethod,
  numSentences,
  setNumSentences,
  frequencyWeight,
  setFrequencyWeight,
  onSummarize,
  loading,
  error,
  summaryData,
  onClear,
}) {
  return (
    <div
      className="w-full min-h-0 flex-1 flex flex-col gap-4 p-4 sm:p-6 pb-28 sm:pb-32 lg:pb-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:p-4 xl:p-5 lg:h-[calc(100vh-100px)] lg:overflow-hidden bg-slate-50 items-stretch"
    >
      {/* Left Column: Input Card & Controls */}
      <div className="w-full min-h-0 lg:h-full lg:overflow-hidden">
        <InputCard
          text={text}
          setText={setText}
          method={method}
          setMethod={setMethod}
          numSentences={numSentences}
          setNumSentences={setNumSentences}
          frequencyWeight={frequencyWeight}
          setFrequencyWeight={setFrequencyWeight}
          onSummarize={onSummarize}
          loading={loading}
          error={error}
          onClear={onClear}
        />
      </div>

      {/* Right Column: Summary Card */}
      <div className="w-full min-h-0 lg:h-full lg:overflow-hidden">
        <SummaryCard
          summary={summaryData?.summary || ''}
          method={summaryData?.method || method}
          compressionRatio={summaryData?.compression_ratio || 0}
          loading={loading}
          error={error}
          onRetry={onSummarize}
        />
      </div>
    </div>
  );
}

MainLayout.propTypes = {
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
