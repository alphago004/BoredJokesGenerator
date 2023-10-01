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

        // Get a random country for the question
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const correctOption = randomCountry.capital ? randomCountry.capital[0] : 'N/A';
        
        // Get 3 random countries for the wrong options (ensure they're not the same as the chosen country)
        let wrongOptions = [];
        while (wrongOptions.length < 3) {
            const wrongCountry = countries[Math.floor(Math.random() * countries.length)];
            if (wrongCountry.name.common !== randomCountry.name.common && wrongOptions.indexOf(wrongCountry.capital[0]) === -1) {
                wrongOptions.push(wrongCountry.capital[0] || 'N/A');
            }
        }

        const countryInfo = {
            name: randomCountry.name.common,
            capital: correctOption,
            flag: randomCountry.flags.svg,
            options: [correctOption, ...wrongOptions].sort(() => Math.random() - 0.5) // Shuffle the options
        };

        res.json(countryInfo);
        
    } catch (error) {
        res.status(500).json({ error: "Error fetching country info." });
    }
});



app.listen(3001, '0.0.0.0', () => {
    console.log('Server is up on port 3001');
  });
