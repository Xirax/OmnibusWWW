// Re-encodes portfolio clips for the web. Raw files dropped into VIDEOS_DIR are moved to
// ORIGINALS_DIR (git-ignored, outside the Portfolio glob) and replaced by a small H.264 copy.
// Requires a system ffmpeg: `winget install Gyan.FFmpeg` (Windows) / `brew install ffmpeg`.
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

const VIDEOS_DIR = "src/images/portfolio/videos";
const ORIGINALS_DIR = join(VIDEOS_DIR, "originals");
// The slideshow swaps clips every 4.5 s, so nothing past ~5 s is ever seen
const MAX_SECONDS = 5;
const SHORT_SIDE_PX = 720;
const CRF = 26; // x264 quality: lower = better/larger

const hasFfmpeg =
  spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
if (!hasFfmpeg) {
  console.error(
    "ffmpeg not found. Install it (Windows: `winget install Gyan.FFmpeg`) and reopen the terminal.",
  );
  process.exit(1);
}

mkdirSync(ORIGINALS_DIR, { recursive: true });

const isMp4 = (name) => /\.mp4$/i.test(name);
const mb = (path) => (statSync(path).size / 1024 / 1024).toFixed(1);

// A file is "raw" if its original hasn't been archived yet – already compressed clips are skipped
const raw = readdirSync(VIDEOS_DIR).filter(
  (name) => isMp4(name) && !existsSync(join(ORIGINALS_DIR, name)),
);

if (raw.length === 0) {
  console.log(
    "Nothing to compress – every clip already has an original in",
    ORIGINALS_DIR,
  );
  process.exit(0);
}

let failed = 0;
for (const name of raw) {
  const original = join(ORIGINALS_DIR, name);
  const output = join(VIDEOS_DIR, name);
  const tmp = join(VIDEOS_DIR, `.${name}.tmp.mp4`);
  renameSync(output, original);

  // Scale the shorter side to SHORT_SIDE_PX (never upscale), so both portrait and landscape clips work
  const scale = `scale='if(gt(iw,ih),-2,min(iw,${SHORT_SIDE_PX}))':'if(gt(iw,ih),min(ih,${SHORT_SIDE_PX}),-2)'`;
  const { status } = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      original,
      "-t",
      String(MAX_SECONDS),
      "-an",
      "-vf",
      scale,
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      String(CRF),
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      tmp,
    ],
    { stdio: "inherit" },
  );

  if (status !== 0) {
    // Put the raw file back so the site keeps working and the next run retries it
    rmSync(tmp, { force: true });
    renameSync(original, output);
    console.error(`✗ ${name} – ffmpeg failed`);
    failed++;
    continue;
  }
  renameSync(tmp, output);
  console.log(`✓ ${name}: ${mb(original)} MB → ${mb(output)} MB`);
}

process.exit(failed ? 1 : 0);
