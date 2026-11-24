import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Inbox Bouncer — one original out-of-office auto-reply line.
// The joke turns on a single surprise: the inbox, left unsupervised,
// has hired a bouncer, so the sender's email is stuck outside the club.
const ENTRY =
  "Out of office until Monday. My inbox hired a bouncer, and your email is still in the queue wearing the wrong shoes.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 140;

// Validate the line before writing anything, so a bad line fails loudly
// instead of producing an invalid entry file.
if (ENTRY.length < MIN_LENGTH || ENTRY.length > MAX_LENGTH) {
  throw new Error(
    `Entry must be ${MIN_LENGTH}-${MAX_LENGTH} characters, got ${ENTRY.length}`,
  );
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("Entry must be a single line");
}
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only whitespace");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("Entry must not start or end with whitespace");
}

// Deterministic: no clock reads, no randomness, no network, no secrets.
// Writes exactly the line, with no trailing newline, so the file content
// is byte-for-byte the entry itself.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
