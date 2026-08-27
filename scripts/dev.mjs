import { execSync, spawn } from "child_process";

const PORT = process.env.PORT || 3000;

function freePort(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const lines = output.trim().split("\n");
      const pids = new Set();

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0" && !isNaN(pid)) {
          pids.add(pid);
        }
      }

      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F /T`, { stdio: "ignore" });
          console.log(`[Auto-Clean] Freed port ${port} (terminated PID ${pid})`);
        } catch (_) {}
      }
    } else {
      execSync(`fuser -k ${port}/tcp`, { stdio: "ignore" });
    }
  } catch (_) {
    // Port is already free
  }
}

// 1. Clean port 3000 before starting
freePort(PORT);

// 2. Launch Next.js dev server
console.log(`\n🚀 Starting Next.js development server on http://localhost:${PORT}...\n`);
const nextProcess = spawn("npx next dev", {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

nextProcess.on("exit", (code) => {
  process.exit(code ?? 0);
});
