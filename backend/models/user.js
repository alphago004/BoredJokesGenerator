const mongoose = require('mongoose'); //importing the mongoose library, 
const bcrypt = require('bcrypt');

//Creating a Score Schema to store the highest score
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 4 },
    highestScore: { type: Number, default: 0 }
}, {
    collection: 'user'
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });

  // Helper method for validating user's password
userSchema.methods.checkPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };


//const Score = mongoose.model('Score', ScoreSchema);
const User = mongoose.model('User', userSchema);


module.exports = User;