/*
  Build-time resume PDF generator.

  Phase 4 task 9. Renders the /resume route to a PDF via Playwright
  headless print and writes the output to out/resume.pdf so the
  `Download Resume` link works in production. Runs as a postbuild step
  after `next build`.

  Important: writes to out/, not public/. The PDF is a build artifact,
  not a source file - so it is not committed to git. Local `make e2e`
  works because Playwright serves out/ for tests; production works
  because Amplify deploys out/ to its CDN.

  Invocation: `npm run build:resume-pdf` (wired as `postbuild`).
*/

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const OUT_PDF = path.join(ROOT, "out", "resume.pdf");
const PORT = 4747;
const URL = `http://127.0.0.1:${PORT}/resume/`;

function startServe(): Promise<() => Promise<void>> {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["serve", "out", "-l", `tcp://127.0.0.1:${PORT}`, "--no-clipboard"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let ready = false;
    const onLine = (line: string) => {
      if (!ready && /Accepting connections/.test(line)) {
        ready = true;
        resolve(async () => {
          proc.kill("SIGTERM");
          await new Promise<void>((r) => proc.on("exit", () => r()));
        });
      }
    };
    proc.stdout.on("data", (d: Buffer) => d.toString().split("\n").forEach(onLine));
    proc.stderr.on("data", (d: Buffer) => d.toString().split("\n").forEach(onLine));
    proc.on("error", reject);
    setTimeout(() => {
      if (!ready) reject(new Error(`serve did not start on ${PORT} within 10s`));
    }, 10_000);
  });
}

async function main() {
  console.log(`Generating resume PDF from ${URL}...`);
  await mkdir(path.dirname(OUT_PDF), { recursive: true });

  const stopServe = await startServe();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // Force the light theme on print so the PDF reads cleanly on paper.
    await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.6in", bottom: "0.6in", left: "0.6in", right: "0.6in" },
    });
    await writeFile(OUT_PDF, pdf);
    console.log(`Wrote ${OUT_PDF} (${pdf.byteLength.toLocaleString()} bytes).`);
  } finally {
    await browser.close();
    await stopServe();
  }
}

main().catch((err) => {
  console.error("Resume PDF generation failed:", err);
  process.exit(1);
});
