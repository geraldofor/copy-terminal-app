import { Captions, Mail, Megaphone, Video, type LucideIcon } from "lucide-react";
import { TEMPLATE_DATA } from "@/i18n/templates";
import type { Locale } from "@/i18n/strings";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Tone = "profissional" | "divertido" | "persuasivo" | "urgente";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: "input" | "textarea" | "select";
  options?: FieldOption[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface ToneBank {
  benefits: string[];
  pains: string[];
  ctas: string[];
  reasons: string[];
  urgency: string;
}

export interface CopyTemplate {
  id: string;
  name: string;
  description: string;
  path: string; // fake file path shown in the sidebar
  tags: string[];
  icon: LucideIcon;
  fields: FieldDef[];
  generate: (values: Record<string, string>, locale: Locale) => string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Random pick — used so "Reescrever" produces fresh variations. */
function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fill `{placeholders}` in a template string. */
function fmt(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}

export function toneOf(values: Record<string, string>): Tone {
  const tone = values.tone as Tone | undefined;
  const banks = TEMPLATE_DATA.pt.banks;
  return tone && tone in banks ? tone : "persuasivo";
}

/** Display label for a tone in a given locale. */
export function toneLabel(locale: Locale, tone: Tone): string {
  return TEMPLATE_DATA[locale].toneLabels[tone];
}

/** Display options for the tone select in a given locale. */
export function toneOptions(locale: Locale): FieldOption[] {
  return TEMPLATE_DATA[locale].toneOptions;
}

function slugifyWords(text: string, max = 4): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, max);
}

/* ------------------------------------------------------------------ */
/* Template 1 — Meta/Google Ads                                        */
/* ------------------------------------------------------------------ */

function generateMetaAds(v: Record<string, string>, locale: Locale): string {
  const c = TEMPLATE_DATA[locale].content.metaAds;
  const banks = TEMPLATE_DATA[locale].banks;
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const tone = toneOf(v);
  const t = banks[tone];
  const goalPhrase = c.goalPhrases[v.goal] ?? c.goalPhrases.vendas;
  const platform = v.platform || "meta";
  const diff = v.differentiator?.trim();
  const cta = v.cta?.trim() || sample(t.ctas);

  const body =
    fmt(c.body, { audience, product, goal: goalPhrase }) +
    (diff ? ` ${fmt(c.more, { diff })}` : "") +
    ` ${sample(t.reasons)}${t.urgency ? ` ${t.urgency}` : ""} ${c.outro}`;

  const tip = platform === "google" ? c.tips.google : c.tips.meta;

  return [
    `## ${c.headings.strategy}`,
    `- ${c.labels.goal}: ${goalPhrase}`,
    `- ${c.labels.audience}: ${audience}`,
    `- ${c.labels.tone}: ${toneLabel(locale, tone)}`,
    `- ${c.labels.format}: ${c.platformLabels[platform]}`,
    "",
    `## ${c.headings.titles}`,
    `- ${product}: ${sample(t.benefits)}`,
    `- ${fmt(c.headlineAudience, { audience, goal: goalPhrase })}`,
    `- ${fmt(c.headlinePain, { pain: sample(t.pains), product })}`,
    "",
    `## ${c.headings.main}`,
    body,
    "",
    `## ${c.headings.cta}`,
    `- ${cta} →`,
    "",
    `## ${c.headings.tip}`,
    `- ${tip}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 2 — Captions IG/TikTok                                     */
/* ------------------------------------------------------------------ */

function generateLegendas(v: Record<string, string>, locale: Locale): string {
  const c = TEMPLATE_DATA[locale].content.legendas;
  const banks = TEMPLATE_DATA[locale].banks;
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const topic = v.topic?.trim() || "este assunto";
  const tone = toneOf(v);
  const t = banks[tone];
  const goalPhrase = c.goalPhrases[v.goal] ?? c.goalPhrases.engajamento;
  const emojis = v.emojis === "sim";
  const emo = (s: string) => (emojis ? s : "");

  const hook = fmt(sample(c.hooks), { topic, audience });
  const cta = v.cta?.trim() || sample(t.ctas);

  const words = slugifyWords(topic, 3);
  const tags = [...words.map((w) => `#${w}`), ...c.hashtagBase.map((b) => `#${b}`)].slice(0, 15);

  return [
    `## ${c.headings.hook}`,
    hook,
    "",
    `## ${c.headings.body}`,
    `${fmt(c.body, { product, goal: goalPhrase })} ${sample(t.reasons)}`,
    `${fmt(c.body2, { benefit: sample(t.benefits) })} ${emo("✨")}`,
    "",
    `## ${c.headings.cta}`,
    `- ${cta} ${emo("🚀")}`,
    "",
    `## ${c.headings.hashtags}`,
    `- ${tags.join(" ")}`,
    "",
    `## ${c.headings.tips}`,
    `- ${c.tips[0]}`,
    `- ${c.tips[1]}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 3 — Reels/Shorts scripts                                   */
/* ------------------------------------------------------------------ */

const SCENE_LAYOUTS: Record<string, [string, string][]> = {
  "15": [
    ["0:00–0:04", "hook"],
    ["0:04–0:12", "dev"],
    ["0:12–0:15", "cta"],
  ],
  "30": [
    ["0:00–0:04", "hook"],
    ["0:04–0:14", "pain"],
    ["0:14–0:24", "climax"],
    ["0:24–0:30", "cta"],
  ],
  "60": [
    ["0:00–0:06", "hook"],
    ["0:06–0:20", "context"],
    ["0:20–0:40", "solve"],
    ["0:40–0:52", "objection"],
    ["0:52–1:00", "cta"],
  ],
};

function generateRoteiros(v: Record<string, string>, locale: Locale): string {
  const c = TEMPLATE_DATA[locale].content.roteiros;
  const banks = TEMPLATE_DATA[locale].banks;
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const topic = v.topic?.trim() || "este assunto";
  const duration = v.duration || "30";
  const platform = v.platform || "reels";
  const tone = toneOf(v);
  const t = banks[tone];
  const goalPhrase = TEMPLATE_DATA[locale].content.legendas.goalPhrases[v.goal] ?? "engajar e gerar comentários";
  const diff = v.differentiator?.trim();
  const cta = v.cta?.trim() || sample(t.ctas);

  const hook = fmt(sample(c.hooks), { topic, audience });
  const dev = fmt(c.dev, { product, goal: goalPhrase, benefit: sample(t.benefits) });
  const climax = diff ? fmt(c.climax, { diff }) : c.climaxFallback;
  const context = fmt(c.context, { audience, pain: sample(t.pains) });
  const objection = diff ? fmt(c.objection, { diff }) : c.objectionFallback;

  const sceneTexts: Record<string, string> = { hook, dev, climax, context, objection, cta: `${cta} →` };
  const scenesFinal = (SCENE_LAYOUTS[duration] ?? SCENE_LAYOUTS["30"]).map(
    ([range, kind]) => `[${c.scenePrefix} · ${range}] ${c.sceneLabels[kind]} — ${sceneTexts[kind]}`,
  );

  const caption = `${hook} ${cta} → ${sample(c.captions)}`;

  const trilha =
    tone === "urgente" ? c.audioUrgent : c.audioNormal;

  return [
    `## ${c.headings.script} · ${duration}s · ${platform === "reels" ? "Reels" : "Shorts"}`,
    ...scenesFinal,
    "",
    `## ${c.headings.caption}`,
    `- ${caption}`,
    "",
    `## ${c.headings.audio}`,
    `- ${trilha}`,
    "",
    `## ${c.headings.editor}`,
    `- ${c.editorTip}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 4 — Sales emails                                           */
/* ------------------------------------------------------------------ */

function generateEmails(v: Record<string, string>, locale: Locale): string {
  const c = TEMPLATE_DATA[locale].content.emails;
  const banks = TEMPLATE_DATA[locale].banks;
  const recipient = v.recipient?.trim();
  const audience = v.audience?.trim() || "você";
  const company = v.company?.trim() || "sua empresa";
  const product = v.product?.trim() || "seu produto";
  const offer = v.offer?.trim();
  const deadline = v.deadline?.trim();
  const goal = v.goal || "venda";
  const tone = toneOf(v);
  const t = banks[tone];
  const cta = v.cta?.trim() || sample(t.ctas);

  const subjects = [
    fmt(c.subjectBenefit, { company, product, benefit: sample(t.benefits).toLowerCase() }),
    recipient ? fmt(c.subjectForYou, { recipient }) : fmt(c.subjectIdea, { audience }),
    t.urgency
      ? `${c.subjectLastCall}${deadline ? ` · ${deadline}` : ""}`
      : c.subjectReasons,
  ];

  const preheader = `${offer ? `${offer}. ` : ""}${sample(t.benefits)}.`;

  const body = [
    recipient ? fmt(c.hi, { recipient }) : c.hello,
    "",
    `${c.openers[goal]}${goal === "lancamento" ? fmt(c.launchBody, { product }) : fmt(c.body, { product, benefit: sample(t.benefits), reason: sample(t.reasons) })}`,
    "",
    offer ? fmt(c.offer, { offer }) : c.bonus,
    "",
    `${t.urgency ? `${t.urgency} ` : ""}${c.click}`,
    "",
    `- ${cta} →`,
    "",
    t.urgency ? `P.S.: ${t.urgency}` : c.ps,
    "",
    fmt(c.team, { company }),
  ].join("\n");

  return [
    `## ${c.headings.subjects}`,
    `- ${subjects[0]}`,
    `- ${subjects[1]}`,
    `- ${subjects[2]}`,
    "",
    `## ${c.headings.preheader}`,
    preheader,
    "",
    `## ${c.headings.body}`,
    body,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Registry (localized per locale)                                     */
/* ------------------------------------------------------------------ */

const TEMPLATE_IDS: { id: string; path: string; icon: LucideIcon; generate: CopyTemplate["generate"] }[] = [
  { id: "meta-ads", path: "~/templates/meta-ads.ts", icon: Megaphone, generate: generateMetaAds },
  { id: "legendas", path: "~/templates/legendas.ts", icon: Captions, generate: generateLegendas },
  { id: "roteiros", path: "~/templates/roteiros.ts", icon: Video, generate: generateRoteiros },
  { id: "emails", path: "~/templates/emails.ts", icon: Mail, generate: generateEmails },
];

const cache = new Map<Locale, CopyTemplate[]>();

/** Build the localized template list for a locale (memoized). */
export function getTemplates(locale: Locale): CopyTemplate[] {
  let list = cache.get(locale);
  if (!list) {
    const data = TEMPLATE_DATA[locale];
    list = TEMPLATE_IDS.map(({ id, path, icon, generate }) => {
      const meta = data.meta[id];
      return {
        id,
        name: meta.name,
        description: meta.description,
        path,
        tags: meta.tags,
        icon,
        fields: meta.fields,
        generate,
      };
    });
    cache.set(locale, list);
  }
  return list;
}

export function getTemplate(locale: Locale, id: string): CopyTemplate {
  return getTemplates(locale).find((t) => t.id === id) ?? getTemplates(locale)[0];
}

export function makeCopyTitle(template: CopyTemplate, values: Record<string, string>): string {
  const subject = values.product?.trim() || values.topic?.trim() || "";
  return [template.name, subject].filter(Boolean).join(" — ").slice(0, 80);
}
