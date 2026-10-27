const express = require('express');
const compression = require('compression');
const path = require('path');
const app = express();

const distPath = path.join(__dirname, 'dist/belcaro-site');

app.use(compression());

// Serve static files from the dist directory
app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store');
        return;
      }

      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

// For all other routes, serve the index.html file
app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    res.status(404).end();
    return;
  }

  res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 