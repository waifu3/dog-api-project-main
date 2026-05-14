const http = require("http");
const axios = require("axios");
const app = require("./index");

jest.mock("axios");

function request(method, path) {
  const server = app.listen(0);
  const { port } = server.address();

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        method,
        path,
        port,
      },
      (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          server.close();
          const isJson = res.headers["content-type"]?.includes("application/json");

          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: isJson && body ? JSON.parse(body) : body,
          });
        });
      }
    );

    req.on("error", (error) => {
      server.close();
      reject(error);
    });

    req.end();
  });
}

function mockBreeds() {
  axios.get.mockResolvedValueOnce({
    data: {
      message: {
        hound: ["afghan", "basset"],
        labrador: [],
      },
    },
  });
}

describe("Dog API project", () => {
  beforeEach(async () => {
    await request("POST", "/test/clear-cache");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /razas returns totals and sub-breed arrays", async () => {
    mockBreeds();

    const response = await request("GET", "/razas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      totalBreeds: 2,
      totalSubBreeds: 2,
      breeds: {
        hound: ["afghan", "basset"],
        labrador: [],
      },
    });
  });

  test("GET /razas caches the breeds response", async () => {
    mockBreeds();

    await request("GET", "/razas");
    await request("GET", "/razas");

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test("GET /breed/:name redirects to a random image", async () => {
    mockBreeds();
    axios.get.mockResolvedValueOnce({
      data: {
        message: "https://images.dog.ceo/breeds/hound-afghan/example.jpg",
      },
    });

    const response = await request("GET", "/breed/hound");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(
      "https://images.dog.ceo/breeds/hound-afghan/example.jpg"
    );
    expect(axios.get).toHaveBeenLastCalledWith(
      "https://dog.ceo/api/breed/hound/images/random"
    );
  });

  test("GET /random-image returns a random image URL", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        message: "https://images.dog.ceo/breeds/labrador/random.jpg",
      },
    });

    const response = await request("GET", "/random-image");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      imageUrl: "https://images.dog.ceo/breeds/labrador/random.jpg",
    });
    expect(axios.get).toHaveBeenCalledWith(
      "https://dog.ceo/api/breeds/image/random"
    );
  });

  test("GET /breed/:name/:subBreed redirects to a random sub-breed image", async () => {
    mockBreeds();
    axios.get.mockResolvedValueOnce({
      data: {
        message: "https://images.dog.ceo/breeds/hound-afghan/example.jpg",
      },
    });

    const response = await request("GET", "/breed/hound/afghan");

    expect(response.status).toBe(302);
    expect(axios.get).toHaveBeenLastCalledWith(
      "https://dog.ceo/api/breed/hound/afghan/images/random"
    );
  });

  test("GET /breed-image/:name returns a random image URL as JSON", async () => {
    mockBreeds();
    axios.get.mockResolvedValueOnce({
      data: {
        message: "https://images.dog.ceo/breeds/hound/example.jpg",
      },
    });

    const response = await request("GET", "/breed-image/hound");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      imageUrl: "https://images.dog.ceo/breeds/hound/example.jpg",
    });
    expect(axios.get).toHaveBeenLastCalledWith(
      "https://dog.ceo/api/breed/hound/images/random"
    );
  });

  test("GET /breed/:name returns 404 when breed does not exist", async () => {
    mockBreeds();

    const response = await request("GET", "/breed/unknown");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Raza o subraza no encontrada" });
  });
});
