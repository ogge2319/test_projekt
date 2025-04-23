import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Skapar och exporterar mock-servern med alla handlers
export const server = setupServer(...handlers);
