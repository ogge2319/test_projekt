import { useState } from 'react';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState('');

  const handleLoginAndFetch = async () => {
    try {
      // 1. Hämta JWT-token
      const tokenRes = await fetch('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'hodman2',
          password: 'nyttlösen123',
        }),
      });

      const jwt = await tokenRes.text();
      setToken(jwt);

      // 2. Hämta filmer med token
      const movieRes = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const data = await movieRes.json();
      setMovies(data);
    } catch (err) {
      console.error('Fel vid inloggning eller hämtning:', err);
    }
  };

  return (
    <div>
      <button onClick={handleLoginAndFetch}>Logga in och hämta filmer</button>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
