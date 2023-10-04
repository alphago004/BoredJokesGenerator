const express = require('express');
const axios = require('axios');
const cors = require('cors');

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // To parse JSON request bodies

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
        console.log("New deployment added")
    }
});

//API to fetch the info of the countrie
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


// API to register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = new User({ username, password });
        await user.save();

        res.status(200).json({ message: 'User registered!' });

    } catch (error) {
        res.status(400).json({message: 'Error registering user.'});
    }
});

// API to login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(400).send('Invalid username or password.');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({message: 'Invalid username or password.'});

        // Ideally, create a session or JWT here
        res.status(200).json({message: 'Logged in successfully!'});
    } catch (error) {
        res.status(400).json({message: 'Error logging in.'});
    }
});



app.listen(3001, () => {
    console.log('Server is up on port 3001');
  });
