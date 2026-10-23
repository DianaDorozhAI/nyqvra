import { readFileSync, writeFileSync } from "node:fs";
const words = readFileSync("work/eff_large_wordlist.txt", "utf8")
  .trim()
  .split(/\r?\n/)
  .map((line) => line.trim().split(/\s+/)[1]);
if (
  words.length !== 7776 ||
  new Set(words).size !== 7776 ||
  words.some((w) => !/^[a-z-]+$/.test(w))
)
  throw new Error("Invalid EFF source");
writeFileSync(
  "src/wordlist.js",
  "// EFF Large Wordlist, CC BY 3.0 US. See src/assets/EFF-NOTICE.txt.\nexport const EFF_WORDS = " +
    JSON.stringify(words) +
    ";\n",
);
