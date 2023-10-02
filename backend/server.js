const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());  // Enable CORS for all routes

/* Database Work Block*/
//connecion to the database (MongoDB) using mongoose (It is is Object Data Modelng, ODM)
const mongoose = require('mongoose');

//Database Schemas
const User = require('./models/user');  // Import the User model
const Score = require('./models/score'); // Import the Score model


mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
//console.log("MongoDB Connection String:", process.env.MONGO_CONNECTION_STRING);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // For parsing JSON in request body


/** All required APIS */

// Endpoint to update a new Highest Score
app.post('/score/:userId', async (req, res) => {
    try {
      const newScore = req.body.score;
      
      let userScore = await Score.findOne({ userId: req.params.userId });
      if (!userScore) {
        userScore = new Score({ userId: req.params.userId, highestScore: newScore });
      } else if (newScore > userScore.highestScore) {
        userScore.highestScore = newScore;
      }
      
      await userScore.save();
      res.json({ highestScore: userScore.highestScore });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });



//Endpoint to retrieve the highest score
app.get('/score/:userId', async (req, res) => {
    try {
      const score = await Score.findOne({ userId: req.params.userId });
      if (score) {
        res.json(score.highestScore);
      } else {
        res.status(404).send('Score not found');
      }
    } catch (error) {
      res.status(500).send('Server error');
    }
  });


// Endpoint to Register a new User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ error: 'Username already exists.' });
      }
  
      user = new User({ username, password });
      await user.save();
      res.json({ message: 'User registered successfully!' });
  
    } catch (error) {
      res.status(500).json({ error: 'Error registering user.' });
    }
  });

  // Endpoint to Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password.' });
      }
  
      const isMatch = await user.checkPassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password.' });
      }
  
      // NOTE: In a real-world scenario, we also send a JWT or similar auth token here
      res.json({ message: 'User logged in successfully!', userId: user._id });
  
    } catch (error) {
      res.status(500).json({ error: 'Error logging in.' });
    }
  });

// Endpoint to Check if a username exists
app.get('/check-username/:username', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        return res.json({ exists: true });
      }
      res.json({ exists: false });
    } catch (error) {
      res.status(500).json({ error: 'Error checking username.' });
    }
  });


/**  unused Jokes APIs */

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

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
 }));


app.listen(3001, () => {
    console.log('Server is up on port 3001');
  });
