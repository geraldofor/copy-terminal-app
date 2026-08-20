import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * CopyForge Strategic AI Copy Engine
 *
 * Instead of a simple "write me an ad" prompt, the system now:
 * 1. Analyzes the product/service and audience
 * 2. Identifies pain points, desires, and objections
 * 3. Develops a copy strategy (angle, positioning, proof)
 * 4. Generates high-quality copy from the strategy
 * 5. Performs a quality self-check before returning
 *
 * The internal reasoning is never exposed to the user.
 * Only the final polished copy is returned.
 */

/** Models to try in order (cheapest / most generous free tier first). */
const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

const LOCALE_NAMES: Record<string, string> = {
  pt: "Brazilian Portuguese",
  en: "English (US)",
  es: "Spanish",
};

const TONES: Record<string, string> = {
  profissional: "professional, credible and polished",
  divertido: "fun, witty and playful",
  persuasivo: "persuasive and benefit-driven",
  urgente: "urgent, with a healthy sense of scarcity",
};

const GOALS: Record<string, string> = {
  vendas: "drive direct sales",
  lancamento: "launch a new product or service",
  engajamento: "maximize social engagement and interaction",
  awareness: "build brand awareness and recognition",
};

/** Per-template output structure so the copy stays organized. */
const FORMATS: Record<string, string> = {
  "meta-ads": `## Strategy
(2-3 sentence internal strategy summary — positioning, angle, main hook)
## Headlines
(3 headline variations, each on its own line)
## Main copy
(The ad body — 3 to 5 short paragraphs or bullet blocks)
## Call to action
(A single clear CTA)
## Tip
(One practical optimization tip for this specific ad)`,
  legendas: `## Hook
(Opening line that stops the scroll)
## Body
(3-4 paragraphs delivering value)
## Call to action
(Engagement prompt)
## Hashtags
(Relevant hashtags)
## Tips
(2 tips for posting this content)`,
  roteiros: `## Script · [duration] · [platform]
[Timed scenes with specific directions]
## Caption
(Post caption text)
## Audio
(Audio/music suggestion)
## Editing
(Editing direction)`,
  emails: `## Subject lines
(3 subject line options)
## Preheader
(Preview text)
## Email body
(Full email with opening, body, offer, CTA, and P.S.)`,
};

const REWRITE_MODIFIERS: Record<string, string> = {
  "": "", // no rewrite — normal generation
  persuasive:
    "\n\nREWRITE MODE: Make this copy MORE PERSUASIVE. Amplify the emotional hooks, strengthen benefit language, add social proof elements, and make the reader feel they would miss out without acting. Keep all facts accurate.",
  emotional:
    "\n\nREWRITE MODE: Make this copy MORE EMOTIONAL. Connect deeper to the reader's fears, desires, and aspirations. Use storytelling, paint a vivid picture of life with and without this product. Keep all facts accurate.",
  direct:
    "\n\nREWRITE MODE: Make this copy MORE DIRECT and concise. Cut all fluff. Use short, punchy sentences. Lead with the strongest benefit. Remove unnecessary qualifiers. Every word must earn its place.",
  premium:
    "\n\nREWRITE MODE: Make this copy sound MORE PREMIUM and high-end. Use sophisticated language, emphasize quality, exclusivity, and craftsmanship. Appeal to discerning buyers. Keep all facts accurate.",
  urgent:
    "\n\nREWRITE MODE: Make this copy MORE URGENT. Create genuine time pressure or scarcity. Make the reader feel they need to act NOW. Use action-oriented language throughout. Keep all facts accurate — never fabricate deadlines or numbers.",
  shorter:
    "\n\nREWRITE MODE: Make this copy SIGNIFICANTLY SHORTER. Cut it to roughly 50% of the current length while keeping the core message, strongest hook, and clear CTA. Every sentence must be essential.",
  conversational:
    "\n\nREWRITE MODE: Make this copy sound MORE CONVERSATIONAL and natural. Write as if talking to a friend who has this problem. Use contractions, simple language, and a warm tone. Keep all facts accurate.",
  aggressive:
    "\n\nREWRITE MODE: Make this copy MORE AGGRESSIVE in its positioning. Call out competitors (without naming them), challenge the status quo, and position this product as the obvious superior choice. Keep all facts accurate.",
  "3-variations":
    "\n\nREWRITE MODE: Generate 3 distinct VARIATIONS of this copy, each with a different angle. Variation A should lead with BENEFIT, Variation B should lead with PAIN POINT, Variation C should lead with SOCIAL PROOF. Label each clearly.",
  instagram:
    "\n\nREWRITE MODE: Adapt this copy specifically for INSTAGRAM. Make it mobile-first, add visual cues for where to place images, keep paragraphs short, use line breaks for readability, and include a strong engagement hook.",
  "meta-ads":
    "\n\nREWRITE MODE: Adapt this copy specifically for META ADS (Facebook/Instagram). Follow Meta's best practices: hook in the first line, keep primary text under 125 characters if possible, clear CTA, and remove any text that could be flagged as before/after or personal attributes.",
  "google-ads":
    "\n\nREWRITE MODE: Adapt this copy specifically for GOOGLE ADS. Follow Google Ads policies: no excessive capitalization, no misleading claims, clear and specific headlines, and ensure the copy matches a likely landing page. Keep headlines under 30 characters for responsive search ads.",
};

function buildPrompt(
  template: string,
  values: Record<string, string>,
  locale: string,
  rewriteMode: string,
): string {
  const task: Record<string, string> = {
    "meta-ads":
      "Write social media ad copy for Meta Ads / Google Ads. Include 3 headline variations, a compelling main ad body (3-5 short paragraphs), one clear call-to-action, and one practical optimization tip.",
    legendas:
      "Write an engaging social media caption that stops the scroll. Include a powerful hook, 3-4 paragraphs of value-driven body content, a clear call-to-action, relevant hashtags, and 2 posting tips.",
    roteiros:
      "Write a short video script for Reels/Shorts with timed scenes, a caption, an audio/sound suggestion, and one editing tip. Each scene should have a clear purpose and visual direction.",
    emails:
      "Write a complete sales email. Include 3 subject line options, a preheader, and a full email body with: opening hook, problem/desire framing, value proposition, offer, objection handling, clear CTA, and a P.S. line.",
  };

  const tone = TONES[values.tone] ?? TONES.persuasivo;
  const goal = GOALS[values.goal] ?? "drive conversions";
  const format = FORMATS[template] ?? "## Headlines\n## Body\n## Call to action";

  const audience = values.audience?.trim() || values.recipient?.trim() || "the target audience";
  const product = values.product?.trim() || values.company?.trim() || "the product or service";

  // Build detailed brief from all non-empty fields
  const briefEntries = Object.entries(values)
    .filter(
      ([key, value]) =>
        key !== "tone" && key !== "goal" && value && value.trim().length > 0,
    )
    .map(([key, value]) => `- ${key}: ${value.trim()}`)
    .join("\n");

  // Build strategic analysis section
  const rewriteModifier = REWRITE_MODIFIERS[rewriteMode] ?? REWRITE_MODIFIERS[""];

  const strategicPrompt = [
    // Role
    "You are a world-class direct-response copywriter with 20+ years of experience. You have written campaigns that generated millions in revenue across every major industry.",

    // Mission
    "",
    `YOUR TASK: ${task[template] ?? "write high-converting marketing copy"}.`,
    `OUTPUT LANGUAGE: The ENTIRE output must be written in ${LOCALE_NAMES[locale] ?? "English"}. Write natively in this language — do not translate from English. Respect cultural marketing norms for this locale.`,

    // Strategic brief
    "",
    "═══ STRATEGIC BRIEF ═══",
    `- Target audience: ${audience}`,
    `- Product/service: ${product}`,
    `- Tone of voice: ${tone}`,
    `- Campaign goal: ${goal}`,
    "",
    "Additional context:",
    briefEntries || "- (no additional details provided)",

    // Strategy phase (internal thinking)
    "",
    "═══ YOUR PROCESS (DO THIS INTERNALLY — DO NOT OUTPUT THIS SECTION) ═══",
    "Before writing, analyze:",
    "1. PRODUCT ANALYSIS: What does this product actually do? What problem does it solve?",
    "2. AUDIENCE ANALYSIS: Who exactly is this person? What is their current situation? What do they want?",
    "3. PAIN POINTS: What frustrations or problems does this audience face that this product addresses?",
    "4. DESIRES: What does this audience truly want to achieve or feel? What is their ideal outcome?",
    "5. VALUE PROPOSITION: What is the single most compelling reason to choose this product?",
    "6. DIFFERENTIATORS: What makes this product different from alternatives?",
    "7. OBJECTIONS: What might stop someone from buying? Address the strongest objection.",
    "8. PROOF/CREIBILITY: What evidence supports the claims? (Use only information provided — never invent certifications, testimonials, or statistics.)",
    "9. OFFER: What is the deal? (Use only pricing/discounts provided — never fabricate offers.)",
    "10. ANGLE: Based on all the above, what is the strongest angle for this copy?",

    // Copywriting rules
    "",
    "═══ COPYWRITING RULES ═══",
    "- Lead with the most compelling hook, not a description of the product.",
    "- Focus on BENEFITS, not features. Features tell; benefits sell.",
    "- Be specific, not generic. Replace vague claims with concrete outcomes.",
    "- NEVER fabricate: certifications, guarantees, statistics, testimonials, awards, prices, discounts, medical claims, scarcity, or deadlines unless explicitly provided.",
    "- Use the information provided. If important details are missing, work with what you have — do not invent them.",
    "- Avoid: clichés ('game-changer', 'revolutionary', 'world-class'), unnecessary superlatives, empty promises, and marketing buzzwords that say nothing.",
    "- Instead: use concrete language, paint a picture of transformation, speak to real problems, and make claims that can be verified.",
    "- Make the reader feel understood, not sold to.",
    "- Every paragraph must earn its place. No filler.",
    "- The CTA should feel like a natural next step, not a pushy demand.",

    // Output format
    "",
    "═══ OUTPUT FORMAT ═══",
    `Structure your output with "## " section headings as shown below:`,
    format,
    "",
    "- Total length: 150–450 words.",
    "- No preamble, no 'here is your copy', no meta commentary, no wrapping quotes.",
    "- Start directly with the first section heading.",
    "- Use bullet points (- ) for lists within sections.",
    "- The copy should be ready to publish as-is.",

    // Rewrite mode
    rewriteModifier,
  ].join("\n");

  return strategicPrompt;
}

interface GeminiPart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

async function callGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1500,
        topP: 0.95,
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Gemini ${model} returned HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeminiResponse;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/**
 * Strategic AI copy generation via Google Gemini.
 *
 * The API key never reaches the browser. If the key is missing or the API
 * fails, the action returns `{ ok: false }` so callers can fall back
 * to the local engine.
 */
export const generateWithGemini = action({
  args: {
    template: v.string(),
    values: v.record(v.string(), v.string()),
    locale: v.string(),
    rewriteMode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { ok: false as const, error: "unauthenticated" };
    }
    const user = await ctx.runQuery(api.users.currentUser);
    if (user === null || user.blocked) {
      return { ok: false as const, error: "blocked" };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "no-key" };
    }

    const prompt = buildPrompt(
      args.template,
      args.values,
      args.locale,
      args.rewriteMode ?? "",
    );

    for (const model of MODELS) {
      try {
        const text = await callGemini(apiKey, model, prompt);
        if (text && text.trim().length > 0) {
          return { ok: true as const, text, model };
        }
      } catch {
        // Try the next model (e.g. 404 for an unavailable model name).
      }
    }

    return { ok: false as const, error: "api-error" };
  },
});
