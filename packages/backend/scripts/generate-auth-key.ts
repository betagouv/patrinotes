/**
 * Prints a new AUTH_JWT_PRIVATE_KEY (RS256, PKCS8 PEM on one line with "\n" escapes).
 * Rotating it invalidates the access tokens only: clients get a new one on their next refresh.
 *   pnpm backend auth:generate-key
 */
import { generateKeyPairSync } from "node:crypto";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
console.log(`AUTH_JWT_PRIVATE_KEY="${pem.trim().replace(/\n/g, "\\n")}"`);
