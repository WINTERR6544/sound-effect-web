// Writes app/sounds/manifest.json listing the audio/video files in app/sounds.
// Runs on every deploy, so adding a file to app/sounds is enough.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'app', 'sounds'), out = path.join(dir, 'manifest.json');
const ext = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|webm|mp4|m4v|mov)$/i;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => ext.test(f)).sort((a, b) => a.localeCompare(b, 'th', { numeric: true })) : [];
fs.writeFileSync(out, JSON.stringify(files, null, 2) + '\n');
console.log(`manifest: ${files.length} files`);
