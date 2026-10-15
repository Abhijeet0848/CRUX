import React from 'react';
import PropTypes from 'prop-types';
import { Zap, Sparkles } from 'lucide-react';

/**
 * Static Accent Lookup Map
 * Prevents dynamic class purging in Tailwind CSS while providing exact brand tokens.
 */
const ACCENT = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    chip: 'text-indigo-500',
    btnText: 'text-indigo-700',
    btnBorder: 'border-indigo-200',
    btnHover: 'hover:bg-indigo-100',
    focusRing: 'focus-visible:ring-indigo-500',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    chip: 'text-purple-500',
    btnText: 'text-purple-700',
    btnBorder: 'border-purple-200',
    btnHover: 'hover:bg-purple-100',
    focusRing: 'focus-visible:ring-purple-500',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    chip: 'text-blue-500',
    btnText: 'text-blue-700',
    btnBorder: 'border-blue-200',
    btnHover: 'hover:bg-blue-100',
    focusRing: 'focus-visible:ring-blue-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    chip: 'text-emerald-500',
    btnText: 'text-emerald-700',
    btnBorder: 'border-emerald-200',
    btnHover: 'hover:bg-emerald-100',
    focusRing: 'focus-visible:ring-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    chip: 'text-amber-500',
    btnText: 'text-amber-700',
    btnBorder: 'border-amber-200',
    btnHover: 'hover:bg-amber-100',
    focusRing: 'focus-visible:ring-amber-500',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    chip: 'text-rose-500',
    btnText: 'text-rose-700',
    btnBorder: 'border-rose-200',
    btnHover: 'hover:bg-rose-100',
    focusRing: 'focus-visible:ring-rose-500',
  },
};

/**
 * EmptyState
 * Reusable, customizable presentational component for dashboard tab empty states.
 *
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.icon - Lucide hero icon
 * @param {'indigo' | 'purple' | 'blue' | 'emerald' | 'amber' | 'rose'} [props.accent='indigo'] - Accent theme color
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {Array<{ icon: import('lucide-react').LucideIcon, label: string, hint: string }>} [props.preview] - "What you'll get" grid items
 * @param {() => void} [props.onPrimary] - Primary button click handler
 * @param {() => void} [props.onSecondary] - Secondary button click handler
 * @param {Object} [props.primaryAction] - Optional structured action { label, onClick, icon }
 * @param {Object} [props.secondaryAction] - Optional structured action { label, onClick, icon }
 * @param {React.ReactNode} [props.mockVisual] - Optional mock visual preview
 */
export default function EmptyState({
  icon: Icon,
  accent = 'indigo',
  title,
  description,
  preview,
  onPrimary,
  onSecondary,
  primaryAction,
  secondaryAction,
  mockVisual,
}) {
  const styles = ACCENT[accent] || ACCENT.indigo;
  const handlePrimary = onPrimary || primaryAction?.onClick;
  const handleSecondary = onSecondary || secondaryAction?.onClick;
  const PrimaryIcon = primaryAction?.icon || Zap;
  const SecondaryIcon = secondaryAction?.icon || Sparkles;
  const primaryLabel = primaryAction?.label || 'Go to Summarizer';
  const secondaryLabel = secondaryAction?.label || 'Load sample & analyze';

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6">
      <div
        role="status"
        aria-live="polite"
        className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-sm px-10 py-12 text-center"
      >
        {/* Icon Container */}
        {Icon && (
          <div
            className={`w-16 h-16 rounded-2xl ${styles.bg} mx-auto mb-6 flex items-center justify-center`}
          >
            <Icon className={`w-8 h-8 ${styles.text}`} size={32} />
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        {/* Optional Mock Visual */}
        {mockVisual && (
          <div className="w-full flex justify-center mb-6">
            {typeof mockVisual === 'function' ? React.createElement(mockVisual) : mockVisual}
          </div>
        )}

        {/* Preview Grid (3 columns on sm+) */}
        {Array.isArray(preview) && preview.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
            {preview.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  {ItemIcon && (
                    <div className="mb-2">
                      <ItemIcon className={`w-5 h-5 ${styles.chip}`} size={20} />
                    </div>
                  )}
                  <div className="text-sm font-semibold text-slate-800">
                    {item.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-normal">
                    {item.hint}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {handlePrimary && (
            <button
              type="button"
              onClick={handlePrimary}
              aria-label={primaryLabel}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
            >
              <PrimaryIcon className="w-[18px] h-[18px]" size={18} />
              <span>{primaryLabel}</span>
            </button>
          )}

          {handleSecondary && (
            <button
              type="button"
              onClick={handleSecondary}
              aria-label={secondaryLabel}
              className={`text-${accent}-700 ${styles.btnText} ${styles.bg} border ${styles.btnBorder} rounded-xl px-5 py-3 font-medium ${styles.btnHover} transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 ${styles.focusRing} focus:outline-none`}
            >
              <SecondaryIcon className="w-[18px] h-[18px]" size={18} />
              <span>{secondaryLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  accent: PropTypes.oneOf(['indigo', 'purple', 'blue', 'emerald', 'amber', 'rose']),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  preview: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      hint: PropTypes.string.isRequired,
    })
  ),
  onPrimary: PropTypes.func,
  onSecondary: PropTypes.func,
  primaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.elementType,
  }),
  secondaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.elementType,
  }),
  mockVisual: PropTypes.node,
};
