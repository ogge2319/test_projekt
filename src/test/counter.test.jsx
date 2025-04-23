import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../components/Counter';

describe('Counter', () => {
  it('visar 0 från början', () => {
    render(<Counter />);
    expect(screen.getByText(/0 gånger/i)).toBeInTheDocument();
  });

  it('ökar värdet med 1 efter klick', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /öka/i });
    fireEvent.click(button);
    expect(screen.getByText(/1 gånger/i)).toBeInTheDocument();
  });
});
