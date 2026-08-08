/* ------------------------------------------------------------------ */
/* Localized content for the copy templates (pt / en / es)             */
/* ------------------------------------------------------------------ */
import type {
  FieldDef,
  FieldOption,
  Tone,
  ToneBank,
} from "@/lib/copy-templates";
import type { Locale } from "./strings";

/* ------------------------------------------------------------------ */
/* Tone banks                                                          */
/* ------------------------------------------------------------------ */

const PT_BANKS: Record<Tone, ToneBank> = {
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

const EN_BANKS: Record<Tone, ToneBank> = {
  profissional: {
    benefits: [
      "delivers consistent results",
      "simplifies the process from start to finish",
      "turns effort into measurable results",
    ],
    pains: ["wasted time", "inconsistent results", "constant rework"],
    ctas: ["Start today", "Request a demo", "Talk to our team"],
    reasons: [
      "It's the standard for those who already measure results.",
      "A clear process, no surprises.",
    ],
    urgency: "",
  },
  divertido: {
    benefits: [
      "makes everything easier (and lighter)",
      "solves what no one else has, no sweat",
      "is that simple, I promise",
    ],
    pains: ["wasting time for nothing", "that unnecessary headache", "so much drama"],
    ctas: ["Ready to try?", "Go on, click it", "Come with us"],
    reasons: ["No fluff: it just works.", "The best part is it actually works."],
    urgency: "",
  },
  persuasivo: {
    benefits: [
      "is the right choice for those who settle for nothing less",
      "delivers exactly what you need",
      "is the edge you were missing",
    ],
    pains: ["wasted opportunities", "staying in the same place", "leaving money on the table"],
    ctas: ["Secure yours now", "Seize this opportunity", "Make the right call today"],
    reasons: [
      "It's not a promise: it's what happens to those who try.",
      "Every day you wait is a delayed result.",
    ],
    urgency: "",
  },
  urgente: {
    benefits: [
      "solves it now, with fast results",
      "handles it right away, no delay",
      "immediate delivery, limited offer",
    ],
    pains: ["waiting one more day", "letting the offer slip away", "falling behind"],
    ctas: ["Last units — secure yours today", "Don't put it off", "Start right now"],
    reasons: ["While you read this, the offer moves on.", "Time is the only resource you can't get back."],
    urgency: "Offer valid for a limited time only.",
  },
};

const ES_BANKS: Record<Tone, ToneBank> = {
  profissional: {
    benefits: [
      "entrega resultados consistentes",
      "simplifica el proceso de principio a fin",
      "convierte el esfuerzo en resultados medibles",
    ],
    pains: ["pérdida de tiempo", "resultados inconsistentes", "retrabajo constante"],
    ctas: ["Empieza hoy", "Solicita una demostración", "Habla con nuestro equipo"],
    reasons: [
      "Es el estándar de quienes ya miden resultados.",
      "Proceso claro, sin sorpresas.",
    ],
    urgency: "",
  },
  divertido: {
    benefits: [
      "lo hace todo más fácil (y más ligero)",
      "resuelve en broma lo que nadie resolvió",
      "es así de simple, lo juro",
    ],
    pains: ["perder el tiempo sin razón", "ese dolor de cabeza innecesario", "tanto drama"],
    ctas: ["¿Listo para probar?", "Dale clic, vamos", "Ven con nosotros"],
    reasons: ["Sin vueltas: funciona de verdad.", "Lo bueno es que funciona de verdad."],
    urgency: "",
  },
  persuasivo: {
    benefits: [
      "es la elección correcta para quien no acepta menos",
      "entrega exactamente lo que necesitas",
      "es el diferencial que faltaba",
    ],
    pains: ["oportunidades desperdiciadas", "seguir en el mismo lugar", "dejar dinero sobre la mesa"],
    ctas: ["Asegura el tuyo ahora", "Aprovecha esta oportunidad", "Decide bien hoy"],
    reasons: [
      "No es una promesa: es lo que ocurre con quien lo prueba.",
      "Cada día de espera es un resultado retrasado.",
    ],
    urgency: "",
  },
  urgente: {
    benefits: [
      "resuelve ya, con resultados rápidos",
      "atiende al momento, sin vueltas",
      "entrega inmediata, con oferta limitada",
    ],
    pains: ["esperar un día más", "dejar pasar la oferta", "quedarse atrás"],
    ctas: ["Últimas unidades — asegúralas hoy", "No lo dejes para después", "Empieza ahora mismo"],
    reasons: ["Mientras lees, la oferta avanza.", "El tiempo es el único recurso que no vuelve."],
    urgency: "Oferta válida solo por tiempo limitado.",
  },
};

/* ------------------------------------------------------------------ */
/* Tone labels + options (display)                                     */
/* ------------------------------------------------------------------ */

const PT_TONE_LABELS: Record<Tone, string> = {
  profissional: "profissional",
  divertido: "divertido",
  persuasivo: "persuasivo",
  urgente: "urgente",
};
const EN_TONE_LABELS: Record<Tone, string> = {
  profissional: "professional",
  divertido: "fun",
  persuasivo: "persuasive",
  urgente: "urgent",
};
const ES_TONE_LABELS: Record<Tone, string> = {
  profissional: "profesional",
  divertido: "divertido",
  persuasivo: "persuasivo",
  urgente: "urgente",
};

const PT_TONE_OPTIONS: FieldOption[] = [
  { value: "profissional", label: "Profissional" },
  { value: "divertido", label: "Divertido" },
  { value: "persuasivo", label: "Persuasivo" },
  { value: "urgente", label: "Urgente" },
];
const EN_TONE_OPTIONS: FieldOption[] = [
  { value: "profissional", label: "Professional" },
  { value: "divertido", label: "Fun" },
  { value: "persuasivo", label: "Persuasive" },
  { value: "urgente", label: "Urgent" },
];
const ES_TONE_OPTIONS: FieldOption[] = [
  { value: "profissional", label: "Profesional" },
  { value: "divertido", label: "Divertido" },
  { value: "persuasivo", label: "Persuasivo" },
  { value: "urgente", label: "Urgente" },
];

/* ------------------------------------------------------------------ */
/* Template metadata (localized names, descriptions, tags, fields)     */
/* ------------------------------------------------------------------ */

interface TemplateMeta {
  name: string;
  description: string;
  tags: string[];
  fields: FieldDef[];
}

const toneField = (options: FieldOption[], defaultValue: Tone): FieldDef => ({
  key: "tone",
  label: "tom de voz",
  type: "select",
  options,
  defaultValue,
});

const PT_META: Record<string, TemplateMeta> = {
  "meta-ads": {
    name: "Anúncios Meta / Google",
    description: "Headlines, textos e CTAs para campanhas que convertem.",
    tags: ["Meta Ads", "Google Ads", "Conversão"],
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
      toneField(PT_TONE_OPTIONS, "persuasivo"),
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
  },
  legendas: {
    name: "Legendas IG / TikTok",
    description: "Ganchos, corpo e hashtags para posts que engajam.",
    tags: ["Instagram", "TikTok", "Engajamento"],
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
      toneField(PT_TONE_OPTIONS, "divertido"),
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
  },
  roteiros: {
    name: "Roteiros Reels / Shorts",
    description: "Scripts cena a cena, com legenda e trilha sugeridas.",
    tags: ["Reels", "Shorts", "Vídeo"],
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
      toneField(PT_TONE_OPTIONS, "persuasivo"),
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
  },
  emails: {
    name: "E-mails de Vendas",
    description: "Assuntos, pré-header e corpo para campanhas de e-mail.",
    tags: ["E-mail", "Vendas", "Copy"],
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
      toneField(PT_TONE_OPTIONS, "persuasivo"),
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
  },
};

const EN_META: Record<string, TemplateMeta> = {
  "meta-ads": {
    name: "Meta / Google Ads",
    description: "Headlines, copy and CTAs for campaigns that convert.",
    tags: ["Meta Ads", "Google Ads", "Conversion"],
    fields: [
      {
        key: "platform",
        label: "platform",
        type: "select",
        options: [
          { value: "meta", label: "Meta Ads (Facebook/Instagram)" },
          { value: "google", label: "Google Ads" },
          { value: "ambos", label: "Both" },
        ],
        defaultValue: "meta",
      },
      {
        key: "audience",
        label: "target audience",
        type: "textarea",
        placeholder: "E.g.: busy parents, 30–50, who want convenience in the kitchen",
        required: true,
      },
      {
        key: "product",
        label: "product / service",
        type: "input",
        placeholder: "E.g.: multi-function electric cooker",
        required: true,
      },
      {
        key: "differentiator",
        label: "differentiator (optional)",
        type: "input",
        placeholder: "E.g.: 24h delivery and 3-year warranty",
      },
      toneField(EN_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "goal",
        type: "select",
        options: [
          { value: "vendas", label: "Sales" },
          { value: "leads", label: "Leads" },
          { value: "cliques", label: "Clicks" },
          { value: "alcance", label: "Reach" },
          { value: "mensagens", label: "Messages" },
        ],
        defaultValue: "vendas",
      },
      {
        key: "cta",
        label: "call to action (optional)",
        type: "input",
        placeholder: "E.g.: Buy now",
      },
    ],
  },
  legendas: {
    name: "IG / TikTok Captions",
    description: "Hooks, body and hashtags for posts that engage.",
    tags: ["Instagram", "TikTok", "Engagement"],
    fields: [
      {
        key: "platform",
        label: "platform",
        type: "select",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "tiktok", label: "TikTok" },
          { value: "ambos", label: "Both" },
        ],
        defaultValue: "instagram",
      },
      {
        key: "audience",
        label: "target audience",
        type: "textarea",
        placeholder: "E.g.: micro-entrepreneurs who sell on Instagram",
        required: true,
      },
      {
        key: "topic",
        label: "post topic",
        type: "input",
        placeholder: "E.g.: 3 posting mistakes that push customers away",
        required: true,
      },
      {
        key: "product",
        label: "product / service",
        type: "input",
        placeholder: "E.g.: digital marketing mentorship",
        required: true,
      },
      toneField(EN_TONE_OPTIONS, "divertido"),
      {
        key: "goal",
        label: "goal",
        type: "select",
        options: [
          { value: "engajamento", label: "Engagement" },
          { value: "vendas", label: "Sales" },
          { value: "seguidores", label: "Followers" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "emojis",
        label: "use emojis",
        type: "select",
        options: [
          { value: "sim", label: "Yes" },
          { value: "nao", label: "No" },
        ],
        defaultValue: "sim",
      },
      {
        key: "cta",
        label: "call to action (optional)",
        type: "input",
        placeholder: "E.g.: Save this post!",
      },
    ],
  },
  roteiros: {
    name: "Reels / Shorts Scripts",
    description: "Scene-by-scene scripts with suggested captions and audio.",
    tags: ["Reels", "Shorts", "Video"],
    fields: [
      {
        key: "platform",
        label: "platform",
        type: "select",
        options: [
          { value: "reels", label: "Instagram Reels" },
          { value: "shorts", label: "YouTube Shorts" },
        ],
        defaultValue: "reels",
      },
      {
        key: "duration",
        label: "duration",
        type: "select",
        options: [
          { value: "15", label: "15 seconds" },
          { value: "30", label: "30 seconds" },
          { value: "60", label: "60 seconds" },
        ],
        defaultValue: "30",
      },
      {
        key: "audience",
        label: "target audience",
        type: "textarea",
        placeholder: "E.g.: HR professionals looking for quick content",
        required: true,
      },
      {
        key: "topic",
        label: "video topic",
        type: "input",
        placeholder: "E.g.: how to build a sales funnel in 2026",
        required: true,
      },
      {
        key: "product",
        label: "product / service",
        type: "input",
        placeholder: "E.g.: sales funnel course",
        required: true,
      },
      {
        key: "differentiator",
        label: "differentiator (optional)",
        type: "input",
        placeholder: "E.g.: bonus: 10 ready-made templates",
      },
      toneField(EN_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "goal",
        type: "select",
        options: [
          { value: "engajamento", label: "Engagement" },
          { value: "vendas", label: "Sales" },
          { value: "seguidores", label: "Followers" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "cta",
        label: "call to action (optional)",
        type: "input",
        placeholder: "E.g.: Follow so you don't miss the next one",
      },
    ],
  },
  emails: {
    name: "Sales Emails",
    description: "Subject lines, preheaders and body for email campaigns.",
    tags: ["Email", "Sales", "Copy"],
    fields: [
      {
        key: "recipient",
        label: "contact name (optional)",
        type: "input",
        placeholder: "E.g.: Marina",
      },
      {
        key: "audience",
        label: "target audience",
        type: "textarea",
        placeholder: "E.g.: leads who downloaded the free ebook",
        required: true,
      },
      {
        key: "company",
        label: "company name",
        type: "input",
        placeholder: "E.g.: North Agency",
        required: true,
      },
      {
        key: "product",
        label: "product / service",
        type: "input",
        placeholder: "E.g.: positioning consultancy",
        required: true,
      },
      {
        key: "offer",
        label: "offer / bonus (optional)",
        type: "input",
        placeholder: "E.g.: 20% off for the first 50",
      },
      {
        key: "deadline",
        label: "deadline (optional)",
        type: "input",
        placeholder: "E.g.: by Friday",
      },
      toneField(EN_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "goal",
        type: "select",
        options: [
          { value: "venda", label: "Close a sale" },
          { value: "lancamento", label: "Launch" },
          { value: "reengajamento", label: "Re-engagement" },
        ],
        defaultValue: "venda",
      },
      {
        key: "cta",
        label: "call to action (optional)",
        type: "input",
        placeholder: "E.g.: Schedule a call",
      },
    ],
  },
};

const ES_META: Record<string, TemplateMeta> = {
  "meta-ads": {
    name: "Anuncios Meta / Google",
    description: "Títulos, textos y CTAs para campañas que convierten.",
    tags: ["Meta Ads", "Google Ads", "Conversión"],
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
        label: "público objetivo",
        type: "textarea",
        placeholder: "Ej.: amas de casa, 30–50 años, que quieren practicidad en la cocina",
        required: true,
      },
      {
        key: "product",
        label: "producto / servicio",
        type: "input",
        placeholder: "Ej.: olla eléctrica multifuncional",
        required: true,
      },
      {
        key: "differentiator",
        label: "diferencial (opcional)",
        type: "input",
        placeholder: "Ej.: entrega en 24h y 3 años de garantía",
      },
      toneField(ES_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "vendas", label: "Ventas" },
          { value: "leads", label: "Leads" },
          { value: "cliques", label: "Clics" },
          { value: "alcance", label: "Alcance" },
          { value: "mensagens", label: "Mensajes" },
        ],
        defaultValue: "vendas",
      },
      {
        key: "cta",
        label: "llamada a la acción (opcional)",
        type: "input",
        placeholder: "Ej.: Comprar ahora",
      },
    ],
  },
  legendas: {
    name: "Leyendas IG / TikTok",
    description: "Ganchos, cuerpo y hashtags para posts que enganchan.",
    tags: ["Instagram", "TikTok", "Engagement"],
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
        label: "público objetivo",
        type: "textarea",
        placeholder: "Ej.: microemprendedoras que usan Instagram para vender",
        required: true,
      },
      {
        key: "topic",
        label: "tema del post",
        type: "input",
        placeholder: "Ej.: 3 errores de publicación que alejan clientes",
        required: true,
      },
      {
        key: "product",
        label: "producto / servicio",
        type: "input",
        placeholder: "Ej.: mentoría de marketing digital",
        required: true,
      },
      toneField(ES_TONE_OPTIONS, "divertido"),
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "engajamento", label: "Engagement" },
          { value: "vendas", label: "Ventas" },
          { value: "seguidores", label: "Seguidores" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "emojis",
        label: "usar emojis",
        type: "select",
        options: [
          { value: "sim", label: "Sí" },
          { value: "nao", label: "No" },
        ],
        defaultValue: "sim",
      },
      {
        key: "cta",
        label: "llamada a la acción (opcional)",
        type: "input",
        placeholder: "Ej.: ¡Guarda este post!",
      },
    ],
  },
  roteiros: {
    name: "Guiones Reels / Shorts",
    description: "Guiones escena a escena, con leyenda y pista sugeridas.",
    tags: ["Reels", "Shorts", "Vídeo"],
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
        label: "duración",
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
        label: "público objetivo",
        type: "textarea",
        placeholder: "Ej.: profesionales de RRHH que buscan contenido rápido",
        required: true,
      },
      {
        key: "topic",
        label: "tema del vídeo",
        type: "input",
        placeholder: "Ej.: cómo armar un embudo de ventas en 2026",
        required: true,
      },
      {
        key: "product",
        label: "producto / servicio",
        type: "input",
        placeholder: "Ej.: curso de embudos de ventas",
        required: true,
      },
      {
        key: "differentiator",
        label: "diferencial (opcional)",
        type: "input",
        placeholder: "Ej.: bono: 10 plantillas listas",
      },
      toneField(ES_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "engajamento", label: "Engagement" },
          { value: "vendas", label: "Ventas" },
          { value: "seguidores", label: "Seguidores" },
        ],
        defaultValue: "engajamento",
      },
      {
        key: "cta",
        label: "llamada a la acción (opcional)",
        type: "input",
        placeholder: "Ej.: Sígueme para no perderte el próximo",
      },
    ],
  },
  emails: {
    name: "Correos de Venta",
    description: "Asuntos, preheader y cuerpo para campañas de correo.",
    tags: ["Correo", "Ventas", "Copy"],
    fields: [
      {
        key: "recipient",
        label: "nombre del contacto (opcional)",
        type: "input",
        placeholder: "Ej.: Marina",
      },
      {
        key: "audience",
        label: "público objetivo",
        type: "textarea",
        placeholder: "Ej.: leads que descargaron el ebook gratuito",
        required: true,
      },
      {
        key: "company",
        label: "nombre de la empresa",
        type: "input",
        placeholder: "Ej.: Agencia Norte",
        required: true,
      },
      {
        key: "product",
        label: "producto / servicio",
        type: "input",
        placeholder: "Ej.: consultoría de posicionamiento",
        required: true,
      },
      {
        key: "offer",
        label: "oferta / bono (opcional)",
        type: "input",
        placeholder: "Ej.: 20% de descuento para los 50 primeros",
      },
      {
        key: "deadline",
        label: "plazo (opcional)",
        type: "input",
        placeholder: "Ej.: hasta el viernes",
      },
      toneField(ES_TONE_OPTIONS, "persuasivo"),
      {
        key: "goal",
        label: "objetivo",
        type: "select",
        options: [
          { value: "venda", label: "Cerrar venta" },
          { value: "lancamento", label: "Lanzamiento" },
          { value: "reengajamento", label: "Re-engagement" },
        ],
        defaultValue: "venda",
      },
      {
        key: "cta",
        label: "llamada a la acción (opcional)",
        type: "input",
        placeholder: "Ej.: Agendar una llamada",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Generator content (localized phrases used to build the copy)        */
/* ------------------------------------------------------------------ */

export interface LocaleGeneratorContent {
  metaAds: {
    goalPhrases: Record<string, string>;
    platformLabels: Record<string, string>;
    headings: {
      strategy: string;
      titles: string;
      main: string;
      cta: string;
      tip: string;
    };
    labels: { goal: string; audience: string; tone: string; format: string };
    tips: { google: string; meta: string };
    body: string; // "Para {audience}, {product} é a forma mais direta de {goal}."
    more: string; // "E tem mais: {diff}."
    outro: string; // "Teste agora e veja o resultado na prática."
    headlineAudience: string; // "Para {audience} que querem {goal}"
    headlinePain: string; // "Chega de {pain} — {product} resolve"
  };
  legendas: {
    goalPhrases: Record<string, string>;
    hooks: string[];
    headings: {
      hook: string;
      body: string;
      cta: string;
      hashtags: string;
      tips: string;
    };
    body: string; // "{product} chegou para {goal}."
    body2: string; // "Pensa: {benefit} — sem complicação e sem enrolação."
    hashtagBase: string[];
    tips: string[];
  };
  roteiros: {
    sceneLabels: Record<string, string>; // hook | dev | pain | climax | cta | context | solve | objection
    scenePrefix: string; // "CENA"
    hooks: string[];
    headings: { script: string; caption: string; audio: string; editor: string };
    dev: string; // "{product} faz {goal}. {benefit}."
    climax: string; // "O detalhe que muda tudo: {diff}."
    climaxFallback: string;
    context: string; // "O problema de quem é {audience}: {pain}."
    objection: string; // "Sim, e ainda tem mais: {diff}."
    objectionFallback: string;
    captions: string[];
    audioUrgent: string;
    audioNormal: string;
    editorTip: string;
  };
  emails: {
    openers: Record<string, string>;
    headings: { subjects: string; preheader: string; body: string };
    subjectBenefit: string; // "[{company}] {product} — {benefit}"
    subjectForYou: string; // "{recipient}, ficou algo para você."
    subjectIdea: string; // "Uma ideia para {audience}."
    subjectLastCall: string; // "Última chamada"
    subjectReasons: string; // "3 motivos para abrir este e-mail"
    hi: string; // "Oi, {recipient}!"
    hello: string;
    launchBody: string; // "{product}, e quero que você seja dos primeiros."
    body: string; // "{product} {benefit}. {reason}"
    offer: string; // "E tem mais: {offer}."
    bonus: string;
    click: string; // "É só clicar no botão abaixo."
    ps: string;
    team: string; // "Equipe {company}"
  };
}

export interface LocaleTemplateData {
  toneLabels: Record<Tone, string>;
  toneOptions: FieldOption[];
  banks: Record<Tone, ToneBank>;
  meta: Record<string, TemplateMeta>;
  content: LocaleGeneratorContent;
}

export const TEMPLATE_DATA: Record<Locale, LocaleTemplateData> = {
  pt: {
    toneLabels: PT_TONE_LABELS,
    toneOptions: PT_TONE_OPTIONS,
    banks: PT_BANKS,
    meta: PT_META,
    content: {
      metaAds: {
        goalPhrases: {
          vendas: "converter interesse em vendas",
          leads: "gerar leads qualificados",
          cliques: "atrair cliques de qualidade",
          alcance: "ampliar o alcance da marca",
          mensagens: "iniciar conversas que vendem",
        },
        platformLabels: {
          meta: "Meta Ads (Facebook/Instagram)",
          google: "Google Ads",
          ambos: "Meta Ads + Google Ads",
        },
        headings: {
          strategy: "ESTRATÉGIA",
          titles: "3 TÍTULOS PARA TESTAR (A/B/C)",
          main: "TEXTO PRINCIPAL",
          cta: "CHAMADA PARA AÇÃO",
          tip: "DICA RÁPIDA",
        },
        labels: { goal: "Objetivo", audience: "Público", tone: "Tom", format: "Formato" },
        tips: {
          google:
            "Combine este texto com palavras-chave de alta intenção e um link direto para a página de conversão.",
          meta: "Destaque o produto nos 3 primeiros segundos do criativo e use formato 4:5 para mobile.",
        },
        body: "Para {audience}, {product} é a forma mais direta de {goal}.",
        more: "E tem mais: {diff}.",
        outro: "Teste agora e veja o resultado na prática.",
        headlineAudience: "Para {audience} que querem {goal}",
        headlinePain: "Chega de {pain} — {product} resolve",
      },
      legendas: {
        goalPhrases: {
          engajamento: "engajar e gerar comentários",
          vendas: "vender sem parecer vendedor",
          seguidores: "atrair seguidores qualificados",
        },
        hooks: [
          "Ninguém te contou, mas {topic} mudou de nível.",
          "Se você é {audience}, precisa ver isso.",
          "O detalhe sobre {topic} que quase ninguém mostra.",
        ],
        headings: {
          hook: "GANCHO",
          body: "CORPO",
          cta: "CHAMADA PARA AÇÃO",
          hashtags: "HASHTAGS",
          tips: "DICAS DE PUBLICAÇÃO",
        },
        body: "{product} chegou para {goal}.",
        body2: "Pensa: {benefit} — sem complicação e sem enrolação.",
        hashtagBase: [
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
        ],
        tips: [
          "Publique no horário de pico do seu público e responda os comentários da primeira hora.",
          "Use trending sounds e salve o vídeo para testar no dia seguinte.",
        ],
      },
      roteiros: {
        sceneLabels: {
          hook: "GANCHO",
          dev: "DESENVOLVIMENTO",
          pain: "DOR → SOLUÇÃO",
          climax: "CLÍMAX",
          cta: "CTA",
          context: "CONTEXTO",
          solve: "SOLUÇÃO",
          objection: "OBJEÇÃO",
        },
        scenePrefix: "CENA",
        hooks: [
          "Pare de rolar: {topic} resolve isso em segundos.",
          "Se você é {audience}, esse vídeo é seu.",
          "{topic} — do jeito que ninguém te contou.",
        ],
        headings: {
          script: "ROTEIRO",
          caption: "LEGENDA SUGERIDA",
          audio: "TRILHA / ÁUDIO",
          editor: "PARA O EDITOR",
        },
        dev: "{product} faz {goal}. {benefit}.",
        climax: "O detalhe que muda tudo: {diff}.",
        climaxFallback: "Resultado real, na prática.",
        context: "O problema de quem é {audience}: {pain}.",
        objection: "Sim, e ainda tem mais: {diff}.",
        objectionFallback: "Funciona para quem não tem tempo e quer resultado.",
        captions: [
          "Salva pra ver depois!",
          'Comenta "EU QUERO" pra receber o link.',
          "Compartilha com quem precisa disso.",
        ],
        audioUrgent: "Ritmo acelerado, cortes rápidos e som de trending com BPM alto.",
        audioNormal: "Trilha leve e crescente; comece no silêncio na primeira cena.",
        editorTip:
          "Legendas automáticas ativadas, texto centralizado e marca visível nos últimos 3 segundos.",
      },
      emails: {
        openers: {
          venda: "Quero ser direto com você: ",
          lancamento: "Estamos lançando oficialmente o ",
          reengajamento: "Faz tempo que não nos falamos — e tenho uma novidade boa: ",
        },
        headings: {
          subjects: "3 ASSUNTOS PARA TESTAR",
          preheader: "PRÉ-HEADER",
          body: "CORPO DO E-MAIL",
        },
        subjectBenefit: "[{company}] {product} — {benefit}",
        subjectForYou: "{recipient}, ficou algo para você.",
        subjectIdea: "Uma ideia para {audience}.",
        subjectLastCall: "Última chamada",
        subjectReasons: "3 motivos para abrir este e-mail",
        hi: "Oi, {recipient}!",
        hello: "Olá!",
        launchBody: "{product}, e quero que você seja dos primeiros.",
        body: "{product} {benefit}. {reason}",
        offer: "E tem mais: {offer}.",
        bonus: "Nesta edição, incluímos um bônus exclusivo para quem chegar primeiro.",
        click: "É só clicar no botão abaixo.",
        ps: "P.S.: Quer testar antes? Responda este e-mail que eu te ajudo.",
        team: "Equipe {company}",
      },
    },
  },
  en: {
    toneLabels: EN_TONE_LABELS,
    toneOptions: EN_TONE_OPTIONS,
    banks: EN_BANKS,
    meta: EN_META,
    content: {
      metaAds: {
        goalPhrases: {
          vendas: "convert interest into sales",
          leads: "generate qualified leads",
          cliques: "attract quality clicks",
          alcance: "expand brand reach",
          mensagens: "start conversations that sell",
        },
        platformLabels: {
          meta: "Meta Ads (Facebook/Instagram)",
          google: "Google Ads",
          ambos: "Meta Ads + Google Ads",
        },
        headings: {
          strategy: "STRATEGY",
          titles: "3 HEADLINES TO TEST (A/B/C)",
          main: "MAIN TEXT",
          cta: "CALL TO ACTION",
          tip: "QUICK TIP",
        },
        labels: { goal: "Goal", audience: "Audience", tone: "Tone", format: "Format" },
        tips: {
          google:
            "Pair this copy with high-intent keywords and a direct link to your conversion page.",
          meta: "Showcase the product in the first 3 seconds of the creative and use a 4:5 format for mobile.",
        },
        body: "For {audience}, {product} is the most direct way to {goal}.",
        more: "And there's more: {diff}.",
        outro: "Try it now and see the result in practice.",
        headlineAudience: "For {audience} who want to {goal}",
        headlinePain: "Enough {pain} — {product} solves it",
      },
      legendas: {
        goalPhrases: {
          engajamento: "drive engagement and comments",
          vendas: "sell without sounding salesy",
          seguidores: "attract qualified followers",
        },
        hooks: [
          "No one told you, but {topic} just leveled up.",
          "If you're {audience}, you need to see this.",
          "The {topic} detail almost no one shows.",
        ],
        headings: {
          hook: "HOOK",
          body: "BODY",
          cta: "CALL TO ACTION",
          hashtags: "HASHTAGS",
          tips: "POSTING TIPS",
        },
        body: "{product} is here to {goal}.",
        body2: "Think about it: {benefit} — no complications, no fluff.",
        hashtagBase: [
          "tip",
          "content",
          "digitalmarketing",
          "creativity",
          "viral",
          "growth",
          "strategy",
          "insights",
          "creativecontent",
          "foryou",
          "reels",
          "tiktok",
        ],
        tips: [
          "Post during your audience's peak hours and reply to comments in the first hour.",
          "Use trending sounds and save the video to test it the next day.",
        ],
      },
      roteiros: {
        sceneLabels: {
          hook: "HOOK",
          dev: "DEVELOPMENT",
          pain: "PAIN → SOLUTION",
          climax: "CLIMAX",
          cta: "CTA",
          context: "CONTEXT",
          solve: "SOLUTION",
          objection: "OBJECTION",
        },
        scenePrefix: "SCENE",
        hooks: [
          "Stop scrolling: {topic} solves this in seconds.",
          "If you're {audience}, this video is for you.",
          "{topic} — the way no one told you.",
        ],
        headings: {
          script: "SCRIPT",
          caption: "SUGGESTED CAPTION",
          audio: "MUSIC / AUDIO",
          editor: "FOR THE EDITOR",
        },
        dev: "{product} does {goal}. {benefit}.",
        climax: "The detail that changes everything: {diff}.",
        climaxFallback: "Real results, in practice.",
        context: "The problem for {audience}: {pain}.",
        objection: "Yes, and there's even more: {diff}.",
        objectionFallback: "It works for those with no time who want results.",
        captions: [
          "Save it for later!",
          'Comment "I WANT IT" to get the link.',
          "Share it with someone who needs this.",
        ],
        audioUrgent: "Fast pacing, quick cuts and a trending sound with high BPM.",
        audioNormal: "Light, building track; start in silence on the first scene.",
        editorTip:
          "Auto captions on, centered text and the brand visible in the last 3 seconds.",
      },
      emails: {
        openers: {
          venda: "Let me be direct with you: ",
          lancamento: "We're officially launching ",
          reengajamento: "It's been a while — and I have good news: ",
        },
        headings: {
          subjects: "3 SUBJECT LINES TO TEST",
          preheader: "PREHEADER",
          body: "EMAIL BODY",
        },
        subjectBenefit: "[{company}] {product} — {benefit}",
        subjectForYou: "{recipient}, something's waiting for you.",
        subjectIdea: "An idea for {audience}.",
        subjectLastCall: "Last call",
        subjectReasons: "3 reasons to open this email",
        hi: "Hi, {recipient}!",
        hello: "Hello!",
        launchBody: "{product}, and I want you to be among the first.",
        body: "{product} {benefit}. {reason}",
        offer: "And there's more: {offer}.",
        bonus: "In this edition, we included an exclusive bonus for early arrivals.",
        click: "Just click the button below.",
        ps: "P.S.: Want to try it first? Reply to this email and I'll help you.",
        team: "The {company} team",
      },
    },
  },
  es: {
    toneLabels: ES_TONE_LABELS,
    toneOptions: ES_TONE_OPTIONS,
    banks: ES_BANKS,
    meta: ES_META,
    content: {
      metaAds: {
        goalPhrases: {
          vendas: "convertir el interés en ventas",
          leads: "generar leads calificados",
          cliques: "atraer clics de calidad",
          alcance: "ampliar el alcance de la marca",
          mensagens: "iniciar conversaciones que venden",
        },
        platformLabels: {
          meta: "Meta Ads (Facebook/Instagram)",
          google: "Google Ads",
          ambos: "Meta Ads + Google Ads",
        },
        headings: {
          strategy: "ESTRATEGIA",
          titles: "3 TÍTULOS PARA PROBAR (A/B/C)",
          main: "TEXTO PRINCIPAL",
          cta: "LLAMADA A LA ACCIÓN",
          tip: "CONSEJO RÁPIDO",
        },
        labels: { goal: "Objetivo", audience: "Público", tone: "Tono", format: "Formato" },
        tips: {
          google:
            "Combina este texto con palabras clave de alta intención y un enlace directo a la página de conversión.",
          meta: "Destaca el producto en los primeros 3 segundos del creativo y usa formato 4:5 para móvil.",
        },
        body: "Para {audience}, {product} es la forma más directa de {goal}.",
        more: "Y hay más: {diff}.",
        outro: "Pruébalo ahora y comprueba el resultado en la práctica.",
        headlineAudience: "Para {audience} que quieren {goal}",
        headlinePain: "Basta de {pain} — {product} lo resuelve",
      },
      legendas: {
        goalPhrases: {
          engajamento: "generar engagement y comentarios",
          vendas: "vender sin parecer vendedor",
          seguidores: "atraer seguidores calificados",
        },
        hooks: [
          "Nadie te contó, pero {topic} subió de nivel.",
          "Si eres {audience}, tienes que ver esto.",
          "El detalle sobre {topic} que casi nadie muestra.",
        ],
        headings: {
          hook: "GANCHO",
          body: "CUERPO",
          cta: "LLAMADA A LA ACCIÓN",
          hashtags: "HASHTAGS",
          tips: "CONSEJOS DE PUBLICACIÓN",
        },
        body: "{product} llegó para {goal}.",
        body2: "Piensa: {benefit} — sin complicaciones y sin vueltas.",
        hashtagBase: [
          "consejo",
          "contenido",
          "marketingdigital",
          "creatividad",
          "viral",
          "crecimiento",
          "estrategia",
          "insights",
          "contenidocreativo",
          "foryou",
          "reels",
          "tiktok",
        ],
        tips: [
          "Publica en la hora pico de tu audiencia y responde los comentarios de la primera hora.",
          "Usa sonidos en tendencia y guarda el vídeo para probarlo al día siguiente.",
        ],
      },
      roteiros: {
        sceneLabels: {
          hook: "GANCHO",
          dev: "DESARROLLO",
          pain: "DOLOR → SOLUCIÓN",
          climax: "CLÍMAX",
          cta: "CTA",
          context: "CONTEXTO",
          solve: "SOLUCIÓN",
          objection: "OBJECIÓN",
        },
        scenePrefix: "ESCENA",
        hooks: [
          "Deja de hacer scroll: {topic} resuelve esto en segundos.",
          "Si eres {audience}, este vídeo es tuyo.",
          "{topic} — como nadie te lo contó.",
        ],
        headings: {
          script: "GUION",
          caption: "LEYENDA SUGERIDA",
          audio: "PISTA / AUDIO",
          editor: "PARA EL EDITOR",
        },
        dev: "{product} hace {goal}. {benefit}.",
        climax: "El detalle que lo cambia todo: {diff}.",
        climaxFallback: "Resultado real, en la práctica.",
        context: "El problema de quien es {audience}: {pain}.",
        objection: "Sí, y todavía hay más: {diff}.",
        objectionFallback: "Funciona para quienes no tienen tiempo y quieren resultados.",
        captions: [
          "¡Guárdalo para después!",
          'Comenta "LO QUIERO" para recibir el enlace.',
          "Compártelo con quien lo necesite.",
        ],
        audioUrgent: "Ritmo acelerado, cortes rápidos y sonido en tendencia con BPM alto.",
        audioNormal: "Pista ligera y creciente; empieza en silencio en la primera escena.",
        editorTip:
          "Subtítulos automáticos activados, texto centrado y marca visible en los últimos 3 segundos.",
      },
      emails: {
        openers: {
          venda: "Seré directo contigo: ",
          lancamento: "Estamos lanzando oficialmente el ",
          reengajamento: "Hace tiempo que no hablamos — y tengo una buena noticia: ",
        },
        headings: {
          subjects: "3 ASUNTOS PARA PROBAR",
          preheader: "PREHEADER",
          body: "CUERPO DEL CORREO",
        },
        subjectBenefit: "[{company}] {product} — {benefit}",
        subjectForYou: "{recipient}, quedó algo para ti.",
        subjectIdea: "Una idea para {audience}.",
        subjectLastCall: "Última llamada",
        subjectReasons: "3 razones para abrir este correo",
        hi: "¡Hola, {recipient}!",
        hello: "¡Hola!",
        launchBody: "{product}, y quiero que seas de los primeros.",
        body: "{product} {benefit}. {reason}",
        offer: "Y hay más: {offer}.",
        bonus: "En esta edición, incluimos un bono exclusivo para los primeros.",
        click: "Solo tienes que hacer clic en el botón de abajo.",
        ps: "P.D.: ¿Quieres probarlo antes? Responde este correo y te ayudo.",
        team: "Equipo {company}",
      },
    },
  },
};
