const userModel = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

//JWT token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      username: user.username,
      email: user.email
    }
  });
};

//register
exports.registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check for existing email
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      throw new ErrorResponse('Email is already registered', 400);
    }

    // Check for existing username
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      throw new ErrorResponse('Username is already taken', 400);
    }

    // Create user
    const user = await userModel.create({
      username,
      email,
      password
    });

    return sendToken(user, 201, res);
  } catch (error) {
    return next(error);
  }
};

//login
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Find user and explicitly select password
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Send token
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//logout
exports.logoutController = async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

