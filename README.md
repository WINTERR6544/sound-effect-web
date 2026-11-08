# Stage Soundboard

Soundboard for live theatre: trigger audio/video cues from pads or the keyboard, tweak volume, speed, EQ, filters, reverb and delay live, and send video to a projector window.

- **Web:** open the GitHub Pages site. Files in `app/sounds/` load onto the pads the first time someone opens the site (or via Master → "โหลดชุดเสียงตั้งต้น").
- **Desktop (Win/Mac):** `npm install && npm run dist` builds zips in `dist/`.

To add sounds to the website, put audio/video files in `app/sounds/` and push to `main`. The deploy workflow lists them automatically.

Shortcuts: `Space` fade out all, `Esc` stop all, `Backspace` stop last cue, `Shift`+pad key stop that pad.
