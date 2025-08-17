const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const unblocker = require('unblocker');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('tiny'));
app.use(compression());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(unblocker({
  prefix: '/proxy/',
  requestMiddleware: []
}));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/proxy/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Unblocker proxy running on http://localhost:${PORT}`);
  console.log(`Enter a URL on the page, or visit /proxy/https://example.com/`);
});
