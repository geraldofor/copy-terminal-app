// THIS FILE IS READ ONLY unless you are correctly adding a new auth provider
// or a user lifecycle hook in accordance with the vly auth documentation.

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { DEFAULT_CREDITS } from "./usage";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Anonymous],
  callbacks: {
    /**
     * Called after a user is created or updated by a sign-in. We use it to
     * grant the welcome credit package exactly once, and only to accounts
     * with a verified email (email-otp sign-in). Anonymous visitors start
     * with zero credits — the 25 welcome credits are an email-verification
     * benefit, which is the abuse-protection gate.
     */
    async afterUserCreatedOrUpdated(
      ctx: MutationCtx,
      { userId }: { userId: Id<"users"> },
    ) {
      const user = await ctx.db.get(userId);
      if (user === null) {
        return;
      }
      if (user.welcomeCreditsGranted) {
        return; // already granted — never re-grant
      }
      const isVerifiedEmailUser =
        !user.isAnonymous && !!user.emailVerificationTime;
      if (!isVerifiedEmailUser) {
        return; // anonymous visitor: no welcome credits
      }
      // Grant the one-time welcome package. If a legacy account already has
      // more credits than the welcome amount, keep its higher balance.
      const current = user.credits ?? 0;
      const granted = Math.max(current, DEFAULT_CREDITS);
      await ctx.db.patch(user._id, {
        credits: granted,
        creditsTotal: Math.max(user.creditsTotal ?? 0, granted),
        welcomeCreditsGranted: true,
      });
    },
  },
});
