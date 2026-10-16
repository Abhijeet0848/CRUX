import React from 'react';
import SummaryCard from './SummaryCard';

/**
 * SummaryPanel
 * Direct alias / re-export of SummaryCard to maintain backward compatibility.
 */
export default function SummaryPanel(props) {
  return <SummaryCard {...props} />;
}
