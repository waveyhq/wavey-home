import type { Context } from "@netlify/edge-functions";

const DIRECTORY_PATH = "/.well-known/http-message-signatures-directory";
const CONTENT_TYPE = "application/http-message-signatures-directory+json";
const KEY_ID = "R-JbCDvQJtHDXjggWqQ8Mm3BlS2xqs8g4SkMhgFio-Q";
const PUBLIC_JWK = {
  kty: "OKP",
  crv: "Ed25519",
  x: "wjOLCNj7yYgtxAv0TOHxaUCvVoHIMXZo_6nQU0BlvBA",
};
const JWKS_BODY = JSON.stringify({ keys: [PUBLIC_JWK] });

function base64UrlEncode(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function buildSignatureBase(
  authority: string,
  created: number,
  expires: number,
  keyId: string,
  nonce: string,
): string {
  const signatureParams =
    `("@authority";req): "${authority}"\n` +
    `@signature-params: ("@authority";req);alg="ed25519";keyid="${keyId}";nonce="${nonce}";tag="http-message-signatures-directory";created=${created};expires=${expires}`;
  return `"@authority" "@authority": ${authority}\n${signatureParams}`;
}

async function importSigningKey(): Promise<CryptoKey | null> {
  const raw = Deno.env.get("WEB_BOT_AUTH_PRIVATE_KEY_JWK");
  if (!raw) return null;
  try {
    const jwk = JSON.parse(raw) as JsonWebKey;
    return crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
  } catch {
    return null;
  }
}

export default async function webBotAuthDirectory(
  request: Request,
  _context: Context,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  if (url.pathname !== DIRECTORY_PATH) {
    return new Response("Not Found", { status: 404 });
  }

  const authority = request.headers.get("host") || url.host;
  const created = Math.floor(Date.now() / 1000);
  const expires = created + 86400;
  const nonce = randomNonce();
  const signatureInput =
    `sig1=("@authority";req);alg="ed25519";keyid="${KEY_ID}";nonce="${nonce}";tag="http-message-signatures-directory";created=${created};expires=${expires}`;

  const headers = new Headers({
    "Content-Type": CONTENT_TYPE,
    "Cache-Control": "public, max-age=86400",
  });

  const signingKey = await importSigningKey();
  if (signingKey) {
    const signatureBase = buildSignatureBase(authority, created, expires, KEY_ID, nonce);
    const signatureBytes = await crypto.subtle.sign(
      "Ed25519",
      signingKey,
      new TextEncoder().encode(signatureBase),
    );
    headers.set("Signature-Input", signatureInput);
    headers.set("Signature", `sig1=:${base64UrlEncode(signatureBytes)}:`);
  }

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }

  return new Response(JWKS_BODY, { status: 200, headers });
}
