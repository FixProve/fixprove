// FixProve GitHub App -- Session 2.1: shared test-only JWKS helper
//
// KS-TRACE: S2.1-TEST-JWKS | requirement (per agreed session scope: "logic-
// verify only, not live-verify"): OIDC verification is adversarially tested
// against a LOCALLY-GENERATED test keypair/JWKS, never GitHub's real
// network endpoint. `createLocalJWKS()` returns a `JWTVerifyGetKey`
// resolver (same type oidcVerify.ts's production code takes from
// `createRemoteJWKSet`) plus a `sign()` helper for building test tokens
// with arbitrary claims -- including deliberately WRONG claims, for the
// adversarial cases.

import { SignJWT, exportJWK, generateKeyPair, type JWTVerifyGetKey, importJWK } from "jose";

export interface TestJwks {
  jwks: JWTVerifyGetKey;
  sign(claims: Record<string, unknown>, opts?: { issuer?: string; audience?: string; expiresInSeconds?: number }): Promise<string>;
}

export async function createLocalTestJwks(): Promise<TestJwks> {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  const kid = "test-key-1";
  const publicJwk = await exportJWK(publicKey);

  // KS-TRACE: S2.1-TEST-JWKS-RESOLVER | a JWTVerifyGetKey is just an async
  // function (header, token) -> KeyLike; jose's real createRemoteJWKSet
  // returns exactly this shape, so this hand-rolled resolver is a faithful
  // stand-in for production without any network call.
  const jwks: JWTVerifyGetKey = async (header) => {
    if (header.kid && header.kid !== kid) {
      throw new Error(`unknown kid: ${header.kid}`);
    }
    return importJWK({ ...publicJwk, alg: "RS256" }, "RS256") as any;
  };

  async function sign(
    claims: Record<string, unknown>,
    opts: { issuer?: string; audience?: string; expiresInSeconds?: number } = {}
  ): Promise<string> {
    const issuer = opts.issuer ?? "https://token.actions.githubusercontent.com";
    const audience = opts.audience ?? "https://fixprove.dev/callback";
    const expiresIn = opts.expiresInSeconds ?? 300;
    return new SignJWT(claims)
      .setProtectedHeader({ alg: "RS256", kid })
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
      .sign(privateKey);
  }

  return { jwks, sign };
}
