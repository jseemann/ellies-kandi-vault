# Ellie's Kandi Vault

Static webpage that aggregates kandi resources (pattern galleries, step-by-step guides, and tutorial videos).

## Open it
- Double-click `/Users/jseemann/Documents/Codex Project 4 Kandi/index.html`
- or serve locally with any static server.

## Files
- `index.html`: page structure
- `styles.css`: styling and responsive layout
- `data.js`: scraped/curated resource list
- `app.js`: filtering and rendering logic

## Update the catalog
Add new objects to `window.KANDI_RESOURCES` in `data.js`.

## Offline video playback (optional)
If YouTube isn't reachable, you can download the YouTube-sourced tutorials for local
playback:

1. Install [yt-dlp](https://github.com/yt-dlp/yt-dlp): `pip install yt-dlp`
2. Run `node scripts/download-videos.js` from the repo root.
3. Videos are saved to `videos/<youtube-id>.mp4` (git-ignored — kept local only, not
   committed or published, since redistributing downloaded videos publicly can run
   into copyright issues even though personal/offline use is fine).

Any card whose matching local file exists automatically plays it inline instead of
linking out to YouTube; cards without a downloaded file keep working as before.
