const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '..', 'The Spectr.png');
const outputPath = path.join(__dirname, '..', 'The Spectr.png');
const iconPath = path.join(__dirname, '..', 'src', 'app', 'icon.png');

const tolerance = 45; // color distance threshold (0-255 scale)

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
}

const buffer = fs.readFileSync(inputPath);
const png = PNG.sync.read(buffer);

// Sample background from corners (handles pink, blue, or similar solid bg)
const samples = [
  [0, 0],
  [png.width - 1, 0],
  [0, png.height - 1],
  [png.width - 1, png.height - 1],
];
let br = 0, bg = 0, bb = 0;
for (const [x, y] of samples) {
  const i = (png.width * y + x) * 4;
  br += png.data[i];
  bg += png.data[i + 1];
  bb += png.data[i + 2];
}
br = Math.round(br / samples.length);
bg = Math.round(bg / samples.length);
bb = Math.round(bb / samples.length);

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const i = (png.width * y + x) * 4;
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    if (colorDistance(r, g, b, br, bg, bb) <= tolerance) {
      png.data[i + 3] = 0; // set alpha to transparent
    }
  }
}

const outBuffer = PNG.sync.write(png);
fs.writeFileSync(outputPath, outBuffer);
fs.writeFileSync(iconPath, outBuffer);
console.log('Background removed. Updated The Spectr.png and src/app/icon.png');
