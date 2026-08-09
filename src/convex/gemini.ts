import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Real AI copy generation via the Google Gemini API.
 *
 * The API key is read from the deployment environment variables
 * (GEMINI_API_KEY or GOOGLE_API_KEY) — it never reaches the browser.
 * If the key is missing or the API fails, the action returns
 * `{ ok: false }` and the frontend falls back to the local engine,
 * so generation never breaks for the user.
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
  vendas: "drive sales",
  lancamento: "launch a new product",
  engajamento: "maximize engagement",
  awareness: "build brand awareness",
};

/** Per-template output structure hints so the copy keeps the app's format. */
const FORMATS: Record<string, string> = {
  "meta-ads": `## Strategy
## Headlines
## Main copy
## Call to action
## Tip`,
  legendas: `## Hook
## Body
## Call to action
## Hashtags
## Tips`,
  roteiros: `## Script
## Caption
## Audio
## Editing`,
  emails: `## Subject lines
## Preheader
## Email body`,
};

function buildPrompt(
  template: string,
  values: Record<string, string>,
  locale: string,
): string {
  const task: Record<string, string> = {
    "meta-ads":
      "social media ad copy for Meta Ads / Google Ads (3 headline variations, a short main ad body, one call-to-action and one practical tip)",
    legendas:
      "an engaging social media caption (hook, body, call-to-action and a set of hashtags)",
    roteiros:
      "a short video script for Reels/Shorts with timed scenes, a caption, an audio/sound suggestion and one editing tip",
    emails: "a sales email (3 subject line options, a preheader and the email body)",
  };

  const tone = TONES[values.tone] ?? TONES.persuasivo;
  const goal = GOALS[values.goal] ?? "drive conversions";
  const format = FORMATS[template] ?? "## Headlines\n## Body\n## Call to action";

  const brief = Object.entries(values)
    .filter(
      ([key, value]) =>
        key !== "tone" && value && value.trim().length > 0,
    )
    .map(([key, value]) => `- ${key}: ${value.trim()}`)
    .join("\n");

  return [
    "You are a senior direct-response copywriter with 20 years of experience writing high-converting marketing copy.",
    "",
    `Task: write ${task[template] ?? "marketing copy"}.`,
    `Output language: the ENTIRE output must be written in ${LOCALE_NAMES[locale] ?? "English"}.`,
    `Target audience: ${values.audience?.trim() || values.recipient?.trim() || "the target audience described below"}.`,
    `Product/service: ${values.product?.trim() || values.company?.trim() || "the product or service described below"}.`,
    `Tone of voice: ${tone}.`,
    `Goal: ${goal}.`,
    "",
    "Brief details:",
    brief || "- (no additional details provided)",
    "",
    "Output requirements:",
    `- Structure the output with "## " section headings and "- " bullet points, using sections like:`,
    format,
    "- Keep it concise, specific and ready to publish: no preamble, no meta commentary, no wrapping quotes.",
    "- Use the words and benefits a real human expert would choose; avoid generic filler.",
    "- Total length between 150 and 450 words.",
  ].join("\n");
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
        maxOutputTokens: 1200,
        topP: 0.95,
      },
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) {
    throw new Error(`Gemini ${model} returned HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeminiResponse;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/**
 * Generate copy with the real Gemini API. Never throws for API/key
 * problems — it returns `{ ok: false }` so callers can fall back.
 */
export const generateWithGemini = action({
  args: {
    template: v.string(),
    values: v.record(v.string(), v.string()),
    locale: v.string(),
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

    const prompt = buildPrompt(args.template, args.values, args.locale);

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
