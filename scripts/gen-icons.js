#!/usr/bin/env node
// Generates simple SVG-based PNG icons for the PWA manifest
// Run: node scripts/gen-icons.js

const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

// SVG: purple "M" on dark background
function makeSVG(size) {
  const fontSize = Math.round(size * 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0d0d0d" rx="${Math.round(size * 0.18)}"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="Georgia, serif" font-size="${fontSize}" font-weight="bold" fill="#7c6af7">M</text>
</svg>`;
}

fs.writeFileSync(path.join(outDir, "icon-192.svg"), makeSVG(192));
fs.writeFileSync(path.join(outDir, "icon-512.svg"), makeSVG(512));

console.log("SVG icons written to public/icons/");
console.log("NOTE: Rename .svg to .png or convert with sharp/inkscape for production PWA.");
console.log("For quick dev, reference the SVGs directly or use a favicon generator.");
