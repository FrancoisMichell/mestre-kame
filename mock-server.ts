// Mock server for development - starts MSW in Node.js
import { server } from "./server";

// Start the mock server
server.listen({ onUnhandledRequest: "bypass" });

console.log("🎭 Mock Service Worker started in development mode");

// Graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
