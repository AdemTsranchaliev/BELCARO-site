const express = require('express');
const compression = require('compression');
const fs = require('fs');
const path = require('path');
const app = express();

const distPath = path.join(__dirname, 'dist/belcaro-site');

app.use(compression());

app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
    return;
  }
  next();
});

app.use(
  express.static(distPath, {
    index: false,
    redirect: false,
    setHeaders: (res, filePath) => {
      if (
        filePath.endsWith('index.html') ||
        filePath.endsWith('robots.txt') ||
        filePath.endsWith('sitemap.xml')
      ) {
        res.setHeader('Cache-Control', 'no-cache');
        return;
      }

      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

app.get('*', (req, res) => {
  if (path.extname(req.path)) {
    res.status(404).end();
    return;
  }

  const prerendered = path.join(distPath, req.path, 'index.html');
  res.setHeader('Cache-Control', 'no-cache');
  if (req.path !== '/' && fs.existsSync(prerendered)) {
    res.sendFile(prerendered);
    return;
  }

  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
