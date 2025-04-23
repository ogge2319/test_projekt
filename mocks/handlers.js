import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', async ({ request }) => {
    const { username, password } = await request.json();
    if (username === 'hodman2' && password === 'nyttlösen123') {
      return new HttpResponse('mocked-jwt-token', { status: 200 });
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }),

  http.get('https://tokenservice-jwt-2025.fly.dev/movies', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer mocked-jwt-token') {
      return HttpResponse.json([
        { id: 1, title: 'The Matrix' },
        { id: 2, title: 'Inception' },
      ]);
    }
    return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
  }),
];
