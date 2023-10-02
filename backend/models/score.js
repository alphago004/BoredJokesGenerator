// models/score.js

const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // If you have a User model
  },
  highestScore: {
    type: Number,
    default: 0
  }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
