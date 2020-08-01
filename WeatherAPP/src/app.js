const path = require("path");
const express = require("express");
const hbs = require("hbs");
const port = process.env.PORT || 3083;
const app = express();
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Wassef Ben Ahmed",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Wassef Ben Ahmed",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Wassef Ben Ahmed",
    helpText:
      "This is some helpful text, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.adress) {
    return res.send({ error: "You must provide an adress" });
  }
  geocode(req.query.adress, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error: error,
        adress: req.query.adress,
      });
    }
    forecast(latitude, longitude, (error, forecast) => {
      if (error) {
        return res.send({
          error: error,
          adress: req.query.adress,
        });
      }
      res.send({
        forecast,
        location,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", { error: "sorry, help page isn't found." });
});

app.get("*", (req, res) => {
  res.render("error", { error: "sorry, for the 404 ..." });
});

app.listen(port, () => {
  console.log("server is up on port" + port);
});
