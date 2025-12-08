// Register testing-library matchers and any global setup for tests
import "@testing-library/jest-dom";
import { server } from "./src/api/mocks/server";
import { beforeAll, afterAll, afterEach } from "vitest";
import { config } from "dotenv";

// Carrega variáveis de ambiente do arquivo .env.test
config({ path: ".env.test" });

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
