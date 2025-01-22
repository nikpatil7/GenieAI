const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // This will exclude password by default in queries
  },
  customerId: {
    type: String,
    default: ""
  },
  Subscription: {
    type: String,
    default: ""
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

//hash password 
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//match password
userSchema.methods.matchPasswords = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

//SIGN token
userSchema.methods.getSignedToken = function(res) {
  try {
    const accessToken = jwt.sign(
      { id: this._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
    );
    
    const refreshToken = jwt.sign(
      { id: this._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.JWT_REFRESH_EXPIREIN }
    );
    
    res.cookie('refreshToken', refreshToken, {
      maxAge: 86400 * 7000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error('Error generating tokens');
  }
};

// Add index for better query performance
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;