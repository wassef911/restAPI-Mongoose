const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();

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
    name: "Wassef Ben Ahmed ",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Wassef Ben Ahmed ",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Wassef Ben Ahmed ",
    helpText: "This is some helpful text.",
  });
});

app.get("/weather", (req, res) => {
  res.send({
    forecast: "It is snowing",
    location: "Philadelphia",
  });
});

app.get("/help/**", (req, res) => {
  res.render("error", { error: "sorry, help page isn't found." });
});
app.get("*", (req, res) => {
  res.render("error", { error: "sorry, for the 404 ..." });
});

app.listen(3000, () => {
  console.log("server is up on port 3000.");
});
