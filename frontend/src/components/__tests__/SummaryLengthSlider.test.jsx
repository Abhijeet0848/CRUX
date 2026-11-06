/**
 * Summary Length Slider Component Tests
 * =====================================
 * Framework: Jest + React Testing Library (@testing-library/react)
 *
 * Test Coverage:
 * 1. Default Max Test: 50 sentences -> max attribute is 20
 * 2. Dynamic Max Test: 4 sentences -> max attribute is 4, not 20
 * 3. Label Update Test: Displays "20 sentences" when max is 20, and "4 sentences" when max is 4
 * 4. Slider Interaction: Dragging slider to max value updates displayed value to "20 sentences"
 */

import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputCard from '../InputCard';

// 50-sentence document generator
const FIFTY_SENTENCES = Array.from(
  { length: 50 },
  (_, i) => `Sentence number ${i + 1} provides key context for document summarization.`
).join(' ');

// 4-sentence document
const FOUR_SENTENCES = (
  'Artificial intelligence enables automated text processing. ' +
  'Extractive summarization preserves original phrasing without hallucinating facts. ' +
  'Salient sentences are ranked and restored in chronological order. ' +
  'Users can inspect word frequencies and multi-feature scores.'
);

/**
 * Stateful wrapper component to test real-world user interactions and slider bindings.
 */
function TestSliderHarness({ initialText = '', initialNumSentences = 3 }) {
  const [text, setText] = useState(initialText);
  const [numSentences, setNumSentences] = useState(initialNumSentences);
  const [method, setMethod] = useState('frequency');
  const [frequencyWeight, setFrequencyWeight] = useState(50);

  return (
    <InputCard
      text={text}
      setText={setText}
      method={method}
      setMethod={setMethod}
      numSentences={numSentences}
      setNumSentences={setNumSentences}
      frequencyWeight={frequencyWeight}
      setFrequencyWeight={setFrequencyWeight}
      onSummarize={jest.fn()}
      loading={false}
      error={null}
      onClear={jest.fn()}
    />
  );
}

describe('Summary Length Slider Component', () => {
  test('1. Default Max Test: max attribute is capped at 20 when text has 50 sentences', () => {
    render(<TestSliderHarness initialText={FIFTY_SENTENCES} initialNumSentences={3} />);

    // Query slider input by accessible role and label
    const slider = screen.getByRole('slider', { name: /summary length in sentences/i });
    expect(slider).toBeInTheDocument();

    // Assert that the slider's max attribute is 20 (not 50)
    expect(slider).toHaveAttribute('max', '20');
    expect(slider).toHaveAttribute('min', '1');
  });

  test('2. Dynamic Max Test: max attribute dynamically drops to 4 for a 4-sentence text', () => {
    render(<TestSliderHarness initialText={FOUR_SENTENCES} initialNumSentences={3} />);

    const slider = screen.getByRole('slider', { name: /summary length in sentences/i });
    expect(slider).toBeInTheDocument();

    // Assert that max attribute is dynamically bounded to 4, not 20
    expect(slider).toHaveAttribute('max', '4');
  });

  test('3. Label Update Test: right-side label displays "20 sentences" when max is 20, and "4 sentences" when max is 4', () => {
    // 3a. When max is 20 (50 sentences text)
    const { rerender } = render(<TestSliderHarness initialText={FIFTY_SENTENCES} initialNumSentences={3} />);
    
    // Right label should display "20 sentences"
    expect(screen.getByText('20 sentences')).toBeInTheDocument();
    expect(screen.getByText('1 sentence')).toBeInTheDocument();

    // 3b. When max is 4 (4 sentences text)
    rerender(<TestSliderHarness initialText={FOUR_SENTENCES} initialNumSentences={3} />);
    
    // Right label should update dynamically to "4 sentences"
    expect(screen.getByText('4 sentences')).toBeInTheDocument();
    expect(screen.queryByText('20 sentences')).not.toBeInTheDocument();
  });

  test('4. Slider Interaction: dragging slider to max value updates displayed value to "20 sentences"', () => {
    render(<TestSliderHarness initialText={FIFTY_SENTENCES} initialNumSentences={3} />);

    const slider = screen.getByRole('slider', { name: /summary length in sentences/i });
    expect(slider).toHaveValue('3');

    // Simulate user sliding thumb to maximum boundary value (20)
    fireEvent.change(slider, { target: { value: '20' } });

    // Assert slider value is now 20
    expect(slider).toHaveValue('20');

    // Assert the header badge displays "20 sentences"
    const headerDisplay = screen.getAllByText(/20 sentences/i);
    expect(headerDisplay.length).toBeGreaterThanOrEqual(1);

    // Assert the dynamic middle label reflects 100% (~100%)
    expect(screen.getByText(/20 \(~100%\)/i)).toBeInTheDocument();
  });
});

