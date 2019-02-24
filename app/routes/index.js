var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Login' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/register', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Register' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/guest', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Guest' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/chat', (req, res, next) => {
  if (req.user) {
    res.render('index', { title: 'Chat App' });
  } else {
    res.redirect('/');
  }
});

router.get('/admin', (req, res, next) => {
  if (req.user && (req.user.role == 'owner' || req.user.role == 'admin')) {
    res.render('index', { title: 'Chat App | Admin' });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
