const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { register } = require("module");

//* Generate JWT Token
const generateToken = ( userId ) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//! @desc - Register new user
//! @route - POST /api/auth/register
//! @access - Public
const registerUser = async ( req, res ) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

    //* Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //* User role is admin if adminInviteToken is provided, otherwise user
    let role = "user";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    //* Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //* Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    //* Return user data with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    }); 
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//! @desc - Login user
//! @route - POST /api/auth/login
//! @access - Public
const loginUser = async ( req, res ) => {
  try {
    const { email, password } = req.body;

    //* Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //* Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //* Return user data with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//! @desc - Get user profile
//! @route - GET /api/auth/profile
//! @access - Private (JWT)
const getUserProfile = async (req, res) => {
  try {
    //* Check if user exists
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //* Return user data
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//! @desc - Update user profile
//! @route - PUT /api/auth/profile
//! @access - Private (JWT)
const updateUserProfile = async ( req, res ) => {
  try {
    //* Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //* Check if email is already in use by another user
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    //* If password is provided, hash it and update the user
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    //* Return user data with JWT token
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };