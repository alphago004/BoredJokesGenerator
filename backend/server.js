const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS for all routes

app.get('/bored', async (req, res) => {
    try {
        const response = await axios.get('https://www.boredapi.com/api/activity/');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching activity." });
    }
});

app.get('/joke', async (req, res) => {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
        const jokeData = response.data;

        // Extract the category and the joke content
        const jokeInfo = {
            category: jokeData.category,
            setup: jokeData.setup,
            delivery: jokeData.delivery
        };
        
        res.json(jokeInfo);
        
    } catch (error) {
        res.status(500).json({ error: "Hold on!! Take a breath!" });
    }
});


app.get('/country', async (req, res) => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;

        // Extract required details for the first 10 countries
        const firstTenCountriesInfo = countries.slice(0, 10).map(country => {
            return {
                name: country.name.common,
                capital: country.capital ? country.capital[0] : 'N/A', // Some countries might not have a capital
                language: Object.values(country.languages)[0],  // Extracting the first language, as countries can have multiple languages
                flag: country.flags.svg 
            };
        });

        res.json(firstTenCountriesInfo);
        
    } catch (error) {
        res.status(500).json({ error: "Hold on!! Take a breath!" });
    }
});


app.listen(3001, '0.0.0.0', () => {
    console.log('Server is up on port 3001');
  });
