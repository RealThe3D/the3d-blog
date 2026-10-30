import { defineConfig } from "vitest/config";

// Unit tests must not run through Start's server-function transform or Nitro.
export default defineConfig({
	test: {
		environment: "node",
	},
});
