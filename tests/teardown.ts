import { execSync } from "child_process";
import { isDev } from "../packages/backend/src/envVars";

export default async function teardown() {
  if (!process.env.CI) return;
  execSync(
    `docker compose -p patrinotes-test -f docker-compose.test.yaml --env-file ./.env.test down --volumes --remove-orphans`,
    {
      stdio: "inherit",
    },
  );
}
