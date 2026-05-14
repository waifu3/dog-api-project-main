(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.DogAppUtils = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const HISTORY_LIMIT = 10;

  function sortObjectByKey(obj, order) {
    const sorted = {};
    const sortedKeys = Object.keys(obj).sort((a, b) =>
      order === "desc" ? b.localeCompare(a) : a.localeCompare(b)
    );

    sortedKeys.forEach((key) => {
      sorted[key] = obj[key];
    });

    return sorted;
  }

  function normalizeStorageArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function toggleFavoriteValue(favorites, breed) {
    return favorites.includes(breed)
      ? favorites.filter((favorite) => favorite !== breed)
      : [...favorites, breed];
  }

  function addHistoryItem(history, item) {
    const nextHistory = [
      item,
      ...history.filter((entry) => entry.imageUrl !== item.imageUrl),
    ];

    return nextHistory.slice(0, HISTORY_LIMIT);
  }

  function matchesBreedFilter(breed, subBreeds, filterValue) {
    const query = filterValue.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      breed.toLowerCase().includes(query) ||
      subBreeds.some((subBreed) => subBreed.toLowerCase().includes(query))
    );
  }

  return {
    HISTORY_LIMIT,
    addHistoryItem,
    matchesBreedFilter,
    normalizeStorageArray,
    sortObjectByKey,
    toggleFavoriteValue,
  };
});
