import type { NextConfig } from "next";
import { execSync } from "child_process";

function resolveAppVersion(): string {
  const env = (process.env.NEXT_PUBLIC_ENVIRONMENT || "DEV").toUpperCase();

  // 1. Try to read Git Tag dynamically
  try {
    const gitTag = execSync("git describe --tags --always", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    // If a semantic Git tag exists (e.g., v1.0.0 or 1.0.0)
    if (gitTag && /^v?\d+\.\d+/i.test(gitTag)) {
      if (env === "PROD") {
        return gitTag.startsWith("v") ? gitTag : `v${gitTag}`;
      }
      return `${gitTag.startsWith("v") ? gitTag : `v${gitTag}`}-${env.toLowerCase()}`;
    }
  } catch {
    // Ignore git lookup error in non-git or minimal build environments
  }

  // 2. Read from environment variable (.env.dev, .env.uat, .env.prod)
  if (process.env.NEXT_PUBLIC_APP_VERSION) {
    return process.env.NEXT_PUBLIC_APP_VERSION;
  }

  // 3. Fallback based on active environment
  if (env === "PROD") return "v1.0.0";
  if (env === "UAT") return "v1.0.0-uat";
  return "v1.0.0-dev";
}

const resolvedVersion = resolveAppVersion();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: resolvedVersion,
  },
};

export default nextConfig;
