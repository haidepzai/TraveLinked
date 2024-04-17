const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API;
const url = 'http://api.openweathermap.org/data/2.5/weather';

const getWeatherByLocation = (req, res) => {
   axios
      .get(`${url}?q=${req.query.city}&appid=${API_KEY}&units=metric`)
      .then((response) => {
         switch (response.data.cod) {
            case 200:
               res.status(200).send(response.data);
               break;
            case 401:
               res.status(401).send(response.message);
               break;
            case 404:
               res.status(404).send(response.message);
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

const getWeatherByCoordinates = (req, res) => {
   axios
      .get(`${url}?lat=${req.query.lat}&lon=${req.query.lon}&appid=${API_KEY}&units=metric`)
      .then((response) => {
         switch (response.data.cod) {
            case 200:
               res.status(200).send(response.data);
               break;
            case 401:
               res.status(401).send(response.message);
               break;
            case 404:
               res.status(404).send(response.message);
               break;
            default:
               res.status(500).send({ errorMessage: 'There was an error!' });
               break;
         }
      })
      .catch(function (error) {
         res.status(500).send({ errorMessage: 'There was an error!' });
      });
};

module.exports = {
   getWeatherByLocation,
   getWeatherByCoordinates,
};
