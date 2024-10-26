const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const client = require('./db.js');
const authRoutes = require('./auth.js');
const cors = require('cors');

const app = express();
const PORT = 14000; // Use fixed port

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:14000', // for local development
  'https://care-1-nyqd.onrender.com' // for production on Render
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Session configuration (no secure cookies, since we are avoiding env vars)
app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({}, client),
    cookie: { secure: false }, // Not using secure cookies
  })
);

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'build')));

// API routes
app.use('/auth', authRoutes);

// React routing (serve index.html for non-API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
