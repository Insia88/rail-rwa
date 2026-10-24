// Vercel CLI workaround: this machine's hostname is non-ASCII ("투자왕"), which the
// CLI 65 puts into an HTTP header and Node rejects (ByteString > 255). Override
// os.hostname() for the CLI process only. NODE_OPTIONS=--require this file.
const os = require("node:os");
try {
  os.hostname = () => "rail-agent";
} catch {}
