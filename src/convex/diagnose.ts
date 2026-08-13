import { query, action } from "./_generated/server";

// TEMP diagnostic — remove after verifying production env vars
export const envCheck = query({
  handler: () => {
    const key = process.env.JWT_PRIVATE_KEY ?? "";
    return {
      jwtPrivateKeySet: key.length > 0,
      jwtPrivateKeyLen: key.length,
      jwtPrivateKeyStart: key.slice(0, 60),
      jwtPrivateKeyHasNewline: key.includes("\n"),
      jwksSet: (process.env.JWKS ?? "").length > 0,
      jwksLen: (process.env.JWKS ?? "").length,
    };
  },
});

// TEMP diagnostic — replicate the auth token signing step
export const tokenCheck = action({
  handler: async () => {
    try {
      const { importPKCS8, SignJWT } = await import("jose");
      const pk = await importPKCS8(process.env.JWT_PRIVATE_KEY!, "RS256");
      const token = await new SignJWT({ sub: "test" })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(process.env.CONVEX_SITE_URL ?? "none")
        .setAudience("convex")
        .setExpirationTime(new Date(Date.now() + 60000))
        .sign(pk);
      return { ok: true, tokenLen: token.length };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
});
