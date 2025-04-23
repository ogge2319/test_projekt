import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MovieList from '../src/components/MovieList';
import { server } from '../mocks/server';

// Starta mock-servern innan testerna körs
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MovieList', () => {
  it('loggar in och hämtar filmer', async () => {
    // Rendera komponenten
    render(<MovieList />);

    // Hitta och klicka på knappen
    const button = screen.getByRole('button', { name: /logga in och hämta filmer/i });
    fireEvent.click(button);

    // Vänta tills filmerna dyker upp i DOM
    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeDefined();
      expect(screen.getByText('Inception')).toBeDefined();
    });
  });
});
