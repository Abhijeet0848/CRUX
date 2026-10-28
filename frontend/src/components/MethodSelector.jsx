import React from 'react';
import PropTypes from 'prop-types';

/**
 * Summarization Methods
 * Clean, text-only options with zero icon clutter.
 */
const METHODS = [
  { id: 'frequency', label: 'Word Frequency' },
  { id: 'tfidf', label: 'TF-IDF' },
  { id: 'hybrid', label: 'Hybrid' },
];

/**
 * MethodSelector Component
 * Compact text-only segmented control
 */
export default function MethodSelector({ method, setMethod }) {
  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-2.5 min-w-0 w-full">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Summarization Method
      </label>

      {/* Text-Only Segmented Control Container */}
      <div
        role="radiogroup"
        aria-label="Summarization Method"
        className="flex items-center p-1 bg-gray-200/70 rounded-lg w-full"
      >
        {METHODS.map((item) => {
          const isSelected = method === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setMethod(item.id)}
              className={`flex-1 flex items-center justify-center py-1.5 px-3 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? 'bg-white text-indigo-600 shadow-xs border border-gray-200/60 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

MethodSelector.propTypes = {
  method: PropTypes.string.isRequired,
  setMethod: PropTypes.func.isRequired,
};
