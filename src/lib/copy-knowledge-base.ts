/**
 * CopyForge Copywriting Knowledge Base — v1
 *
 * Structured strategic knowledge used as a foundation for future AI retrieval.
 * This is intentionally data-first: it separates marketing concepts from the
 * generation prompt so the knowledge can later move into Convex or another
 * persistent database without changing the UI.
 */

export type KnowledgeCategory =
  | "objective"
  | "audience"
  | "pain"
  | "desire"
  | "benefit"
  | "objection"
  | "angle"
  | "channel"
  | "format"
  | "rule";

export interface KnowledgeItem {
  id: string;
  category: KnowledgeCategory;
  name: string;
  description: string;
  examples?: string[];
  rules?: string[];
  avoid?: string[];
}

export const COPY_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: "objective-sales",
    category: "objective",
    name: "Sales",
    description: "Increase purchase intent and move the reader toward a commercial action.",
    rules: [
      "Treat the campaign objective as an instruction for the advertiser, not as a desire of the audience.",
      "Do not literally place the objective phrase inside the copy unless it makes contextual sense.",
    ],
    avoid: ["Mixing campaign objective with audience description"],
  },
  {
    id: "objective-leads",
    category: "objective",
    name: "Lead generation",
    description: "Encourage a qualified prospect to provide contact information or start a conversation.",
  },
  {
    id: "objective-awareness",
    category: "objective",
    name: "Awareness",
    description: "Increase recognition and understanding of the brand, product or problem.",
  },
  {
    id: "audience-beginners",
    category: "audience",
    name: "Beginners",
    description: "People with little or no prior knowledge who value clarity, confidence and a low-friction starting point.",
    rules: ["Do not assume advanced knowledge."],
  },
  {
    id: "audience-professionals",
    category: "audience",
    name: "Professionals",
    description: "People evaluating a product or skill through practical relevance, efficiency, career or business value.",
    rules: ["Prefer concrete utility over exaggerated promises."],
  },
  {
    id: "pain-complexity",
    category: "pain",
    name: "Complexity",
    description: "The audience feels that the subject is difficult, confusing or hard to start.",
    examples: ["I do not know where to start", "This looks too technical"],
  },
  {
    id: "pain-time",
    category: "pain",
    name: "Time loss",
    description: "The audience spends unnecessary time performing repetitive or manual work.",
  },
  {
    id: "desire-learning",
    category: "desire",
    name: "Learning a useful skill",
    description: "The audience wants practical knowledge they can apply to real situations.",
  },
  {
    id: "desire-productivity",
    category: "desire",
    name: "Productivity",
    description: "The audience wants to complete useful work with less repetitive effort.",
  },
  {
    id: "benefit-practical",
    category: "benefit",
    name: "Practical application",
    description: "Translate a confirmed product capability into a concrete, understandable use case.",
    rules: ["Only claim outcomes supported by the briefing or product facts."],
  },
  {
    id: "objection-beginner",
    category: "objection",
    name: "Fear of not being able to learn",
    description: "A beginner may worry that the subject is too difficult or technical.",
    rules: ["Reduce friction through clarity; do not promise guaranteed results."],
  },
  {
    id: "angle-problem-solution",
    category: "angle",
    name: "Problem → solution",
    description: "Open with a relevant problem and position the product as a credible way to address it.",
  },
  {
    id: "angle-benefit",
    category: "angle",
    name: "Benefit-led",
    description: "Lead with the strongest verified benefit instead of simply naming the product.",
  },
  {
    id: "angle-curiosity",
    category: "angle",
    name: "Curiosity",
    description: "Create interest through a useful question, contrast or unexpected insight without misleading the audience.",
  },
  {
    id: "channel-meta-ads",
    category: "channel",
    name: "Meta Ads",
    description: "Facebook and Instagram advertising where the first line and mobile readability matter strongly.",
    rules: [
      "Lead quickly with the hook or relevant benefit.",
      "Keep paragraphs short and easy to scan on mobile.",
      "Do not rely on generic CTAs when a more specific next step is available.",
    ],
  },
  {
    id: "format-headline",
    category: "format",
    name: "Ad headline",
    description: "A short promise, benefit, curiosity hook or positioning statement designed to earn attention.",
    avoid: ["Copying the entire audience description", "Copying the campaign objective"],
  },
  {
    id: "format-primary-text",
    category: "format",
    name: "Primary ad text",
    description: "The main persuasive message that connects audience context, problem/desire, product value and next step.",
  },
  {
    id: "format-cta",
    category: "format",
    name: "CTA",
    description: "A clear next action that matches the actual offer and conversion path.",
    examples: ["Conheça o curso", "Comece a aprender", "Saiba mais", "Comprar agora"],
    rules: ["Use only actions supported by the actual user flow."],
  },
  {
    id: "rule-separate-strategy",
    category: "rule",
    name: "Separate strategy from audience language",
    description: "Campaign objectives, channel and internal strategy guide the copy; they are not automatically customer-facing language.",
    examples: [
      "Objective: drive sales → do not write 'convert interest into sales' to the customer.",
      "Audience: professionals interested in automation → translate this into relevant motivations and use cases.",
    ],
  },
  {
    id: "rule-no-invention",
    category: "rule",
    name: "No unsupported claims",
    description: "Never fabricate evidence or commercial facts to make copy sound stronger.",
    rules: [
      "No invented testimonials.",
      "No invented statistics or conversion rates.",
      "No invented guarantees, discounts, bonuses, deadlines or scarcity.",
      "No invented certifications, awards or credentials.",
      "No invented financial, career or health outcomes.",
    ],
  },
  {
    id: "rule-benefit-vs-feature",
    category: "rule",
    name: "Feature → benefit translation",
    description: "Use product facts to derive understandable benefits, but do not leap beyond what the facts support.",
    examples: [
      "Feature: teaches Python → Benefit: builds a practical foundation for using Python.",
      "Feature: automation lessons → Benefit: helps the learner understand how automation can reduce repetitive work.",
    ],
  },
  {
    id: "rule-audience-interpretation",
    category: "rule",
    name: "Audience interpretation",
    description: "Infer plausible motivations and objections from the audience, but do not present inferred outcomes as guaranteed facts.",
  },
];

export function getKnowledgeByCategory(category: KnowledgeCategory): KnowledgeItem[] {
  return COPY_KNOWLEDGE_BASE.filter((item) => item.category === category);
}

export function getKnowledgeForPrompt(categories?: KnowledgeCategory[]): string {
  const selected = categories?.length
    ? COPY_KNOWLEDGE_BASE.filter((item) => categories.includes(item.category))
    : COPY_KNOWLEDGE_BASE;

  return selected
    .map((item) => {
      const rules = item.rules?.length ? ` Rules: ${item.rules.join(" | ")}.` : "";
      const avoid = item.avoid?.length ? ` Avoid: ${item.avoid.join(" | ")}.` : "";
      return `- [${item.category}] ${item.name}: ${item.description}${rules}${avoid}`;
    })
    .join("\n");
}
