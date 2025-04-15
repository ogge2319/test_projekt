import { beforeAll, beforeEach, afterEach, describe, test, expect } from "vitest";

let jwtToken;

beforeAll(async () => {
    const response = await fetch("https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "oscar_dev",
            password: "hemligt123"
        })
    });

    jwtToken = await response.text();
});


describe("GET /movies", () => {
    let createdMovie;

    beforeEach(async () => {
        const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
          },
          body: JSON.stringify({
            title: "Testfilm",
            director: "Testregissör",
            description: "Det här är en testbeskrivning som är tillräckligt lång.",
            productionYear: 2024
          })
        });
      
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`POST misslyckades: ${errorText}`);
        }
      
        createdMovie = await res.json();
      });
      


    afterEach(async () => {
        await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });
    });

    test("GET /movies returnerar en array med minst en film", async () => {
        const response = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    test("GET /movies/{id} returnerar rätt film", async () => {
        const response = await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });
        const data = await response.json()

        expect(response.status).toBe(200);
        expect(data.title).toBe("Testfilm");
    });
});

