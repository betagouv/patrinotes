import { execSync } from "child_process";

export default async function teardown() {
  execSync(
    `docker compose -p patrinotes-test -f docker-compose.test.yaml --env-file ./.env.test down --volumes --remove-orphans`,
    {
      stdio: "inherit",
    },
  );
}
