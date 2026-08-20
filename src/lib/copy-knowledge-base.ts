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
  category: KnowledgeCategory;
  key: string;
  title: string;
  guidance: string;
  examples?: string[];
}

export const COPYFORGE_KNOWLEDGE_BASE: KnowledgeItem[] = [
  { category: "objective", key: "vendas", title: "Vendas", guidance: "Use the campaign goal to guide persuasion toward purchase. Never present the advertiser's sales goal as the customer's desire." },
  { category: "objective", key: "leads", title: "Leads", guidance: "Optimize the message for a qualified next step such as signup, contact or request for information." },
  { category: "audience", key: "professional", title: "Profissionais", guidance: "Look for career, productivity, efficiency, credibility and skill-development motivations when supported by the briefing." },
  { category: "pain", key: "complexity", title: "Complexidade", guidance: "When relevant, frame complexity as a friction to be reduced, but do not claim the product is easy unless supported." },
  { category: "desire", key: "learning", title: "Aprendizado", guidance: "Connect learning products to legitimate goals such as acquiring knowledge or developing a skill, without promising employment or income." },
  { category: "benefit", key: "skill", title: "Desenvolvimento de habilidade", guidance: "Translate confirmed learning features into the concrete skill the customer can develop." },
  { category: "objection", key: "beginner", title: "Sou iniciante", guidance: "If the product is explicitly for beginners, reduce perceived complexity without promising guaranteed results." },
  { category: "angle", key: "benefit", title: "Benefício", guidance: "Lead with the strongest benefit that can be supported by the briefing." },
  { category: "angle", key: "pain-solution", title: "Problema e solução", guidance: "Connect a real audience problem to a supported product benefit." },
  { category: "channel", key: "meta-ads", title: "Meta Ads", guidance: "Use a fast hook, clear value, short scannable paragraphs and a natural CTA suitable for mobile feeds." },
  { category: "format", key: "headline", title: "Headline", guidance: "Create distinct advertising angles rather than rewriting the briefing." },
  { category: "rule", key: "objective-is-not-desire", title: "Objetivo não é desejo", guidance: "Campaign objectives belong to the advertiser. Do not place them in the customer's mouth." },
  { category: "rule", key: "no-unsupported-proof", title: "Sem provas inventadas", guidance: "Never invent testimonials, statistics, certifications, awards, guarantees or performance results." },
  { category: "rule", key: "no-unsupported-offer", title: "Sem oferta inventada", guidance: "Never invent price, discount, bonus, deadline or scarcity when absent from the briefing." },
  { category: "rule", key: "brief-is-not-copy", title: "Briefing não é copy", guidance: "Interpret the briefing instead of concatenating its fields into the advertisement." },
];

export function getKnowledgeForPrompt(categories?: KnowledgeCategory[]): string {
  const allowed = categories ? new Set(categories) : undefined;
  return COPYFORGE_KNOWLEDGE_BASE
    .filter((item) => !allowed || allowed.has(item.category))
    .map((item) => `- [${item.category}] ${item.title}: ${item.guidance}`)
    .join("\n");
}
