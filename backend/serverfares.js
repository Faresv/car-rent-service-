const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db_access = require('./dbfares.js'); // Updated to import only db
const db = db_access.db; // Use the shared SQLite database instance
const cookieParser = require('cookie-parser');
const server = express();
const port = 555;
const secret_key = 'DdsdsdKKFDDFDdvfddvxvc4dsdvdsvdb';

// Middleware configuration
server.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
server.use(express.json());
server.use(cookieParser());

// Token generation function
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, secret_key, { expiresIn: '1h' });
};

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token)
    return res.status(401).send('Unauthorized');
  jwt.verify(token, secret_key, (err, details) => {
    if (err)
      return res.status(403).send('Invalid or expired token');
    req.userDetails = details;
    next();
  });
};

// API endpoints
// Login route
server.post('/user/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }
    if (!row) {
      return res.status(401).send('Invalid credentials');
    }
    bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error comparing password');
      }
      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }
      const userID = row.ID;
      const isAdmin = row.ISADMIN;
      const token = generateToken(userID, isAdmin);
      res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expiresIn: '1h'
      });
      return res.status(200).json({ id: userID, admin: isAdmin });
    });
  });
});

// Registration route
server.post('/user/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send('Error hashing password');
    }
    db.run(`INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, ?)`, [name, email, hashedPassword, 0], (err) => {
      if (err) {
        return res.status(401).send(err);
      }
      return res.status(200).send('Registration successful');
    });
  });
});

// Other routes remain unchanged...

// Start server
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
