import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		env: {
			DATABASE_URL: "postgres://test:test@localhost:5432/test",
			BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret-0000",
			BETTER_AUTH_URL: "http://localhost:3000",
			EMAIL_FROM: "Galadriel <no-reply@localhost>",
			REPOS_DIR: "./.data/test-repos",
		},
	},
});
