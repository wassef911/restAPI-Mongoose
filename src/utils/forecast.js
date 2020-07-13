const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const key = "a72d6ddfb9193c62368a5611b8dc1daf";
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (!body.weather) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `The weather in ${body.name} is ${body.weather[0].description} and the temperature : ${body.main.temp}`
      );
    }
  });
};

module.exports = forecast;
