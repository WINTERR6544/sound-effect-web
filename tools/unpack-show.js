// Unpacks a .ssbshow file (saved from the app) into app/sounds + app/sounds/pads.json.
// Usage: node tools/unpack-show.js path/to/show.ssbshow
const fs = require('fs'), path = require('path');
const buf = fs.readFileSync(process.argv[2]);
if (buf.toString('utf8', 0, 4) !== 'SSB1') throw new Error('not a .ssbshow file');
const len = buf.readUInt32LE(4);
const hdr = JSON.parse(buf.toString('utf8', 8, 8 + len));
const dir = path.join(__dirname, '..', 'app', 'sounds'); fs.mkdirSync(dir, { recursive: true });
let off = 8 + len; const out = new Map(); const used = new Set();
for (const f of hdr.files) {
  const pad = hdr.state.pads.find(p => p.fileId === f.id);
  let name = (pad && pad.fileName || f.id).replace(/[\/\\:*?"<>|#%]/g, '_');
  const stem = name.replace(/(\.[^.]+)?$/, ''), ext = name.slice(stem.length);
  for (let i = 2; used.has(name.toLowerCase()); i++) name = `${stem} (${i})${ext}`;
  used.add(name.toLowerCase());
  fs.writeFileSync(path.join(dir, name), buf.subarray(off, off + f.size)); off += f.size;
  out.set(f.id, name); console.log(`${(f.size / 1048576).toFixed(1)} MB  ${name}`);
}
const pads = hdr.state.pads.filter(p => out.has(p.fileId)).map(p => {
  const { id, fileId, fileName, fileType, ...rest } = p; return { file: out.get(fileId), ...rest };
});
fs.writeFileSync(path.join(dir, 'pads.json'), JSON.stringify({ master: hdr.state.master, video: hdr.state.video, pads }, null, 2) + '\n');
console.log(`pads.json: ${pads.length} pads`);
