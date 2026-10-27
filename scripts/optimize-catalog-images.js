const path = require('path');
const fs = require('fs/promises');
const sharp = require('sharp');

const targets = [
  {
    dir: path.join(__dirname, '..', 'src', 'assets', 'images', 'products-thumb'),
    widths: [320, 640],
  },
  {
    dir: path.join(__dirname, '..', 'src', 'assets', 'images', 'products'),
    widths: [600, 1000],
  },
];

const isWebp = (file) => file.toLowerCase().endsWith('.webp');
const isVariant = (file) => /-\d+\.webp$/i.test(file);

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const optimizeFile = async (dir, file, widths) => {
  const inputPath = path.join(dir, file);
  const baseName = file.replace(/\.webp$/i, '');

  for (const width of widths) {
    const outputPath = path.join(dir, `${baseName}-${width}.webp`);
    if (await fileExists(outputPath)) {
      continue;
    }

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .toFormat('webp', { quality: 80 })
      .toFile(outputPath);
  }
};

const run = async () => {
  for (const target of targets) {
    const entries = await fs.readdir(target.dir);
    const sourceFiles = entries.filter((file) => isWebp(file) && !isVariant(file));

    for (const file of sourceFiles) {
      await optimizeFile(target.dir, file, target.widths);
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
