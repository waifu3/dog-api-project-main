let breedsInfo = {};
let favorites = loadFavorites();
let imageHistory = loadImageHistory();
let showOnlyFavorites = false;
let currentImageUrl = "";
let currentTheme = loadTheme();

const {
  addHistoryItem,
  matchesBreedFilter,
  sortObjectByKey,
  toggleFavoriteValue,
} = window.DogAppUtils;

const totalInfo = document.getElementById("total-info");
const resultsInfo = document.getElementById("results-info");
const filterInput = document.getElementById("filter-input");
const randomImageBtn = document.getElementById("random-image-btn");
const ascBtn = document.getElementById("asc-btn");
const descBtn = document.getElementById("desc-btn");
const favoritesFilterBtn = document.getElementById("favorites-filter-btn");
const clearFavoritesBtn = document.getElementById("clear-favorites-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const breedsContainer = document.getElementById("breeds-info");
const emptyMessage = document.getElementById("empty-message");
const imagePreview = document.getElementById("image-preview");
const statusMessage = document.getElementById("status-message");
const copyImageBtn = document.getElementById("copy-image-btn");
const downloadImageLink = document.getElementById("download-image-link");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const historyEmptyMessage = document.getElementById("history-empty-message");

function loadFavorites() {
  try {
    return window.DogAppUtils.normalizeStorageArray(
      JSON.parse(localStorage.getItem("dogApiFavorites"))
    );
  } catch (error) {
    return [];
  }
}

function loadImageHistory() {
  try {
    return window.DogAppUtils.normalizeStorageArray(
      JSON.parse(localStorage.getItem("dogApiImageHistory"))
    );
  } catch (error) {
    return [];
  }
}

function loadTheme() {
  return localStorage.getItem("dogApiTheme") || "light";
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
}

function saveFavorites() {
  localStorage.setItem("dogApiFavorites", JSON.stringify(favorites));
}

function saveImageHistory() {
  localStorage.setItem("dogApiImageHistory", JSON.stringify(imageHistory));
}

function saveTheme() {
  localStorage.setItem("dogApiTheme", currentTheme);
}

function isFavorite(breed) {
  return favorites.includes(breed);
}

function updateFavoritesControls() {
  favoritesFilterBtn.textContent = `Favoritos (${favorites.length})`;
  clearFavoritesBtn.disabled = favorites.length === 0;

  if (favorites.length === 0 && showOnlyFavorites) {
    showOnlyFavorites = false;
    favoritesFilterBtn.classList.remove("is-active");
    favoritesFilterBtn.setAttribute("aria-pressed", "false");
  }
}

function toggleFavorite(breed) {
  favorites = toggleFavoriteValue(favorites, breed);

  saveFavorites();
  updateFavoritesControls();
  renderBreedsList(breedsInfo);
  filterBreeds();
}

function applyTheme() {
  document.documentElement.dataset.theme = currentTheme;
  themeToggleBtn.textContent = currentTheme === "dark" ? "Modo claro" : "Modo oscuro";
}

function toggleTheme() {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  saveTheme();
  applyTheme();
}

function clearFavorites() {
  favorites = [];
  saveFavorites();
  updateFavoritesControls();
  renderBreedsList(breedsInfo);
  filterBreeds();
}

function renderBreedsList(breeds) {
  breedsContainer.innerHTML = "";

  Object.entries(breeds).forEach(([breed, subBreeds]) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.breed = breed;
    card.dataset.subBreeds = subBreeds.join(" ");

    const title = document.createElement("a");
    title.href = `/breed/${breed}`;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = breed;

    const favoriteButton = document.createElement("button");
    favoriteButton.className = isFavorite(breed)
      ? "favorite-btn is-active"
      : "favorite-btn";
    favoriteButton.type = "button";
    favoriteButton.textContent = isFavorite(breed) ? "Favorita" : "Guardar";
    favoriteButton.setAttribute("aria-pressed", String(isFavorite(breed)));
    favoriteButton.setAttribute(
      "aria-label",
      isFavorite(breed)
        ? `Quitar ${breed} de favoritos`
        : `Agregar ${breed} a favoritos`
    );
    favoriteButton.addEventListener("click", () => toggleFavorite(breed));

    const subBreedText = document.createElement("p");
    subBreedText.textContent = subBreeds.length ? "Subrazas:" : "Sin subrazas registradas";

    const viewButton = document.createElement("button");
    viewButton.className = "btn btn-secondary";
    viewButton.type = "button";
    viewButton.textContent = "Ver imagen";
    viewButton.addEventListener("click", () => loadBreedImage(breed));

    card.append(title, favoriteButton, subBreedText);

    if (subBreeds.length) {
      const subBreedList = document.createElement("div");
      subBreedList.className = "sub-breeds";

      subBreeds.forEach((subBreed) => {
        const subBreedButton = document.createElement("button");
        subBreedButton.className = "sub-breed";
        subBreedButton.type = "button";
        subBreedButton.textContent = subBreed;
        subBreedButton.addEventListener("click", () => loadBreedImage(breed, subBreed));
        subBreedList.appendChild(subBreedButton);
      });

      card.appendChild(subBreedList);
    }

    card.appendChild(viewButton);
    breedsContainer.appendChild(card);
  });
}

function filterBreeds() {
  const filterValue = filterInput.value.trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll(".card").forEach((card) => {
    const breedName = card.dataset.breed;
    const subBreedNames = card.dataset.subBreeds
      ? card.dataset.subBreeds.split(" ")
      : [];
    const matchesSearch = matchesBreedFilter(breedName, subBreedNames, filterValue);
    const matchesFavorites = !showOnlyFavorites || isFavorite(card.dataset.breed);
    const isVisible = matchesSearch && matchesFavorites;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  resultsInfo.textContent = `Mostrando ${visibleCount} de ${Object.keys(breedsInfo).length} razas`;
  emptyMessage.hidden = visibleCount > 0;
}

function setCurrentImage(imageUrl, label) {
  currentImageUrl = imageUrl;
  imagePreview.onload = () => {
    setStatus(`Imagen cargada: ${label}`);
    addImageToHistory(imageUrl, label);
  };
  imagePreview.onerror = () => setStatus("No se pudo cargar la imagen.", true);
  imagePreview.src = imageUrl;
  imagePreview.alt = `Imagen de ${label}`;
  imagePreview.hidden = false;
  copyImageBtn.disabled = false;
  downloadImageLink.href = imageUrl;
  downloadImageLink.classList.remove("is-disabled");
  downloadImageLink.setAttribute("aria-disabled", "false");
}

function addImageToHistory(imageUrl, label) {
  imageHistory = addHistoryItem(imageHistory, {
    imageUrl,
    label,
    viewedAt: new Date().toISOString(),
  });
  saveImageHistory();
  renderImageHistory();
}

function renderImageHistory() {
  historyList.innerHTML = "";

  imageHistory.forEach((item) => {
    const button = document.createElement("button");
    button.className = "history-item";
    button.type = "button";
    button.setAttribute("aria-label", `Ver imagen de ${item.label}`);
    button.addEventListener("click", () => setCurrentImage(item.imageUrl, item.label));

    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = `Imagen de ${item.label}`;

    const label = document.createElement("span");
    label.textContent = item.label;

    button.append(image, label);
    historyList.appendChild(button);
  });

  clearHistoryBtn.disabled = imageHistory.length === 0;
  historyEmptyMessage.hidden = imageHistory.length > 0;
}

function clearImageHistory() {
  imageHistory = [];
  saveImageHistory();
  renderImageHistory();
}

async function copyCurrentImageUrl() {
  if (!currentImageUrl) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentImageUrl);
    setStatus("Enlace copiado al portapapeles");
  } catch (error) {
    setStatus("No se pudo copiar el enlace.", true);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function loadBreedImage(breed, subBreed = null) {
  const displayName = subBreed ? `${breed} ${subBreed}` : breed;
  const dataPath = subBreed
    ? `/breed-image/${breed}/${subBreed}`
    : `/breed-image/${breed}`;

  try {
    setStatus(`Buscando imagen de ${displayName}...`);
    const data = await fetchJson(dataPath);
    setCurrentImage(data.imageUrl, displayName);
  } catch (error) {
    setStatus("No se pudo cargar la imagen de la raza.", true);
  }
}

async function loadRandomImage() {
  try {
    setStatus("Buscando imagen aleatoria...");
    const data = await fetchJson("/random-image");

    setCurrentImage(data.imageUrl, "imagen aleatoria");
  } catch (error) {
    setStatus("No se pudo cargar la imagen aleatoria.", true);
  }
}

async function loadBreeds() {
  try {
    setStatus("Cargando razas...");
    const data = await fetchJson("/razas");

    breedsInfo = data.breeds;
    totalInfo.textContent = `Total de razas: ${data.totalBreeds}, Total de subrazas: ${data.totalSubBreeds}`;
    renderBreedsList(breedsInfo);
    filterBreeds();
    setStatus("Razas cargadas");
  } catch (error) {
    setStatus("No se pudieron cargar las razas.", true);
  }
}

filterInput.addEventListener("input", filterBreeds);
randomImageBtn.addEventListener("click", loadRandomImage);
clearFavoritesBtn.addEventListener("click", clearFavorites);
themeToggleBtn.addEventListener("click", toggleTheme);
copyImageBtn.addEventListener("click", copyCurrentImageUrl);
clearHistoryBtn.addEventListener("click", clearImageHistory);
favoritesFilterBtn.addEventListener("click", () => {
  showOnlyFavorites = !showOnlyFavorites;
  favoritesFilterBtn.classList.toggle("is-active", showOnlyFavorites);
  favoritesFilterBtn.setAttribute("aria-pressed", String(showOnlyFavorites));
  filterBreeds();
});
ascBtn.addEventListener("click", () => {
  renderBreedsList(sortObjectByKey(breedsInfo, "asc"));
  filterBreeds();
});

descBtn.addEventListener("click", () => {
  renderBreedsList(sortObjectByKey(breedsInfo, "desc"));
  filterBreeds();
});

applyTheme();
updateFavoritesControls();
renderImageHistory();
loadBreeds();
