import React from 'react';
import PropTypes from 'prop-types';
import InputCard from './InputCard';
import SummaryCard from './SummaryCard';

/**
 * MainLayout
 *
 * Core layout container for the Summarizer Studio:
 * Breakpoint strategy:
 * - Mobile (< 640px): flex flex-col gap-4 p-3 pb-24 w-full min-w-0
 *   Reserves bottom clearance (pb-24) so content is never covered by the fixed bottom navigation bar.
 * - Tablet (640px - 1023px): flex flex-col gap-4 sm:p-4 sm:pb-8 w-full min-w-0
 *   Smooth natural page scroll without bottom nav obstruction.
 * - Desktop (>= 1024px): lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6 lg:pb-0 lg:min-h-0 lg:overflow-hidden
 *   Maintains strict two-column viewport-locked experience without window-level scrollbars.
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
  onLoadSample,
}) {
  return (
    <div
      className="w-full max-w-full min-w-0 flex flex-col gap-4 p-3 pb-24 sm:p-4 sm:pb-8 lg:grid lg:grid-cols-2 lg:gap-6 lg:p-6 lg:pb-0 lg:min-h-0 lg:overflow-hidden lg:flex-1 items-stretch"
    >
      {/* Left Column: Input Card & Controls */}
      <div className="w-full min-w-0 lg:h-full lg:min-h-0 lg:overflow-hidden">
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
          onLoadSample={onLoadSample}
        />
      </div>

      {/* Right Column: Summary Card */}
      <div className="w-full min-w-0 lg:h-full lg:min-h-0 lg:overflow-hidden">
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
  onLoadSample: PropTypes.func,
};
