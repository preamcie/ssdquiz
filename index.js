const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// OWASP C5 input validation: allowlisting pattern
const allowedPattern = /^[a-zA-Z0-9\s]{1,50}$/;

// Denylist simple checks for obvious attacks (extra detection)
const denylist = [
  /<script.*?>/i, /<\/script>/i, /onerror/i, /onload/i,
  /drop\s+table/i, /union\s+select/i, /--/, /;.*$/i
];

app.get('/', (req, res) => {
  res.render('home', { error: null, value: '' });
});

app.post('/search', (req, res) => {
  const term = req.body.term || '';

  // Denylist detection
  if (denylist.some((pattern) => pattern.test(term))) {
    return res.render('home', { error: 'Invalid input detected!', value: '' });
  }

  // Allowlist validation
  if (!allowedPattern.test(term)) {
    return res.render('home', { error: 'Invalid characters in input!', value: '' });
  }

  // If passed, show result page
  res.render('result', { term });
});

app.listen(80, '0.0.0.0', () => console.log('Web app running on port 80'));
