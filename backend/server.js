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
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching joke." });
    }
});

app.listen(3001, () => {
    console.log('Server is up on port 3001');
});
