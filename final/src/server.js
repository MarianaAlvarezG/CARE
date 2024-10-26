const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const client = require('./db.js');
const authRoutes = require('./auth.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
