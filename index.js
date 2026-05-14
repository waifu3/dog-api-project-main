const express = require("express");
const helmet = require("helmet");
const path = require("path");
const dogRoutes = require("./routes/dogRoutes");

const app = express();
const port = process.env.PORT || 30013;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://images.dog.ceo"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
  })
);

app.use(express.static(path.join(__dirname, "views")));
app.use(dogRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

module.exports = app;
