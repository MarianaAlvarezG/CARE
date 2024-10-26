const express = require('express');
const bcrypt = require('bcryptjs');
const client = require('./db.js');
const router = express.Router();
const path = require('path');
const multer = require('multer');



//FUNCTIONS---------------------------------------

const validatePassword = password => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

function isAuthenticated(req, res, next) {
  console.log('Checking authentication:', req.session.user); 
  if (req.session.user) {
    return next(); 
  } else {
    console.log('User not authenticated, redirecting to login');
    return res.status(401).json({ error: 'User not authenticated' }); 
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'views', 'uploads'); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });



//POST REQUESTS------------------------

router.post('/account', async (req, res) => {
  
  const { userType } = req.body;
  console.log('Selected user type: %s', userType);
  console.log('Session stored:', req.session.user);
 
  
  req.session.user = { account_type: userType };

  try {
    await req.session.save(); 

    const query = 'SELECT * FROM users WHERE account_type = ?';
    const [results] = await client.query(query, [userType]); 

    console.log('Query results:', results);

    if (results.length === 0) {
      return res.status(400).json({ error: 'Selected user type not found' });
    }

   
    
    return res.json({ success: true });
  } catch (err) {
    console.error('Error in /account route:', err);
    return res.status(500).json({ error: 'Error processing request' });
  }
});


router.post('/register', upload.single('idfile'), async (req, res) => {
  const { fullname, idnumber, email, password, phone } = req.body;
  
  const idfile = req.file ? req.file.path : null; 
  const regaccount = 'user';
 console.log('Uploaded file:', req.file); 

  if (!fullname || !idnumber || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const [first_name, last_name] = fullname.split(' ');

  try {
      const [userExists] = await client.query('SELECT * FROM users WHERE email = ?', [email]);
      if (userExists.length > 0) {
          return res.status(400).json({ error: 'User already exists' });
      }

      if (!validatePassword(password)) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.' });
      }

      const hash = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO users (first_name, last_name, student_id, email, password, phone, account_type, idfile) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      
      await client.query(insertQuery, [first_name, last_name, idnumber, email, hash, phone, regaccount, idfile]);

      
      req.session.user = { first_name, email, account_type: regaccount };
      
     
     return res.status(200).json({ success: true, account_type: regaccount });

  } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Error during registration', details: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  try {
      const [results] = await client.query(query, [email]);
      if (results.length === 0) {
          return res.status(400).json({ error: 'User not found' });
      }

      const user = results[0];
      console.log('User retrieved from database:', user);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid password' });
      }

      const selectedAccountType = req.session.user.account_type;
      if (user.account_type !== selectedAccountType) {
          return res.status(403).json({ error: 'Account type mismatch' }); 
      }

      req.session.user = { first_name: user.first_name, email: user.email, account_type: selectedAccountType };
      console.log('Session stored:', req.session.user);

      return res.status(200).json({ success: true, account_type: selectedAccountType });
  } catch (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ error: 'Internal server error' }); 
  }
});


router.post('/dashboard/user', isAuthenticated, (req, res) => {
  
  return res.status(200).json({ success: true });
});

router.post('/dashboard/admin', isAuthenticated, (req, res) => {
 
  return res.status(200).json({ success: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    console.log('Logout successful, redirecting to homepage.');
    return res.redirect(`/`);
  });
});

module.exports = router;
