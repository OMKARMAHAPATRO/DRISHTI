const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db/connect');
const User = require('./db/models/User');
const { getUserStats } = require('./db/aggregations/userStats');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route to get user stats
app.get('/api/user-stats', async (req, res) => {
  try {
    const stats = await getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Test route to run aggregation
app.get('/test-aggregation', async (req, res) => {
  try {
    const stats = await getUserStats();
    console.log('User Stats:', stats);
    res.json({ message: 'Aggregation executed', stats });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Aggregation failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Signup route to add user data to MongoDB
app.post('/api/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login request received:', { email });

  if (!email || !password) {
    console.log('Login failed: Missing email or password');
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    };
    const token = jwt.sign(payload, 'hackathon_secret_key_2024', { expiresIn: '1h' });

    console.log('Login successful, token generated');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});
