'use strict';
const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
require('dotenv').config();
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log('listening at PORT 5500'));
function Location(city, locationData) {
    this.search_query = city;
    this.formatted_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude = locationData[0].lon;
}

server.get('/location', (request, response) => {
    const locationData = require('./data/geo.json');
    const location = new Location('Lynnwood', locationData);
    response.send(location);

});

function Weather(sum,date) {
    this.forecast = sum;
    this.time = date;
    console.log(this.time);
    Weather.all.push(this);
}
Weather.all = []

server.get('/weather', (request, response) => {
    const weatherData = require('./data/darksky.json');
    weatherData.daily.data.forEach( data => {
        let date = new Date(data.time * 1000).toDateString();
        let sum = data.summary;
       new Weather(sum,date);

    });
    response.send(Weather.all);
});
server.use('*', (request, response) => {
    response.status(404).send('sorry , not found');
});
server.use((error, request, response) => {
    response.status(500).send(error);
});
//////////////////////////////////////////////////////////////////