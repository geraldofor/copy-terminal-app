import { Captions, Mail, Megaphone, Video, type LucideIcon } from "lucide-react";

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

export interface CopyTemplate {
  id: string;
  name: string;
  description: string;
  path: string; // fake file path shown in the sidebar
  tags: string[];
  icon: LucideIcon;
  fields: FieldDef[];
  generate: (values: Record<string, string>) => string;
}

export const TONE_OPTIONS: FieldOption[] = [
  { value: "profissional", label: "Profissional" },
  { value: "divertido", label: "Divertido" },
  { value: "persuasivo", label: "Persuasivo" },
  { value: "urgente", label: "Urgente" },
];

export const TONE_LABELS: Record<Tone, string> = {
  profissional: "profissional",
  divertido: "divertido",
  persuasivo: "persuasivo",
  urgente: "urgente",
};

/* ------------------------------------------------------------------ */
/* Tone banks                                                          */
/* ------------------------------------------------------------------ */

interface ToneBank {
  benefits: string[];
  pains: string[];
  ctas: string[];
  reasons: string[];
  urgency: string;
}

const TONE: Record<Tone, ToneBank> = {
  profissional: {
    benefits: [
      "entrega resultados consistentes",
      "simplifica o processo do início ao fim",
      "transforma esforço em resultado mensurável",
    ],
    pains: ["perda de tempo", "resultados inconsistentes", "retrabalho constante"],
    ctas: ["Comece hoje", "Solicite uma demonstração", "Fale com nosso time"],
    reasons: [
      "É o padrão de quem já mede resultado.",
      "Processo claro, sem surpresas.",
    ],
    urgency: "",
  },
  divertido: {
    benefits: [
      "deixa tudo mais fácil (e mais leve)",
      "resolve na brincadeira o que ninguém resolveu",
      "é simples assim, juro",
    ],
    pains: ["perder tempo à toa", "aquela dor de cabeça desnecessária", "tanto mimimi"],
    ctas: ["Bora testar?", "Clica aí, vai", "Vem com a gente"],
    reasons: ["Sem enrolação: funciona mesmo.", "O bom é que é bom mesmo."],
    urgency: "",
  },
  persuasivo: {
    benefits: [
      "é a escolha certa para quem não aceita menos",
      "entrega exatamente o que você precisa",
      "é o diferencial que faltava",
    ],
    pains: ["oportunidades desperdiçadas", "continuar no mesmo lugar", "deixar dinheiro na mesa"],
    ctas: ["Garanta o seu agora", "Aproveite esta oportunidade", "Decida certo hoje"],
    reasons: [
      "Não é promessa: é o que acontece com quem testa.",
      "Cada dia esperando é resultado adiado.",
    ],
    urgency: "",
  },
  urgente: {
    benefits: [
      "resolve agora, com resultado rápido",
      "atende na hora, sem enrolação",
      "entrega imediata, com oferta limitada",
    ],
    pains: ["esperar mais um dia", "deixar a oferta passar", "ficar para trás"],
    ctas: ["Últimas unidades — garanta hoje", "Não deixe para depois", "Comece agora mesmo"],
    reasons: ["Enquanto você lê, a oferta avança.", "O tempo é o único recurso que não volta."],
    urgency: "Oferta válida apenas por tempo limitado.",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Random pick — used so "Reescrever" produces fresh variations. */
function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function toneOf(values: Record<string, string>): Tone {
  const tone = values.tone as Tone | undefined;
  return tone && tone in TONE ? tone : "persuasivo";
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

const GOAL_PHRASES: Record<string, string> = {
  vendas: "converter interesse em vendas",
  leads: "gerar leads qualificados",
  cliques: "atrair cliques de qualidade",
  alcance: "ampliar o alcance da marca",
  mensagens: "iniciar conversas que vendem",
};

const PLATFORM_LABELS: Record<string, string> = {
  meta: "Meta Ads (Facebook/Instagram)",
  google: "Google Ads",
  ambos: "Meta Ads + Google Ads",
};

function generateMetaAds(v: Record<string, string>): string {
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const tone = toneOf(v);
  const t = TONE[tone];
  const goalPhrase = GOAL_PHRASES[v.goal] ?? GOAL_PHRASES.vendas;
  const platform = v.platform || "meta";
  const diff = v.differentiator?.trim();
  const cta = v.cta?.trim() || sample(t.ctas);

  const body = `Para ${audience}, ${product} é a forma mais direta de ${goalPhrase}. ${
    diff ? `E tem mais: ${diff}. ` : ""
  }${sample(t.reasons)} ${
    t.urgency ? `${t.urgency} ` : ""
  }Teste agora e veja o resultado na prática.`;

  const tip =
    platform === "google"
      ? "Combine este texto com palavras-chave de alta intenção e um link direto para a página de conversão."
      : "Destaque o produto nos 3 primeiros segundos do criativo e use formato 4:5 para mobile.";

  return [
    "## ESTRATÉGIA",
    `- Objetivo: ${goalPhrase}`,
    `- Público: ${audience}`,
    `- Tom: ${TONE_LABELS[tone]}`,
    `- Formato: ${PLATFORM_LABELS[platform]}`,
    "",
    "## 3 TÍTULOS PARA TESTAR (A/B/C)",
    `- ${product}: ${sample(t.benefits)}`,
    `- Para ${audience} que querem ${goalPhrase}`,
    `- Chega de ${sample(t.pains)} — ${product} resolve`,
    "",
    "## TEXTO PRINCIPAL",
    body,
    "",
    "## CHAMADA PARA AÇÃO",
    `- ${cta} →`,
    "",
    "## DICA RÁPIDA",
    `- ${tip}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 2 — Captions IG/TikTok                                     */
/* ------------------------------------------------------------------ */

const CAPTION_GOALS: Record<string, string> = {
  engajamento: "engajar e gerar comentários",
  vendas: "vender sem parecer vendedor",
  seguidores: "atrair seguidores qualificados",
};

function generateLegendas(v: Record<string, string>): string {
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const topic = v.topic?.trim() || "este assunto";
  const tone = toneOf(v);
  const t = TONE[tone];
  const goalPhrase = CAPTION_GOALS[v.goal] ?? CAPTION_GOALS.engajamento;
  const emojis = v.emojis === "sim";
  const emo = (s: string) => (emojis ? s : "");

  const hook = sample([
    `Ninguém te contou, mas ${topic} mudou de nível.`,
    `Se você é ${audience}, precisa ver isso.`,
    `O detalhe sobre ${topic} que quase ninguém mostra.`,
  ]);
  const cta = v.cta?.trim() || sample(t.ctas);

  const words = slugifyWords(topic, 3);
  const base = [
    "dica",
    "conteudo",
    "marketingdigital",
    "criatividade",
    "viral",
    "crescimento",
    "estrategia",
    "insights",
    "conteudocriativo",
    "foryou",
    "reels",
    "tiktok",
  ];
  const tags = [...words.map((w) => `#${w}`), ...base.map((b) => `#${b}`)].slice(0, 15);

  return [
    "## GANCHO",
    hook,
    "",
    "## CORPO",
    `${product} chegou para ${goalPhrase}. ${sample(t.reasons)}`,
    `Pensa: ${sample(t.benefits)} — sem complicação e sem enrolação. ${emo("✨")}`,
    "",
    "## CHAMADA PARA AÇÃO",
    `- ${cta} ${emo("🚀")}`,
    "",
    "## HASHTAGS",
    `- ${tags.join(" ")}`,
    "",
    "## DICAS DE PUBLICAÇÃO",
    "- Publique no horário de pico do seu público e responda os comentários da primeira hora.",
    "- Use trending sounds e salve o vídeo para testar no dia seguinte.",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 3 — Reels/Shorts scripts                                   */
/* ------------------------------------------------------------------ */

const SCENE_LAYOUTS: Record<string, [string, string, string][]> = {
  "15": [
    ["0:00–0:04", "GANCHO", "hook"],
    ["0:04–0:12", "DESENVOLVIMENTO", "dev"],
    ["0:12–0:15", "CTA", "cta"],
  ],
  "30": [
    ["0:00–0:04", "GANCHO", "hook"],
    ["0:04–0:14", "DOR → SOLUÇÃO", "dev"],
    ["0:14–0:24", "CLÍMAX", "climax"],
    ["0:24–0:30", "CTA", "cta"],
  ],
  "60": [
    ["0:00–0:06", "GANCHO", "hook"],
    ["0:06–0:20", "CONTEXTO", "context"],
    ["0:20–0:40", "SOLUÇÃO", "solve"],
    ["0:40–0:52", "OBJEÇÃO", "objection"],
    ["0:52–1:00", "CTA", "cta"],
  ],
};

function generateRoteiros(v: Record<string, string>): string {
  const audience = v.audience?.trim() || "seu público";
  const product = v.product?.trim() || "seu produto";
  const topic = v.topic?.trim() || "este assunto";
  const duration = v.duration || "30";
  const platform = v.platform || "reels";
  const tone = toneOf(v);
  const t = TONE[tone];
  const goalPhrase = CAPTION_GOALS[v.goal] ?? CAPTION_GOALS.engajamento;
  const diff = v.differentiator?.trim();
  const cta = v.cta?.trim() || sample(t.ctas);

  const hook = sample([
    `Pare de rolar: ${topic} resolve isso em segundos.`,
    `Se você é ${audience}, esse vídeo é seu.`,
    `${topic} — do jeito que ninguém te contou.`,
  ]);
  const dev = `${product} faz ${goalPhrase}. ${sample(t.benefits)}.`;
  const climax = diff ? `O detalhe que muda tudo: ${diff}.` : "Resultado real, na prática.";
  const context = `O problema de quem é ${audience}: ${sample(t.pains)}.`;
  const objection = diff
    ? `Sim, e ainda tem mais: ${diff}.`
    : "Funciona para quem não tem tempo e quer resultado.";

  const scenes = (SCENE_LAYOUTS[duration] ?? SCENE_LAYOUTS["30"]).map(
    ([range, label, kind]) => {
      const text = { hook, dev, climax, context, objection, cta: `${cta} →` }[kind];
      return `[CENA · ${range}] ${label} — ${text}`;
    },
  );

  const caption = `${hook} ${cta} → ${sample([
    "Salva pra ver depois!",
    'Comenta "EU QUERO" pra receber o link.',
    "Compartilha com quem precisa disso.",
  ])}`;

  const trilha =
    tone === "urgente"
      ? "Ritmo acelerado, cortes rápidos e som de trending com BPM alto."
      : "Trilha leve e crescente; comece no silêncio na primeira cena.";

  return [
    `## ROTEIRO · ${duration}s · ${platform === "reels" ? "Reels" : "Shorts"}`,
    ...scenes,
    "",
    "## LEGENDA SUGERIDA",
    `- ${caption}`,
    "",
    "## TRILHA / ÁUDIO",
    `- ${trilha}`,
    "",
    "## PARA O EDITOR",
    "- Legendas automáticas ativadas, texto centralizado e marca visível nos últimos 3 segundos.",
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Template 4 — Sales emails                                           */
/* ------------------------------------------------------------------ */

const EMAIL_OPENERS: Record<string, string> = {
  venda: "Quero ser direto com você: ",
  lancamento: "Estamos lançando oficialmente o ",
  reengajamento: "Faz tempo que não nos falamos — e tenho uma novidade boa: ",
};

function generateEmails(v: Record<string, string>): string {
  const recipient = v.recipient?.trim();
  const audience = v.audience?.trim() || "você";
  const company = v.company?.trim() || "sua empresa";
  const product = v.product?.trim() || "seu produto";
  const offer = v.offer?.trim();
  const deadline = v.deadline?.trim();
  const goal = v.goal || "venda";
  const tone = toneOf(v);
  const t = TONE[tone];
  const cta = v.cta?.trim() || sample(t.ctas);

  const subjects = [
    `[${company}] ${product} — ${sample(t.benefits).toLowerCase()}`,
    recipient ? `${recipient}, ficou algo para você.` : `Uma ideia para ${audience}.`,
    t.urgency
      ? `Última chamada${deadline ? ` · ${deadline}` : ""}`
      : "3 motivos para abrir este e-mail",
  ];

  const preheader = `${offer ? `${offer}. ` : ""}${sample(t.benefits)}.`;

  const body = [
    recipient ? `Oi, ${recipient}!` : "Olá!",
    "",
    `${EMAIL_OPENERS[goal]}${goal === "lancamento" ? `${product}, e quero que você seja dos primeiros.` : `${product} ${sample(t.benefits)}. ${sample(t.reasons)}`}`,
    "",
    offer ? `E tem mais: ${offer}.` : "Nesta edição, incluímos um bônus exclusivo para quem chegar primeiro.",
    "",
    `${t.urgency ? `${t.urgency} ` : ""}É só clicar no botão abaixo.`,
    "",
    `- ${cta} →`,
    "",
    t.urgency ? `P.S.: ${t.urgency}` : "P.S.: Quer testar antes? Responda este e-mail que eu te ajudo.",
    "",
    `Equipe ${company}`,
  ].join("\n");

  return [
    "## 3 ASSUNTOS PARA TESTAR",
    `- ${subjects[0]}`,
    `- ${subjects[1]}`,
    `- ${subjects[2]}`,
    "",
    "## PRÉ-HEADER",
    preheader,
    "",
    "## CORPO DO E-MAIL",
    body,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const TEMPLATES: CopyTemplate[] = [
  {
    id: "meta-ads",
    name: "Anúncios Meta / Google",
    description: "Headlines, textos e CTAs para campanhas que convertem.",
    path: "~/templates/meta-ads.ts",
    tags: ["Meta Ads", "Google Ads", "Conversão"],
    icon: Megaphone,
    fields: [
      {
        key: "platform",
        label: "plataforma",
        type: "select",
        options: [
          { value: "meta", label: "Meta Ads (Facebook/Instagram)" },
          { value: "google", label: "Google Ads" },
          { value: "ambos", label: "Ambos" },
        ],
        defaultValue: "meta",
      },
      {
        key: "audience",
        label: "público-alvo",
        type: "textarea",
        placeholder: "Ex.: donas de casa, 30–50 anos, que querem praticidade na cozinha",
        required: true,
      },
      {
        key: "product",
        label: "produto / serviço",
        type: "input",
        placeholder: "Ex.: panela elétrica multifuncional",
        required: true,
      },
      {
        key: "differentiator",
        label: "diferencial (opcional)",
        type: "input",
        placeholder: "Ex.: entrega em 24h e 3 anos de garantia",
      },
      { key: "tone", label: "tom de voz", type: "select", options: TONE_OPTIONS, defaultValue: "persuasivo" },
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "vendas", label: "Vendas" },
          { value: "leads", label: "Leads" },
          { value: "cliques", label: "Cliques" },
          { value: "alcance", label: "Alcance" },
          { value: "mensagens", label: "Mensagens" },
        ],
        defaultValue: "vendas",
      },
      {
        key: "cta",
        label: "chamada para ação (opcional)",
        type: "input",
        placeholder: "Ex.: Comprar agora",
      },
    ],
    generate: generateMetaAds,
  },
  {
    id: "legendas",
    name: "Legendas IG / TikTok",
    description: "Ganchos, corpo e hashtags para posts que engajam.",
    path: "~/templates/legendas.ts",
    tags: ["Instagram", "TikTok", "Engajamento"],
    icon: Captions,
    fields: [
      {
        key: "platform",
        label: "plataforma",
        type: "select",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "tiktok", label: "TikTok" },
          { value: "ambos", label: "Ambos" },
        ],
        defaultValue: "instagram",
      },
      {
        key: "audience",
        label: "público-alvo",
        type: "textarea",
        placeholder: "Ex.: microempreendedoras que usam Instagram para vender",
        required: true,
      },
      {
        key: "topic",
        label: "tema do post",
        type: "input",
        placeholder: "Ex.: 3 erros de postagem que afastam clientes",
        required: true,
      },
      {
        key: "product",
        label: "produto / serviço",
        type: "input",
        placeholder: "Ex.: mentoria de marketing digital",
        required: true,
      },
      { key: "tone", label: "tom de voz", type: "select", options: TONE_OPTIONS, defaultValue: "divertido" },
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "engajamento", label: "Engajamento" },
          { value: "vendas", label: "Vendas" },
          { value: "seguidores", label: "Seguidores" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "emojis",
        label: "usar emojis",
        type: "select",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
        defaultValue: "sim",
      },
      {
        key: "cta",
        label: "chamada para ação (opcional)",
        type: "input",
        placeholder: "Ex.: Salva esse post!",
      },
    ],
    generate: generateLegendas,
  },
  {
    id: "roteiros",
    name: "Roteiros Reels / Shorts",
    description: "Scripts cena a cena, com legenda e trilha sugeridas.",
    path: "~/templates/roteiros.ts",
    tags: ["Reels", "Shorts", "Vídeo"],
    icon: Video,
    fields: [
      {
        key: "platform",
        label: "plataforma",
        type: "select",
        options: [
          { value: "reels", label: "Instagram Reels" },
          { value: "shorts", label: "YouTube Shorts" },
        ],
        defaultValue: "reels",
      },
      {
        key: "duration",
        label: "duração",
        type: "select",
        options: [
          { value: "15", label: "15 segundos" },
          { value: "30", label: "30 segundos" },
          { value: "60", label: "60 segundos" },
        ],
        defaultValue: "30",
      },
      {
        key: "audience",
        label: "público-alvo",
        type: "textarea",
        placeholder: "Ex.: profissionais de RH que buscam conteúdo rápido",
        required: true,
      },
      {
        key: "topic",
        label: "tema do vídeo",
        type: "input",
        placeholder: "Ex.: como montar um funil de vendas em 2026",
        required: true,
      },
      {
        key: "product",
        label: "produto / serviço",
        type: "input",
        placeholder: "Ex.: curso de funis de vendas",
        required: true,
      },
      {
        key: "differentiator",
        label: "diferencial (opcional)",
        type: "input",
        placeholder: "Ex.: bônus: 10 templates prontos",
      },
      { key: "tone", label: "tom de voz", type: "select", options: TONE_OPTIONS, defaultValue: "persuasivo" },
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "engajamento", label: "Engajamento" },
          { value: "vendas", label: "Vendas" },
          { value: "seguidores", label: "Seguidores" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "cta",
        label: "chamada para ação (opcional)",
        type: "input",
        placeholder: "Ex.: Segue pra não perder o próximo",
      },
    ],
    generate: generateRoteiros,
  },
  {
    id: "emails",
    name: "E-mails de Vendas",
    description: "Assuntos, pré-header e corpo para campanhas de e-mail.",
    path: "~/templates/emails.ts",
    tags: ["E-mail", "Vendas", "Copy"],
    icon: Mail,
    fields: [
      {
        key: "recipient",
        label: "nome do contato (opcional)",
        type: "input",
        placeholder: "Ex.: Marina",
      },
      {
        key: "audience",
        label: "público-alvo",
        type: "textarea",
        placeholder: "Ex.: leads que baixaram o ebook gratuito",
        required: true,
      },
      {
        key: "company",
        label: "nome da empresa",
        type: "input",
        placeholder: "Ex.: Agência Norte",
        required: true,
      },
      {
        key: "product",
        label: "produto / serviço",
        type: "input",
        placeholder: "Ex.: consultoria de posicionamento",
        required: true,
      },
      {
        key: "offer",
        label: "oferta / bônus (opcional)",
        type: "input",
        placeholder: "Ex.: 20% off para os 50 primeiros",
      },
      {
        key: "deadline",
        label: "prazo (opcional)",
        type: "input",
        placeholder: "Ex.: até sexta-feira",
      },
      { key: "tone", label: "tom de voz", type: "select", options: TONE_OPTIONS, defaultValue: "persuasivo" },
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "venda", label: "Fechar venda" },
          { value: "lancamento", label: "Lançamento" },
          { value: "reengajamento", label: "Reengajamento" },
        ],
        defaultValue: "venda",
      },
      {
        key: "cta",
        label: "chamada para ação (opcional)",
        type: "input",
        placeholder: "Ex.: Agendar uma call",
      },
    ],
    generate: generateEmails,
  },
];

export function getTemplate(id: string): CopyTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function makeCopyTitle(template: CopyTemplate, values: Record<string, string>): string {
  const subject = values.product?.trim() || values.topic?.trim() || "";
  return [template.name, subject].filter(Boolean).join(" — ").slice(0, 80);
}
