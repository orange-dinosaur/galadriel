import { z } from "zod";

const schema = z.object({
	DATABASE_URL: z.string().min(1),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.string().min(1),
	RESEND_API_KEY: z.string().optional(),
	EMAIL_FROM: z.string().min(1),
	REPOS_DIR: z.string().min(1),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

// Parsed on first use, not at import, so `next build` works without the variables.
export function getEnv(): Env {
	if (cached) return cached;
	const result = schema.safeParse(process.env);
	if (!result.success) {
		const names = result.error.issues.map((issue) => issue.path.join("."));
		throw new Error(
			`Missing or empty environment variable: ${names.join(", ")}`,
		);
	}
	cached = result.data;
	return cached;
}
