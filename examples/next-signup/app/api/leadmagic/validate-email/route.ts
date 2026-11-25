import { createValidateEmailHandler } from "leadmagic/next";

// Same-origin only, returns { verdict, roleBased }, caches per address and
// answers "unknown" whenever LeadMagic can't, so signups never get blocked.
// Add `protect` to plug in bot detection or a rate limiter.
export const POST = createValidateEmailHandler();
