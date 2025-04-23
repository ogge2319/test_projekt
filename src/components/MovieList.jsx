import { useState } from 'react';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleLoginAndFetch = async () => {
    try {
      setError(''); // nollställ felmeddelanden

      // 1. Hämta JWT-token
      const tokenRes = await fetch('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'hodman2',
          password: 'nyttlösen123',
        }),
      });

      if (!tokenRes.ok) {
        throw new Error(`Inloggning misslyckades: ${tokenRes.status}`);
      }

      const jwt = await tokenRes.text();
      setToken(jwt);

      // 2. Hämta filmer med token
      const movieRes = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!movieRes.ok) {
        throw new Error(`Filmhämtning misslyckades: ${movieRes.status}`);
      }

      const data = await movieRes.json();
      console.log('Filmer:', data);
      setMovies(data);
    } catch (err) {
      console.error('Fel vid inloggning eller hämtning:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>MovieList-komponent</h2>
      <button onClick={handleLoginAndFetch}>Logga in och hämta filmer</button>

      {error && <p style={{ color: 'red' }}>Fel: {error}</p>}

      {movies.length > 0 ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      ) : (
         <p>Inga filmer hittades.</p>
      )}
    </div>
  );
}
