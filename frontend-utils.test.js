const {
  HISTORY_LIMIT,
  addHistoryItem,
  matchesBreedFilter,
  sortObjectByKey,
  toggleFavoriteValue,
} = require("./views/app-utils");

describe("frontend utilities", () => {
  test("sortObjectByKey sorts keys ascending and descending", () => {
    const breeds = { labrador: [], akita: [], hound: [] };

    expect(Object.keys(sortObjectByKey(breeds, "asc"))).toEqual([
      "akita",
      "hound",
      "labrador",
    ]);
    expect(Object.keys(sortObjectByKey(breeds, "desc"))).toEqual([
      "labrador",
      "hound",
      "akita",
    ]);
  });

  test("toggleFavoriteValue adds and removes favorites", () => {
    expect(toggleFavoriteValue([], "akita")).toEqual(["akita"]);
    expect(toggleFavoriteValue(["akita", "hound"], "akita")).toEqual(["hound"]);
  });

  test("matchesBreedFilter matches breeds and sub-breeds", () => {
    expect(matchesBreedFilter("hound", ["afghan"], "afg")).toBe(true);
    expect(matchesBreedFilter("labrador", [], "lab")).toBe(true);
    expect(matchesBreedFilter("akita", [], "hound")).toBe(false);
  });

  test("addHistoryItem keeps newest unique items and respects the limit", () => {
    const history = Array.from({ length: HISTORY_LIMIT }, (_, index) => ({
      imageUrl: `image-${index}`,
      label: `image ${index}`,
    }));

    const nextHistory = addHistoryItem(history, {
      imageUrl: "image-new",
      label: "new",
    });

    expect(nextHistory).toHaveLength(HISTORY_LIMIT);
    expect(nextHistory[0].imageUrl).toBe("image-new");

    const deduped = addHistoryItem(nextHistory, {
      imageUrl: "image-3",
      label: "image 3",
    });

    expect(deduped[0].imageUrl).toBe("image-3");
    expect(deduped.filter((item) => item.imageUrl === "image-3")).toHaveLength(1);
  });
});
