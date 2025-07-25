const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// OWASP C5: Validate All Inputs - allowlisting pattern
const allowPattern = /^[a-zA-Z0-9\s]{1,50}$/;

// Denylist checks for XSS/SQLi (detect obvious attacks)
const denyPatterns = [
  /<script.*?>/i, /<\/script>/i, /onerror/i, /onload/i,
  /drop\s+table/i, /union\s+select/i, /--/, /;.*$/i
];

app.get('/', (req, res) => {
  res.render('home', { error: null, value: '' });
});

app.post('/search', (req, res) => {
  const term = req.body.term || '';

  // Denylist first
  if (denyPatterns.some((p) => p.test(term))) {
    return res.render('home', { error: 'Invalid input detected!', value: '' });
  }

  // Allowlist next
  if (!allowPattern.test(term)) {
    return res.render('home', { error: 'Invalid characters in input!', value: '' });
  }

  // Input passes validation → show result page
  res.render('result', { term });
});

app.listen(80, '0.0.0.0', () => console.log('Web app running on port 80'));
