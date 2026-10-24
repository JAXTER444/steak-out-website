import { spawnSync } from "node:child_process";
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

function setConvexEnv(name, value) {
  const result = spawnSync("npx", ["convex", "env", "set", name], {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
const privateKeyOneLine = privateKey.trimEnd().replace(/\n/g, " ");

setConvexEnv("JWT_PRIVATE_KEY", privateKeyOneLine);
setConvexEnv("JWKS", jwks);

console.log("Done. JWT_PRIVATE_KEY and JWKS are set on your Convex deployment.");
