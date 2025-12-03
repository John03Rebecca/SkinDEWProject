const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use(express.static(path.join(__dirname, 'public')));

// API routes...
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/catalog', require('./routes/catalogRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running without database 🎉' });
});

// homepage route (you chose pages/index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get("/api/auth/session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});
app.get("/api/admin/session", (req, res) => {
  if (req.session.userId && req.session.isAdmin === true) {
    return res.json({ loggedIn: true, isAdmin: true, userId: req.session.userId });
  }
  return res.json({ loggedIn: false, isAdmin: false });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


