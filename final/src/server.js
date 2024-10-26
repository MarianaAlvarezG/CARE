const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const client = require('./db.js');
const authRoutes = require('./auth.js');
const app = express();
const PORT = 14000;
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: 'https://care-1-nyqd.onrender.com/', 
  credentials: true, 
}));

app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({}, client),
    cookie: { secure: false },
  })
);


app.use(express.static(path.join(__dirname, 'build')));

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
