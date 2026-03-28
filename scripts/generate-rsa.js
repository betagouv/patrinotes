const { generateKeyPairSync } = require("crypto");
const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const priv = JSON.stringify(privateKey.export({ format: "jwk" }));
const pub = JSON.stringify(publicKey.export({ format: "jwk" }));
console.log("JWT_PRIVATE_JWK=" + priv);
console.log("JWT_PUBLIC_JWK=" + pub);
