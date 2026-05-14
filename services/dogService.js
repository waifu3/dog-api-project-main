const axios = require("axios");

const DOG_API_BASE_URL = "https://dog.ceo/api";
const BREEDS_CACHE_TTL = 10 * 60 * 1000;

let breedsCache = {
  data: null,
  expiresAt: 0,
};

async function getBreedsData() {
  if (breedsCache.data && breedsCache.expiresAt > Date.now()) {
    return breedsCache.data;
  }

  const response = await axios.get(`${DOG_API_BASE_URL}/breeds/list/all`);
  const breeds = response.data.message;
  const totalBreeds = Object.keys(breeds).length;
  let totalSubBreeds = 0;
  const allBreeds = {};

  Object.keys(breeds).forEach((breed) => {
    allBreeds[breed] = breeds[breed];
    totalSubBreeds += breeds[breed].length;
  });

  breedsCache = {
    data: { totalBreeds, totalSubBreeds, breeds: allBreeds },
    expiresAt: Date.now() + BREEDS_CACHE_TTL,
  };

  return breedsCache.data;
}

function clearBreedsCache() {
  breedsCache = { data: null, expiresAt: 0 };
}

function normalizeBreedName(value) {
  return value.trim().toLowerCase();
}

function buildBreedImagePath(breedName, subBreedName) {
  return subBreedName
    ? `breed/${breedName}/${subBreedName}/images/random`
    : `breed/${breedName}/images/random`;
}

async function validateBreed(breedName, subBreedName) {
  const { breeds } = await getBreedsData();

  if (!breeds[breedName]) {
    return false;
  }

  return !subBreedName || breeds[breedName].includes(subBreedName);
}

async function getBreedImageUrl(breedName, subBreedName = null) {
  const imagePath = buildBreedImagePath(breedName, subBreedName);
  const response = await axios.get(`${DOG_API_BASE_URL}/${imagePath}`);

  return response.data.message;
}

async function getRandomImageUrl() {
  const response = await axios.get(`${DOG_API_BASE_URL}/breeds/image/random`);

  return response.data.message;
}

module.exports = {
  clearBreedsCache,
  getBreedImageUrl,
  getBreedsData,
  getRandomImageUrl,
  normalizeBreedName,
  validateBreed,
};
