const express = require("express");
const dogService = require("../services/dogService");

const router = express.Router();

router.get("/razas", async (req, res) => {
  try {
    const breedsData = await dogService.getBreedsData();

    res.json(breedsData);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las razas de perros" });
  }
});

router.get("/random-image", async (req, res) => {
  try {
    const imageUrl = await dogService.getRandomImageUrl();

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la imagen aleatoria" });
  }
});

router.get("/breed/:name/:subBreed?", async (req, res) => {
  try {
    const breedName = dogService.normalizeBreedName(req.params.name);
    const subBreedName = req.params.subBreed
      ? dogService.normalizeBreedName(req.params.subBreed)
      : null;

    const exists = await dogService.validateBreed(breedName, subBreedName);

    if (!exists) {
      return res.status(404).json({ error: "Raza o subraza no encontrada" });
    }

    const imageUrl = await dogService.getBreedImageUrl(breedName, subBreedName);

    return res.redirect(imageUrl);
  } catch (error) {
    console.error("Error al obtener la imagen de la raza:", error);
    return res.status(500).json({ error: "Error al obtener la imagen de la raza" });
  }
});

router.get("/breed-image/:name/:subBreed?", async (req, res) => {
  try {
    const breedName = dogService.normalizeBreedName(req.params.name);
    const subBreedName = req.params.subBreed
      ? dogService.normalizeBreedName(req.params.subBreed)
      : null;

    const exists = await dogService.validateBreed(breedName, subBreedName);

    if (!exists) {
      return res.status(404).json({ error: "Raza o subraza no encontrada" });
    }

    const imageUrl = await dogService.getBreedImageUrl(breedName, subBreedName);

    return res.json({ imageUrl });
  } catch (error) {
    console.error("Error al obtener la imagen de la raza:", error);
    return res.status(500).json({ error: "Error al obtener la imagen de la raza" });
  }
});

if (process.env.NODE_ENV === "test") {
  router.post("/test/clear-cache", (req, res) => {
    dogService.clearBreedsCache();
    res.status(204).end();
  });
}

module.exports = router;
