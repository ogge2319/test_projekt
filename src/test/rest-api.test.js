import { describe, it, beforeAll, beforeEach, afterEach, expect } from 'vitest'

let jwtToken


beforeAll(async () => {
  const response = await fetch('https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'hodman2',
      password: 'nyttlösen123',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Inloggning misslyckades: ${response.status} - ${errorText}`)
  }

  jwtToken = await response.text()
})
// skickar en post request för att sedan delete
describe('POST + DELETE /movies', () => {
  it('ska skapa och radera en film', async () => {
    const postResponse = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        "title": "The Matrix second movie ",
        "director": "hello Wachowski",
        "description": "En sci-fi-klassiker som är mycket bättre än den första ",
        "productionYear": 1999,
      }),
    })

    if (!postResponse.ok) {
      const errorText = await postResponse.text()
      throw new Error(`POST misslyckades: ${postResponse.status} - ${errorText}`)
    }

    expect(postResponse.status).toBe(201)
    const createdMovie = await postResponse.json()

    const deleteResponse = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    expect(deleteResponse.status).toBe(204)
  })
})

// skapar film för att sedan hämta.
describe('GET /movies', () => {
  let createdMovie

  beforeEach(async () => {
    const response = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        "title": "The Matrix second movie ",
        "director": "hello Wachowski",
        "description": "En sci-fi-klassiker som är mycket bättre än den första ",
        "productionYear": 1999,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`POST i beforeEach misslyckades: ${response.status} - ${errorText}`)
    }

    createdMovie = await response.json()
  })

  afterEach(async () => {
    const res = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (!res.ok) {
      const err = await res.text()
      console.warn(`Delete i afterEach misslyckades: ${res.status} - ${err}`)
    }
  })

  it('ska returnera en lista med minst en film', async () => {
    const res = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = await res.json()

    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('ska hämta rätt film med ID', async () => {
    const res = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`GET /movies/id misslyckades: ${res.status} - ${errorText}`)
    }

    const movie = await res.json()

    expect(res.status).toBe(200)
    expect(movie.title).toBe("The Matrix second movie ")
  })
})

// skapar en film för att sedan att testa delete. 
describe('DELETE /movies', () => {
  let createdMovie

  beforeEach(async () => {
    const response = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        "title": "The Matrix second movie ",
        "director": "hello Wachowski",
        "description": "En sci-fi-klassiker som är mycket bättre än den första ",
        "productionYear": 1999,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`POST i DELETE-test misslyckades: ${response.status} - ${errorText}`)
    }

    createdMovie = await response.json()
  })

  it('ska radera filmen och ge status 204', async () => {
    const deleteResponse = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    // felhantering för att se vad som blev fel
    if (!deleteResponse.ok) {
      const err = await deleteResponse.text()
      throw new Error(`DELETE-testet misslyckades: ${deleteResponse.status} - ${err}`)
    }

    expect(deleteResponse.status).toBe(204)
  })
})
describe('PUT + GET /movies', () => {
    let createdMovie;
  // beforeEach (requesten körs först)
    beforeEach(async () => {
      const response = await fetch('https://tokenservice-jwt-2025.fly.dev/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title: 'The Matrix second movie',
          director: 'hello Wachowski',
          description: 'En sci-fi-klassiker som är mycket bättre än den första ',
          productionYear: 1999,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`POST i PUT-testet misslyckades: ${response.status} - ${errorText}`);
      }9
  
      createdMovie = await response.json();
    });
  // raderar created movie
    afterEach(async () => {
      const res = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`DELETE i afterEach misslyckades: ${res.status} - ${errorText}`);
      }
    });
  
    it('ska uppdatera filmen med PUT och läsa den med GET', async () => {
      // uppdaterar film
      const putResponse = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title: 'The Matrix threequel movie',
          director: 'hello Wachowski',
          description: 'En sci-fi-klassiker som är mycket bättre än den första ',
          productionYear: 1999,
        }),
      });
  
      expect(putResponse.status).toBe(200);
  
      // hämtar den uppdaterade filem
      const getResponse = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        throw new Error(`GET efter PUT misslyckades: ${getResponse.status} - ${errorText}`);
      }
  
      const updatedMovie = await getResponse.json();
  
      expect(updatedMovie.title).toBe('The Matrix threequel movie');
    });
  });
  