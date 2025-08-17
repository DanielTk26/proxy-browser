const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const unblocker = require('unblocker');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(compression());
app.use(cookieParser());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Proxy middleware
app.use(unblocker({
  prefix: '/proxy/',
  requestMiddleware: []
}));

// 🔑 Fix: Strip headers that block iframe embedding
app.use((req, res, next) => {
  const originalWriteHead = res.writeHead;
  res.writeHead = function (statusCode, headers) {
    if (headers) {
      delete headers['x-frame-options'];
      delete headers['content-security-policy'];
    }
    return originalWriteHead.apply(this, arguments);
  };
  next();
});

// Catch-all to serve index.html for non-proxy routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/proxy/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Unblocker proxy running on http://localhost:${PORT}`);
  console.log(`👉 Try visiting: /proxy/https://example.com/`);
});
