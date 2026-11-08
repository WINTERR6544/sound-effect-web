// Writes app/sounds/manifest.json for the website.
// If app/sounds/pads.json exists (pad names, keys, settings), it is used as the base
// and any extra audio/video files in app/sounds are added after it.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'app', 'sounds');
const ext = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm|mp4|m4v|mov)$/i;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => ext.test(f)).sort((a, b) => a.localeCompare(b, 'th', { numeric: true })) : [];
const padsFile = path.join(dir, 'pads.json');
const base = fs.existsSync(padsFile) ? JSON.parse(fs.readFileSync(padsFile, 'utf8')) : { pads: [] };
base.pads = (base.pads || []).filter(p => files.includes(p.file));
for (const f of files) if (!base.pads.some(p => p.file === f)) base.pads.push({ file: f });
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(base, null, 2) + '\n');
console.log(`manifest: ${base.pads.length} pads`);
