import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const incoming = process.argv.slice(2);
const forwarded = [];

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];
  if (argument === "--strictPort") continue;
  if (argument === "--host") {
    forwarded.push("--hostname", incoming[index + 1] || "0.0.0.0");
    index += 1;
    continue;
  }
  forwarded.push(argument);
}

const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", ...forwarded], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
