#!/usr/bin/env node
// Downloads the YouTube entries from data.js into videos/ for offline/local playback.
// Requires yt-dlp on PATH (pip install yt-dlp / brew install yt-dlp).
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const repoRoot = path.join(__dirname, "..");
const outDir = path.join(repoRoot, "videos");
fs.mkdirSync(outDir, { recursive: true });

global.window = global;
require(path.join(repoRoot, "data.js"));
const resources = window.KANDI_RESOURCES;

const extractYouTubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
};

const videoItems = resources.filter(
  (item) => item.type === "video" && /youtube/i.test(item.source)
);

let failures = 0;

for (const item of videoItems) {
  const id = extractYouTubeId(item.url);
  if (!id) {
    console.warn(`Skipping "${item.title}" — could not parse a video id from ${item.url}`);
    failures += 1;
    continue;
  }

  const outPath = path.join(outDir, `${id}.mp4`);
  if (fs.existsSync(outPath)) {
    console.log(`Already have "${item.title}" (${id}.mp4)`);
    continue;
  }

  console.log(`Downloading "${item.title}" (${id})...`);
  try {
    execFileSync(
      "yt-dlp",
      [
        "-f",
        "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]",
        "--merge-output-format",
        "mp4",
        "-o",
        outPath,
        item.url,
      ],
      { stdio: "inherit" }
    );
  } catch (err) {
    console.error(`Failed to download "${item.title}": ${err.message}`);
    failures += 1;
  }
}

if (failures > 0) {
  console.warn(`\n${failures} video(s) failed — check the URLs in data.js for those titles.`);
  process.exitCode = 1;
} else {
  console.log("\nAll videos downloaded.");
}
