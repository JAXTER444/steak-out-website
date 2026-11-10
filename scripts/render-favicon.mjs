import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "public", "favicon.svg"));

async function writePng(size, name) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(root, "public", name), buf);
  console.log(`wrote ${name} (${size}x${size})`);
}

await writePng(32, "favicon-32x32.png");
await writePng(48, "favicon-48x48.png");
await writePng(180, "apple-touch-icon.png");

// Minimal multi-size ICO: 32px PNG embedded
const png32 = readFileSync(join(root, "public", "favicon-32x32.png"));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // ICO
header.writeUInt16LE(1, 4); // 1 image
const entry = Buffer.alloc(16);
entry[0] = 32;
entry[1] = 32;
entry[2] = 0;
entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png32.length, 8);
entry.writeUInt32LE(6 + 16, 12);
writeFileSync(join(root, "public", "favicon.ico"), Buffer.concat([header, entry, png32]));
console.log("wrote favicon.ico");
