/**
 * CopyForge — Local Copy Engine
 *
 * A strategic copywriting engine that INTERPRETS the briefing instead of
 * concatenating fields. Uses a structured Knowledge Base to select frameworks,
 * angles, headline patterns, hooks, and CTAs appropriate for each context.
 *
 * Flow: Brief → Classify → Select Strategy → Generate → Validate → Fact Guard → Output
 */

import type { Locale } from "@/i18n/strings";

/* ======================================================================
   TYPES
   ====================================================================== */

interface Brief {
  template: string; // meta-ads | legendas | roteiros | emails
  product: string;
  audience: string;
  goal: string;
  tone: string;
  locale: Locale;
  differentiator?: string;
  cta?: string;
  topic?: string;
  platform?: string;
  company?: string;
  offer?: string;
  deadline?: string;
  recipient?: string;
}

interface ClassifiedBrief {
  productCategory: string;
  audienceType: string;
  objective: string;
  channel: string;
  tone: string;
  hasPrice: boolean;
  hasOffer: boolean;
  hasGuarantee: boolean;
  hasDifferentiator: boolean;
  audienceSummary: string; // short interpretation, NOT the raw text
}

interface GenerationContext {
  brief: Brief;
  classified: ClassifiedBrief;
  framework: FrameworkEntry;
  angle: AngleEntry;
  headlinePatterns: string[];
  hookPatterns: string[];
  ctaPatterns: string[];
  bodyRules: string[];
  avoidRules: string[];
}

/* ======================================================================
   KNOWLEDGE BASE — STRUCTURED ENTRIES
   ====================================================================== */

interface FrameworkEntry {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
 适合objectives: string[];
 适合channels: string[];
  structure: Record<Locale, string[]>;
  rules: Record<Locale, string[]>;
  avoid: Record<Locale, string[]>;
}

interface ChannelEntry {
  id: string;
  name: Record<Locale, string>;
  rules: Record<Locale, string[]>;
  headlineMaxChars?: number;
  bodyMaxWords?: number;
}

interface AngleEntry {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  headlinePatterns: Record<Locale, string[]>;
  hookPatterns: Record<Locale, string[]>;
  ctaPatterns: Record<Locale, string[]>;
}

interface AudienceProfile {
  id: string;
  keywords: string[];
  language: Record<Locale, string[]>;
  pains: Record<Locale, string[]>;
  desires: Record<Locale, string[]>;
}

interface ProductCategory {
  id: string;
  keywords: string[];
  benefits: Record<Locale, string[]>;
}

interface PersuasionRule {
  id: string;
  rule: Record<Locale, string>;
}

/* ----- Frameworks ----- */

const FRAMEWORKS: FrameworkEntry[] = [
  {
    id: "pas",
    name: { pt: "PAS (Problema-Agitar-Solução)", en: "PAS (Problem-Agitate-Solution)", es: "PAS (Problema-Agitar-Solución)" },
    description: {
      pt: "Identifica um problema real do público, amplifica a dor e apresenta a solução",
      en: "Identifies a real audience problem, amplifies the pain and presents the solution",
      es: "Identifica un problema real del público, amplifica el dolor y presenta la solución",
    },
    适合objectives: ["vendas", "leads", "cliques"],
    适合channels: ["meta-ads", "google-ads", "legendas", "emails"],
    structure: {
      pt: ["Identifique uma dor específica do público", "Amplifique as consequências de não resolver", "Apresente o produto como solução natural"],
      en: ["Identify a specific audience pain point", "Amplify the consequences of not solving it", "Present the product as the natural solution"],
      es: ["Identificar un punto de dolor específico del público", "Amplificar las consecuencias de no resolverlo", "Presentar el producto como la solución natural"],
    },
    rules: {
      pt: ["A dor deve ser real e reconhecível pelo público", "A agitação deve ser proporcional — não exagere", "A solução deve ser o produto, não uma promessa genérica"],
      en: ["The pain must be real and recognizable to the audience", "The agitation must be proportional — don't exaggerate", "The solution must be the product, not a generic promise"],
      es: ["El dolor debe ser real y reconocible para el público", "La agitación debe ser proporcional — no exageres", "La solución debe ser el producto, no una promesa genérica"],
    },
    avoid: {
      pt: ["Inventar dores que o público não tem", "Exagerar consequências sem suporte", "Prometer resultados não informados"],
      en: ["Inventing pains the audience doesn't have", "Exaggerating unsupported consequences", "Promising results not in the briefing"],
      es: ["Inventar dolores que el público no tiene", "Exagerar consecuencias sin soporte", "Prometer resultados no informados"],
    },
  },
  {
    id: "aida",
    name: { pt: "AIDA (Atenção-Interesse-Desejo-Ação)", en: "AIDA (Attention-Interest-Desire-Action)", es: "AIDA (Atención-Interés-Desejo-Acción)" },
    description: {
      pt: "Captura atenção com gancho, cria interesse, desperta desejo e direciona para ação",
      en: "Grabs attention with a hook, creates interest, sparks desire and directs to action",
      es: "Capta atención con gancho, crea interés, despierta deseo y dirige a la acción",
    },
    适合objectives: ["vendas", "lancamento", "leads"],
    适合channels: ["meta-ads", "emails", "landing-page"],
    structure: {
      pt: ["Gancho que interrompe a rolagem", "Contexto que gera interesse", "Benefício que desperta desejo", "CTA claro e direto"],
      en: ["Hook that stops the scroll", "Context that generates interest", "Benefit that sparks desire", "Clear and direct CTA"],
      es: ["Gancho que interrumpe el scroll", "Contexto que genera interés", "Beneficio que despierta deseo", "CTA claro y directo"],
    },
    rules: {
      pt: ["O gancho deve ser específico, não genérico", "O interesse vem do contexto, não da descrição do produto", "O desejo vem do benefício, não da feature"],
      en: ["The hook must be specific, not generic", "Interest comes from context, not product description", "Desire comes from benefit, not feature"],
      es: ["El gancho debe ser específico, no genérico", "El interés viene del contexto, no de la descripción del producto", "El deseo viene del beneficio, no de la característica"],
    },
    avoid: {
      pt: ["Ganchos genéricos como 'Descubra...' ou 'Você sabia?'", "Descrição técnica do produto sem conexão com o público"],
      en: ["Generic hooks like 'Discover...' or 'Did you know?'", "Technical product description without audience connection"],
      es: ["Ganchos genéricos como 'Descubre...' o '¿Sabías?'", "Descripción técnica del producto sin conexión con el público"],
    },
  },
  {
    id: "bab",
    name: { pt: "BAB (Antes-Depois)", en: "BAB (Before-After)", es: "BAB (Antes-Después)" },
    description: {
      pt: "Mostra a transformação: vida antes do produto vs vida depois",
      en: "Shows the transformation: life before the product vs life after",
      es: "Muestra la transformación: vida antes del producto vs vida después",
    },
    适合objectives: ["vendas", "lancamento", "engajamento"],
    适合channels: ["meta-ads", "legendas", "roteiros"],
    structure: {
      pt: ["Descreva a situação atual (antes)", "Apresente a transformação (depois)", "Conecte com o produto como ponte"],
      en: ["Describe the current situation (before)", "Present the transformation (after)", "Connect with the product as the bridge"],
      es: ["Describe la situación actual (antes)", "Presenta la transformación (después)", "Conecta con el producto como puente"],
    },
    rules: {
      pt: ["O antes deve ser reconhecível pelo público", "O depois deve ser aspiracional mas plausível", "Não invente resultados específicos"],
      en: ["The before must be recognizable to the audience", "The after must be aspirational but plausible", "Don't invent specific results"],
      es: ["El antes debe ser reconocible para el público", "El después debe ser aspiracional pero plausible", "No inventes resultados específicos"],
    },
    avoid: {
      pt: ["Transformações irreais ou exageradas", "Promessas de resultado financeiro sem dados"],
      en: ["Unrealistic or exaggerated transformations", "Financial result promises without data"],
      es: ["Transformaciones irreales o exageradas", "Promesas de resultado financiero sin datos"],
    },
  },
  {
    id: "benefit-proof-cta",
    name: { pt: "Benefício-Prova-CTA", en: "Benefit-Proof-CTA", es: "Beneficio-Prueba-CTA" },
    description: {
      pt: "Lidera com o benefício mais forte, apresenta prova e direciona para ação",
      en: "Leads with the strongest benefit, presents proof and directs to action",
      es: "Lidera con el beneficio más fuerte, presenta prueba y dirige a la acción",
    },
    适合objectives: ["vendas", "leads", "cliques"],
    适合channels: ["meta-ads", "google-ads", "emails"],
    structure: {
      pt: ["Benefício principal em uma frase", "Elemento de prova ou credibilidade", "CTA compatível com a oferta"],
      en: ["Main benefit in one sentence", "Proof or credibility element", "CTA compatible with the offer"],
      es: ["Beneficio principal en una frase", "Elemento de prueba o credibilidad", "CTA compatible con la oferta"],
    },
    rules: {
      pt: ["O benefício deve ser o mais relevante para o público", "A prova deve ser verificável (sem inventar)", "O CTA deve ser coerente com a oferta real"],
      en: ["The benefit must be the most relevant to the audience", "The proof must be verifiable (don't invent)", "The CTA must be coherent with the actual offer"],
      es: ["El beneficio debe ser el más relevante para el público", "La prueba debe ser verificable (no inventar)", "El CTA debe ser coherente con la oferta real"],
    },
    avoid: {
      pt: ["Provas inventadas (estatísticas, depoimentos)", "Benefícios genéricos como 'mude sua vida'"],
      en: ["Invented proof (statistics, testimonials)", "Generic benefits like 'change your life'"],
      es: ["Pruebas inventadas (estadísticas, testimonios)", "Beneficios genéricos como 'cambia tu vida'"],
    },
  },
];

/* ----- Channels ----- */

const CHANNELS: ChannelEntry[] = [
  {
    id: "meta-ads",
    name: { pt: "Meta Ads", en: "Meta Ads", es: "Meta Ads" },
    rules: {
      pt: [
        "Gancho na primeira linha — interrompa a rolagem",
        "Parágrafos curtos e escaneáveis (2-3 linhas máx)",
        "Foco em um único benefício principal",
        "CTA natural, não agressivo",
        "Evite linguagem que o Meta bloqueie (resultados garantidos, discriminação)",
        "Formato 4:5 para mobile",
      ],
      en: [
        "Hook in the first line — stop the scroll",
        "Short scannable paragraphs (2-3 lines max)",
        "Focus on a single main benefit",
        "Natural CTA, not aggressive",
        "Avoid language Meta blocks (guaranteed results, discrimination)",
        "4:5 format for mobile",
      ],
      es: [
        "Gancho en la primera línea — detén el scroll",
        "Párrafos cortos y escaneables (2-3 líneas máx)",
        "Enfoque en un solo beneficio principal",
        "CTA natural, no agresivo",
        "Evita lenguaje que Meta bloquea (resultados garantidos, discriminación)",
        "Formato 4:5 para móvil",
      ],
    },
    headlineMaxChars: 40,
    bodyMaxWords: 125,
  },
  {
    id: "google-ads",
    name: { pt: "Google Ads", en: "Google Ads", es: "Google Ads" },
    rules: {
      pt: [
        "Headlines devem ser claros e específicos",
        "Inclua palavras-chave de alta intenção",
        "CTA com link direto para conversão",
        "Evite promessas vagas",
      ],
      en: [
        "Headlines must be clear and specific",
        "Include high-intent keywords",
        "CTA with direct link to conversion",
        "Avoid vague promises",
      ],
      es: [
        "Los títulos deben ser claros y específicos",
        "Incluye palabras clave de alta intención",
        "CTA con enlace directo a conversión",
        "Evita promesas vagas",
      ],
    },
    headlineMaxChars: 30,
  },
  {
    id: "legendas",
    name: { pt: "Legendas IG/TikTok", en: "Captions IG/TikTok", es: "Leyendas IG/TikTok" },
    rules: {
      pt: [
        "Gancho forte na primeira linha",
        "Use emojis com moderação",
        "Parágrafos curtos com espaço entre eles",
        "Engaje com perguntas ou CTA para comentar",
        "Hashtags relevantes (5-15)",
      ],
      en: [
        "Strong hook in the first line",
        "Use emojis sparingly",
        "Short paragraphs with spacing",
        "Engage with questions or CTA to comment",
        "Relevant hashtags (5-15)",
      ],
      es: [
        "Gancho fuerte en la primera línea",
        "Usa emojis con moderación",
        "Párrafos cortos con espaciado",
        "Involucra con preguntas o CTA para comentar",
        "Hashtags relevantes (5-15)",
      ],
    },
  },
  {
    id: "roteiros",
    name: { pt: "Roteiros Reels/Shorts", en: "Scripts Reels/Shorts", es: "Guiones Reels/Shorts" },
    rules: {
      pt: [
        "Primeiro segundo: gancho visual e verbal",
        "Desenvolvimento: contexto ou problema",
        "Clímax: a revelação ou solução",
        "CTA final claro",
        "Cada cena deve ter um propósito",
      ],
      en: [
        "First second: visual and verbal hook",
        "Development: context or problem",
        "Climax: the revelation or solution",
        "Clear final CTA",
        "Each scene must have a purpose",
      ],
      es: [
        "Primer segundo: gancho visual y verbal",
        "Desarrollo: contexto o problema",
        "Clímax: la revelación o solución",
        "CTA final claro",
        "Cada escena debe tener un propósito",
      ],
    },
  },
  {
    id: "emails",
    name: { pt: "E-mails de Vendas", en: "Sales Emails", es: "Correos de Venta" },
    rules: {
      pt: [
        "Assunto: curto, específico, gera curiosidade",
        "Pré-header: complementa o assunto",
        "Abertura: personalizada ou de valor imediato",
        "Corpo: problema → solução → prova → CTA",
        "P.S.: reforça urgência ou benefício",
      ],
      en: [
        "Subject: short, specific, creates curiosity",
        "Preheader: complements the subject",
        "Opening: personalized or immediate value",
        "Body: problem → solution → proof → CTA",
        "P.S.: reinforces urgency or benefit",
      ],
      es: [
        "Asunto: corto, específico, genera curiosidad",
        "Preheader: complementa el asunto",
        "Apertura: personalizada o valor inmediato",
        "Cuerpo: problema → solución → prueba → CTA",
        "P.S.: refuerza urgencia o beneficio",
      ],
    },
  },
];

/* ----- Angles ----- */

const ANGLES: AngleEntry[] = [
  {
    id: "problem-solution",
    name: { pt: "Problema → Solução", en: "Problem → Solution", es: "Problema → Solución" },
    description: {
      pt: "Conecta uma dor real do público ao benefício do produto",
      en: "Connects a real audience pain to the product benefit",
      es: "Conecta un dolor real del público al beneficio del producto",
    },
    headlinePatterns: {
      pt: [
        "{product}: resolva {pain} de verdade",
        "Sua rotina com {pain}? {product} resolve",
        "{pain} não precisa ser assim — {product} muda isso",
        "O que fazer quando {painLower}",
      ],
      en: [
        "{product}: actually solve {pain}",
        "Your routine with {pain}? {product} fixes that",
        "{pain} doesn't have to be this way — {product} changes it",
        "What to do when {painLower}",
      ],
      es: [
        "{product}: resuelve {pain} de verdad",
        "¿Tu rutina con {pain}? {product} lo soluciona",
        "{pain} no tiene por qué ser así — {product} cambia eso",
        "Qué hacer cuando {painLower}",
      ],
    },
    hookPatterns: {
      pt: [
        "Você já sentiu {painLower}?",
        "Se {painLower} é um problema no seu dia, leia isso",
        "Quase todo mundo lida com {painLower}. Nem todo mundo sabe que existe uma saída.",
      ],
      en: [
        "Have you ever dealt with {painLower}?",
        "If {painLower} is a problem in your day, read this",
        "Most people deal with {painLower}. Not everyone knows there's a way out.",
      ],
      es: [
        "¿Alguna vez has lidiado con {painLower}?",
        "Si {painLower} es un problema en tu día, lee esto",
        "La mayoría lidia con {painLower}. No todos saben que hay una salida.",
      ],
    },
    ctaPatterns: {
      pt: ["Conheça {product}", "Veja como funciona", "Teste agora"],
      en: ["Discover {product}", "See how it works", "Try it now"],
      es: ["Conoce {product}", "Mira cómo funciona", "Pruébalo ahora"],
    },
  },
  {
    id: "benefit",
    name: { pt: "Benefício Principal", en: "Main Benefit", es: "Beneficio Principal" },
    description: {
      pt: "Lidera com o benefício mais forte e concreto do produto",
      en: "Leads with the product's strongest and most concrete benefit",
      es: "Lidera con el beneficio más fuerte y concreto del producto",
    },
    headlinePatterns: {
      pt: [
        "{benefit} com {product}",
        "{product}: {benefit} no seu dia a dia",
        "Como {benefitLower} usando {product}",
        "{product} — {benefit}",
      ],
      en: [
        "{benefit} with {product}",
        "{product}: {benefitLower} in your daily life",
        "How to {benefitLower} using {product}",
        "{product} — {benefit}",
      ],
      es: [
        "{benefit} con {product}",
        "{product}: {benefitLower} en tu día a día",
        "Cómo {benefitLower} usando {product}",
        "{product} — {benefit}",
      ],
    },
    hookPatterns: {
      pt: [
        "E se você pudesse {benefitLower}?",
        "Imagina {benefitLower} sem complicação",
        "Existe um caminho mais direto para {benefitLower}",
      ],
      en: [
        "What if you could {benefitLower}?",
        "Imagine {benefitLower} without the hassle",
        "There's a more direct path to {benefitLower}",
      ],
      es: [
        "¿Y si pudieras {benefitLower}?",
        "Imagina {benefitLower} sin complicaciones",
        "Hay un camino más directo para {benefitLower}",
      ],
    },
    ctaPatterns: {
      pt: ["Comece hoje", "Garanta seu acesso", "Saiba mais"],
      en: ["Start today", "Get access", "Learn more"],
      es: ["Empieza hoy", "Obtén acceso", "Más información"],
    },
  },
  {
    id: "transformation",
    name: { pt: "Transformação", en: "Transformation", es: "Transformación" },
    description: {
      pt: "Mostra a mudança que o produto possibilita",
      en: "Shows the change that the product enables",
      es: "Muestra el cambio que el producto posibilita",
    },
    headlinePatterns: {
      pt: [
        "De {beforeState} para {afterState} com {product}",
        "{product}: a transformação que você precisa",
        "Saia de {beforeStateLower} — {product} te leva a {afterStateLower}",
      ],
      en: [
        "From {beforeState} to {afterState} with {product}",
        "{product}: the transformation you need",
        "Go from {beforeStateLower} — {product} takes you to {afterStateLower}",
      ],
      es: [
        "De {beforeState} a {afterState} con {product}",
        "{product}: la transformación que necesitas",
        "Sal de {beforeStateLower} — {product} te lleva a {afterStateLower}",
      ],
    },
    hookPatterns: {
      pt: [
        "Você não precisa continuar onde está",
        "A diferença entre quem usa {product} e quem não usa",
        "Sua próxima versão começa aqui",
      ],
      en: [
        "You don't have to stay where you are",
        "The difference between those who use {product} and those who don't",
        "Your next version starts here",
      ],
      es: [
        "No tienes que seguir donde estás",
        "La diferencia entre quienes usan {product} y quienes no",
        "Tu siguiente versión comienza aquí",
      ],
    },
    ctaPatterns: {
      pt: ["Comece sua transformação", "Dê o primeiro passo", "Invista em você"],
      en: ["Start your transformation", "Take the first step", "Invest in yourself"],
      es: ["Comienza tu transformación", "Da el primer paso", "Invierte en ti"],
    },
  },
  {
    id: "urgency",
    name: { pt: "Urgência", en: "Urgency", es: "Urgencia" },
    description: {
      pt: "Cria senso de urgência compatível com a oferta real",
      en: "Creates urgency compatible with the real offer",
      es: "Crea urgencia compatible con la oferta real",
    },
    headlinePatterns: {
      pt: [
        "Não espere mais — {product} está disponível",
        "Enquanto isso, quem usa {product} já está {benefitLower}",
        "A cada dia sem {product}, {painLower}",
      ],
      en: [
        "Don't wait — {product} is available",
        "Meanwhile, those using {product} are already {benefitLower}",
        "Every day without {product}, {painLower}",
      ],
      es: [
        "No esperes más — {product} está disponible",
        "Mientras tanto, quienes usan {product} ya están {benefitLower}",
        "Cada día sin {product}, {painLower}",
      ],
    },
    hookPatterns: {
      pt: [
        "Cada dia que passa, {painLower} continua",
        "Enquanto você pensa, outros já estão {benefitLower}",
        "A hora de agir é agora",
      ],
      en: [
        "Every day that passes, {painLower} continues",
        "While you think about it, others are already {benefitLower}",
        "The time to act is now",
      ],
      es: [
        "Cada día que pasa, {painLower} continúa",
        "Mientras piensas, otros ya están {benefitLower}",
        "El momento de actuar es ahora",
      ],
    },
    ctaPatterns: {
      pt: ["Comece agora", "Não deixe para depois", "Garanta sua vaga"],
      en: ["Start now", "Don't put it off", "Secure your spot"],
      es: ["Empieza ahora", "No lo dejes para después", "Asegura tu lugar"],
    },
  },
  {
    id: "practicality",
    name: { pt: "Praticidade", en: "Practicality", es: "Practicidad" },
    description: {
      pt: "Enfatiza facilidade, praticidade e economia de tempo",
      en: "Emphasizes ease, practicality and time savings",
      es: "Enfatiza facilidad, practicidad y ahorro de tiempo",
    },
    headlinePatterns: {
      pt: [
        "{product}: simples, direto, prático",
        "A forma mais prática de {benefitLower}",
        "{product} — sem complicação, com resultado",
      ],
      en: [
        "{product}: simple, direct, practical",
        "The most practical way to {benefitLower}",
        "{product} — no complications, real results",
      ],
      es: [
        "{product}: simple, directo, práctico",
        "La forma más práctica de {benefitLower}",
        "{product} — sin complicaciones, con resultado",
      ],
    },
    hookPatterns: {
      pt: [
        "E se fosse mais fácil do que você imagina?",
        "Simplifique {painLower} com uma ferramenta que funciona",
        "Menos esforço, mais resultado",
      ],
      en: [
        "What if it were easier than you think?",
        "Simplify {painLower} with a tool that works",
        "Less effort, more results",
      ],
      es: [
        "¿Y si fuera más fácil de lo que imaginas?",
        "Simplifica {painLower} con una herramienta que funciona",
        "Menos esfuerzo, más resultados",
      ],
    },
    ctaPatterns: {
      pt: ["Experimente gratuitamente", "Veja como funciona", "Comece sem complicação"],
      en: ["Try it free", "See how it works", "Start without hassle"],
      es: ["Pruébalo gratis", "Mira cómo funciona", "Empieza sin complicaciones"],
    },
  },
  {
    id: "career-growth",
    name: { pt: "Carreira", en: "Career Growth", es: "Crecimiento Profesional" },
    description: {
      pt: "Conecta o produto ao desenvolvimento profissional e crescimento de carreira",
      en: "Connects the product to professional development and career growth",
      es: "Conecta el producto al desarrollo profesional y crecimiento de carrera",
    },
    headlinePatterns: {
      pt: [
        "Desenvolva uma habilidade que valoriza seu currículo",
        "Invista no que projeta sua carreira",
        "A habilidade que o mercado está pedindo",
        "{product}: o diferencial que falta no seu perfil",
      ],
      en: [
        "Develop a skill that boosts your resume",
        "Invest in what advances your career",
        "The skill the market is asking for",
        "{product}: the edge your profile is missing",
      ],
      es: [
        "Desarrolla una habilidad que valoriza tu currículum",
        "Invierte en lo que proyecta tu carrera",
        "La habilidad que el mercado está pidiendo",
        "{product}: el diferencial que falta en tu perfil",
      ],
    },
    hookPatterns: {
      pt: [
        "Profissionais que dominam essa habilidade se destacam",
        "O mercado está mudando — e você?",
        "Sua próxima oportunidade pode depender disso",
      ],
      en: [
        "Professionals who master this skill stand out",
        "The market is changing — are you?",
        "Your next opportunity may depend on this",
      ],
      es: [
        "Los profesionales que dominan esta habilidad destacan",
        "El mercado está cambiando — ¿y tú?",
        "Tu próxima oportunidad puede depender de esto",
      ],
    },
    ctaPatterns: {
      pt: ["Comece agora", "Invista na sua carreira", "Desenvolva essa habilidade"],
      en: ["Start now", "Invest in your career", "Develop this skill"],
      es: ["Empieza ahora", "Invierte en tu carrera", "Desarrolla esta habilidad"],
    },
  },
];

/* ----- Audience Profiles ----- */

const AUDIENCE_PROFILES: AudienceProfile[] = [
  {
    id: "professionals",
    keywords: ["profissional", "profissionais", "carreira", "trabalho", "mercado", "currículo", "estágio", "clt", "concurs", "profissional"],
    language: {
      pt: ["profissional", "carreira", "mercado", "oportunidade", "habilidade"],
      en: ["professional", "career", "market", "opportunity", "skill"],
      es: ["profesional", "carrera", "mercado", "oportunidad", "habilidad"],
    },
    pains: {
      pt: ["ficar para trás", "perder oportunidades", "não ter diferencial", "estagnação profissional"],
      en: ["falling behind", "missing opportunities", "no competitive edge", "career stagnation"],
      es: ["quedarse atrás", "perder oportunidades", "no tener diferencial", "estancamiento profesional"],
    },
    desires: {
      pt: ["crescer na carreira", "se destacar", "aprender algo novo", "ser mais produtivo"],
      en: ["grow in their career", "stand out", "learn something new", "be more productive"],
      es: ["crecer en su carrera", "destacar", "aprender algo nuevo", "ser más productivo"],
    },
  },
  {
    id: "entrepreneurs",
    keywords: ["empreendedor", "negócio", "empresa", "startup", "solo", "freela", "autônomo", "próprio"],
    language: {
      pt: ["empreendedor", "negócio", "próprio"],
      en: ["entrepreneur", "business", "own"],
      es: ["emprendedor", "negocio", "propio"],
    },
    pains: {
      pt: ["falta de tempo", "muitas tarefas", "dificuldade de escalar", "processos manuais"],
      en: ["lack of time", "too many tasks", "difficulty scaling", "manual processes"],
      es: ["falta de tiempo", "muchas tareas", "dificultad para escalar", "procesos manuales"],
    },
    desires: {
      pt: ["automatizar", "crescer o negócio", "mais lucro", "liberdade"],
      en: ["automate", "grow the business", "more profit", "freedom"],
      es: ["automatizar", "crecer el negocio", "más ganancias", "libertad"],
    },
  },
  {
    id: "beginners",
    keywords: ["iniciante", "começar", "zero", "não sei", "nunca", "pela primeira", "novo", "nova"],
    language: {
      pt: ["iniciante", "início", "zero"],
      en: ["beginner", "start", "zero"],
      es: ["principiante", "inicio", "cero"],
    },
    pains: {
      pt: ["não sei por onde começar", "é complicado demais", "medo de errar", "sensação de estar perdido"],
      en: ["don't know where to start", "it's too complicated", "fear of making mistakes", "feeling lost"],
      es: ["no sé por dónde empezar", "es demasiado complicado", "miedo a equivocarse", "sensación de estar perdido"],
    },
    desires: {
      pt: ["aprender do zero", "ter um passo a passo", "ter orientação", "conseguir fazer sozinho"],
      en: ["learn from scratch", "have a step-by-step", "have guidance", "be able to do it alone"],
      es: ["aprender desde cero", "tener un paso a paso", "tener orientación", "poder hacerlo solo"],
    },
  },
  {
    id: "consumers",
    keywords: ["cliente", "consumidor", "comprar", "loja", "produto", "família", "casa", "pessoal"],
    language: {
      pt: ["cliente", "consumidor", "pessoal"],
      en: ["customer", "consumer", "personal"],
      es: ["cliente", "consumidor", "personal"],
    },
    pains: {
      pt: ["comprar errado", "gastar à toa", "não saber escolher", "arrependimento de compra"],
      en: ["buying wrong", "wasting money", "not knowing how to choose", "buyer's remorse"],
      es: ["comprar mal", "gastar a lo tonto", "no saber elegir", "arrepentimiento de compra"],
    },
    desires: {
      pt: ["fazer a escolha certa", "economizar", "ter qualidade", "facilidade"],
      en: ["make the right choice", "save money", "have quality", "convenience"],
      es: ["hacer la elección correcta", "ahorrar", "tener calidad", "comodidad"],
    },
  },
];

/* ----- Product Categories ----- */

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "course",
    keywords: ["curso", "aula", "treinamento", "workshop", "capacitação", "formação", "certificação", "bootcamp", "mentoria", "course", "training", "workshop", "bootcamp", "mentoring", "curso", "capacitación", "taller"],
    benefits: {
      pt: ["aprender uma habilidade prática", "desenvolver competência", "crescer profissionalmente", "sair do zero com domínio"],
      en: ["learn a practical skill", "develop competence", "grow professionally", "go from zero to mastery"],
      es: ["aprender una habilidad práctica", "desarrollar competencia", "crecer profesionalmente", "salir de cero con dominio"],
    },
  },
  {
    id: "saas",
    keywords: ["software", "saas", "plataforma", "app", "ferramenta", "sistema", "app", "tool", "platform", "software", "herramienta", "plataforma"],
    benefits: {
      pt: ["automatizar tarefas", "ser mais produtivo", "simplificar processos", "economizar tempo"],
      en: ["automate tasks", "be more productive", "simplify processes", "save time"],
      es: ["automatizar tareas", "ser más productivo", "simplificar procesos", "ahorrar tiempo"],
    },
  },
  {
    id: "service",
    keywords: ["serviço", "consultoria", "assessoria", "agência", "freelancer", "service", "consulting", "agency", "servicio", "consultoría"],
    benefits: {
      pt: ["ter orientação especializada", "resolver um problema específico", "economizar tempo e dinheiro"],
      en: ["get specialized guidance", "solve a specific problem", "save time and money"],
      es: ["obtener orientación especializada", "resolver un problema específico", "ahorrar tiempo y dinero"],
    },
  },
];

/* ----- Audience Interpolation Helpers ----- */

/** Extract the most relevant pain for the brief from the audience profile */
function selectPain(profile: AudienceProfile, locale: Locale): string {
  const pains = profile.pains[locale] || profile.pains.pt;
  return pains[Math.floor(Math.random() * pains.length)];
}

/** Extract the most relevant desire */
function selectDesire(profile: AudienceProfile, locale: Locale): string {
  const desires = profile.desires[locale] || profile.desires.pt;
  return desires[Math.floor(Math.random() * desires.length)];
}

/* ======================================================================
   CLASSIFICATION
   ====================================================================== */

function classifyBrief(brief: Brief): ClassifiedBrief {
  const lowerProduct = (brief.product || "").toLowerCase();
  const lowerAudience = (brief.audience || "").toLowerCase();
  const lowerGoal = (brief.goal || "").toLowerCase();

  // Classify product category
  let productCategory = "generic";
  for (const cat of PRODUCT_CATEGORIES) {
    if (cat.keywords.some((kw) => lowerProduct.includes(kw))) {
      productCategory = cat.id;
      break;
    }
  }

  // Classify audience type
  let audienceType = "general";
  for (const profile of AUDIENCE_PROFILES) {
    if (profile.keywords.some((kw) => lowerAudience.includes(kw))) {
      audienceType = profile.id;
      break;
    }
  }

  // Classify objective
  const objectiveMap: Record<string, string> = {
    vendas: "sales",
    venda: "sales",
    leads: "leads",
    cliques: "traffic",
    alcance: "awareness",
    mensagens: "engagement",
    engajamento: "engagement",
    seguidores: "awareness",
    lancamento: "launch",
    reengajamento: "retarget",
  };
  const objective = objectiveMap[lowerGoal] || "sales";

  // Map template to channel
  const channelMap: Record<string, string> = {
    "meta-ads": "meta-ads",
    legendas: "legendas",
    roteiros: "roteiros",
    emails: "emails",
  };
  const channel = channelMap[brief.template] || "meta-ads";

  // Interpret audience (short summary, NOT the raw text)
  const profile = AUDIENCE_PROFILES.find((p) => p.id === audienceType);
  const locale = brief.locale;
  let audienceSummary = brief.audience;
  if (profile) {
    const lang = profile.language[locale] || profile.language.pt;
    audienceSummary = lang.join(", ");
  }

  // Detect extra info
  const fullText = `${brief.product} ${brief.differentiator || ""} ${brief.offer || ""} ${brief.audience || ""}`.toLowerCase();
  const hasPrice = /r\$|us\$|\$|preço|price|precio/.test(fullText) || /\d+\.\d{2}/.test(fullText);
  const hasOffer = /oferta|desconto|off|cupom|coupon|discount|bonus|bônus|brinde/.test(fullText);
  const hasGuarantee = /garantia|warranty|garantía|dias|days|días/.test(fullText);
  const hasDifferentiator = !!(brief.differentiator && brief.differentiator.trim().length > 0);

  return {
    productCategory,
    audienceType,
    objective,
    channel,
    tone: brief.tone || "persuasivo",
    hasPrice,
    hasOffer,
    hasGuarantee,
    hasDifferentiator,
    audienceSummary,
  };
}

/* ======================================================================
   STRATEGY SELECTION
   ====================================================================== */

function selectFramework(classified: ClassifiedBrief): FrameworkEntry {
  // Select the best framework for the objective and channel
  const suitable = FRAMEWORKS.filter(
    (f) =>
      f.适合objectives.includes(classified.objective) ||
      f.适合channels.includes(classified.channel),
  );
  if (suitable.length === 0) return FRAMEWORKS[0];

  // Prefer PAS for sales, AIDA for launches, BPC for products with proof
  if (classified.objective === "sales") {
    const pas = suitable.find((f) => f.id === "pas");
    if (pas) return pas;
  }
  if (classified.objective === "launch") {
    const aida = suitable.find((f) => f.id === "aida");
    if (aida) return aida;
  }

  return suitable[Math.floor(Math.random() * suitable.length)];
}

function selectAngle(
  classified: ClassifiedBrief,
  _framework: FrameworkEntry,
): AngleEntry {
  // Select angle based on context
  if (classified.audienceType === "beginners") {
    return ANGLES.find((a) => a.id === "practicality") || ANGLES[0];
  }
  if (classified.audienceType === "professionals") {
    return ANGLES.find((a) => a.id === "career-growth") || ANGLES[0];
  }
  if (classified.hasOffer || classified.hasDifferentiator) {
    return ANGLES.find((a) => a.id === "benefit") || ANGLES[0];
  }
  if (classified.objective === "launch") {
    return ANGLES.find((a) => a.id === "transformation") || ANGLES[0];
  }

  // Default: problem-solution for sales, benefit for others
  if (classified.objective === "sales") {
    return ANGLES.find((a) => a.id === "problem-solution") || ANGLES[0];
  }
  return ANGLES.find((a) => a.id === "benefit") || ANGLES[0];
}

function selectPainForBrief(
  classified: ClassifiedBrief,
  locale: Locale,
): string {
  const profile = AUDIENCE_PROFILES.find((p) => p.id === classified.audienceType);
  if (profile) return selectPain(profile, locale);

  // Generic pains by objective
  const genericPains: Record<Locale, string[]> = {
    pt: ["perder tempo", "resultados lentos", "processos complicados"],
    en: ["wasting time", "slow results", "complicated processes"],
    es: ["perder tiempo", "resultados lentos", "procesos complicados"],
  };
  const pains = genericPains[locale] || genericPains.pt;
  return pains[Math.floor(Math.random() * pains.length)];
}

function selectDesireForBrief(
  classified: ClassifiedBrief,
  locale: Locale,
): string {
  const profile = AUDIENCE_PROFILES.find((p) => p.id === classified.audienceType);
  if (profile) return selectDesire(profile, locale);

  const genericDesires: Record<Locale, string[]> = {
    pt: ["ser mais produtivo", "crescer", "aprender algo novo"],
    en: ["be more productive", "grow", "learn something new"],
    es: ["ser más productivo", "crecer", "aprender algo nuevo"],
  };
  const desires = genericDesires[locale] || genericDesires.pt;
  return desires[Math.floor(Math.random() * desires.length)];
}

function selectBenefit(
  classified: ClassifiedBrief,
  locale: Locale,
): string {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === classified.productCategory);
  if (cat) {
    const benefits = cat.benefits[locale] || cat.benefits.pt;
    return benefits[Math.floor(Math.random() * benefits.length)];
  }
  return classified.hasDifferentiator ? "resolve o problema de forma prática" : "entrega resultado real";
}

function selectTemplate(
  patterns: string[],
  replacements: Record<string, string>,
): string {
  let result = patterns[Math.floor(Math.random() * patterns.length)];
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    result = result.replace(new RegExp(`\\{${key}Lower\\}`, "g"), value.toLowerCase());
  }
  return result;
}

/* ======================================================================
   GENERATION — META ADS
   ====================================================================== */

function generateMetaAdsLocal(ctx: GenerationContext): string {
  const { brief, classified, angle, framework } = ctx;
  const locale = brief.locale;
  const pain = selectPainForBrief(classified, locale);
  const desire = selectDesireForBrief(classified, locale);
  const benefit = selectBenefit(classified, locale);

  const replacements = {
    product: brief.product,
    audience: brief.audience,
    pain,
    painLower: pain,
    desire,
    desireLower: desire,
    benefit,
    benefitLower: benefit,
    differentiator: brief.differentiator || "",
    cta: brief.cta || "",
    goal: brief.goal,
  };

  // --- STRATEGY (internal, shown to user) ---
  const strategyLines: string[] = [
    `## ${locale === "pt" ? "ESTRATÉGIA" : locale === "es" ? "ESTRATEGIA" : "STRATEGY"}`,
  ];
  if (locale === "pt") {
    strategyLines.push(
      `- Objetivo: ${brief.goal}`,
      `- Público: ${brief.audience.slice(0, 120)}${brief.audience.length > 120 ? "…" : ""}`,
      `- Tom: ${brief.tone}`,
      `- Formato: ${brief.platform === "google" ? "Google Ads" : "Meta Ads (Facebook/Instagram)"}`,
      `- Framework: ${framework.name[locale]}`,
    );
  } else if (locale === "es") {
    strategyLines.push(
      `- Objetivo: ${brief.goal}`,
      `- Público: ${brief.audience.slice(0, 120)}${brief.audience.length > 120 ? "…" : ""}`,
      `- Tono: ${brief.tone}`,
      `- Formato: ${brief.platform === "google" ? "Google Ads" : "Meta Ads (Facebook/Instagram)"}`,
      `- Framework: ${framework.name[locale]}`,
    );
  } else {
    strategyLines.push(
      `- Goal: ${brief.goal}`,
      `- Audience: ${brief.audience.slice(0, 120)}${brief.audience.length > 120 ? "…" : ""}`,
      `- Tone: ${brief.tone}`,
      `- Format: ${brief.platform === "google" ? "Google Ads" : "Meta Ads (Facebook/Instagram)"}`,
      `- Framework: ${framework.name[locale]}`,
    );
  }

  // --- HEADLINES (3 genuinely different angles) ---
  const titlesLabel =
    locale === "pt"
      ? "3 TÍTULOS PARA TESTAR (A/B/C)"
      : locale === "es"
        ? "3 TÍTULOS PARA PROBAR (A/B/C)"
        : "3 HEADLINES TO TEST (A/B/C)";

  // Select 3 different angles for headlines
  const anglePool = [...ANGLES];
  const selectedAngles: AngleEntry[] = [angle];
  while (selectedAngles.length < 3 && anglePool.length > 0) {
    const idx = Math.floor(Math.random() * anglePool.length);
    const candidate = anglePool.splice(idx, 1)[0];
    if (!selectedAngles.find((a) => a.id === candidate.id)) {
      selectedAngles.push(candidate);
    }
  }

  const headlines = selectedAngles.map((a) =>
    selectTemplate(a.headlinePatterns[locale] || a.headlinePatterns.pt, replacements),
  );

  const labels = ["A:", "B:", "C:"];
  const headlineLines = headlines.map((h, i) => `- ${labels[i]} ${h}`);

  // --- MAIN BODY ---
  const mainLabel =
    locale === "pt"
      ? "TEXTO PRINCIPAL"
      : locale === "es"
        ? "TEXTO PRINCIPAL"
        : "MAIN TEXT";

  const bodyParts: string[] = [];

  // Apply framework structure
  const frameworkStructure = framework.structure[locale] || framework.structure.pt;

  if (framework.id === "pas") {
    // Problem-Agitate-Solution body
    bodyParts.push(
      locale === "pt"
        ? `${pain.charAt(0).toUpperCase() + pain.slice(1)} é mais comum do que parece. Quem vive isso no dia a dia sabe o peso que carrega.`
        : locale === "es"
          ? `${pain.charAt(0).toUpperCase() + pain.slice(1)} es más común de lo que parece. Quien vive esto a diario sabe el peso que carga.`
          : `${pain.charAt(0).toUpperCase() + pain.slice(1)} is more common than you think. Those who deal with it daily know the weight it carries.`,
    );
    bodyParts.push(
      locale === "pt"
        ? `${brief.product} foi pensado para quem quer resolver isso de forma prática — ${benefit}.`
        : locale === "es"
          ? `${brief.product} fue pensado para quien quiere resolver esto de forma práctica — ${benefit}.`
          : `${brief.product} was designed for those who want to solve this practically — ${benefit}.`,
    );
  } else {
    // Generic body based on benefit and product
    bodyParts.push(
      locale === "pt"
        ? `${brief.product} ${benefit}. Sem enrolação, sem promessa vazia.`
        : locale === "es"
          ? `${brief.product} ${benefit}. Sin vueltas, sin promesas vacías.`
          : `${brief.product} ${benefit}. No fluff, no empty promises.`,
    );
  }

  if (brief.differentiator) {
    bodyParts.push(
      locale === "pt"
        ? `E o diferencial: ${brief.differentiator}.`
        : locale === "es"
          ? `Y el diferencial: ${brief.differentiator}.`
          : `And the differentiator: ${brief.differentiator}.`,
    );
  }

  // Closing line
  bodyParts.push(
    locale === "pt"
      ? "Cada dia sem essa solução é mais um dia no mesmo lugar."
      : locale === "es"
        ? "Cada día sin esta solución es un día más en el mismo lugar."
        : "Every day without this solution is another day in the same place.",
  );

  const bodyText = bodyParts.join(" ");

  // --- CTA ---
  const ctaLabel =
    locale === "pt"
      ? "CHAMADA PARA AÇÃO"
      : locale === "es"
        ? "LLAMADA A LA ACCIÓN"
        : "CALL TO ACTION";

  const ctaText = brief.cta
    ? brief.cta
    : selectTemplate(
        angle.ctaPatterns[locale] || angle.ctaPatterns.pt,
        replacements,
      );

  // --- TIP ---
  const tipLabel =
    locale === "pt"
      ? "DICA RÁPIDA"
      : locale === "es"
        ? "CONSEJO RÁPIDO"
        : "QUICK TIP";

  const tip =
    locale === "pt"
      ? "Destaque o produto nos 3 primeiros segundos do criativo e use formato 4:5 para mobile."
      : locale === "es"
        ? "Destaca el producto en los primeros 3 segundos del creativo y usa formato 4:5 para móvil."
        : "Showcase the product in the first 3 seconds of the creative and use a 4:5 format for mobile.";

  // --- ASSEMBLE ---
  return [
    ...strategyLines,
    "",
    `## ${titlesLabel}`,
    ...headlineLines,
    "",
    `## ${mainLabel}`,
    bodyText,
    "",
    `## ${ctaLabel}`,
    `- ${ctaText} →`,
    "",
    `## ${tipLabel}`,
    `- ${tip}`,
  ].join("\n");
}

/* ======================================================================
   GENERATION — LEGENDAS (IG/TikTok)
   ====================================================================== */

function generateLegendasLocal(ctx: GenerationContext): string {
  const { brief, classified, angle } = ctx;
  const locale = brief.locale;
  const pain = selectPainForBrief(classified, locale);
  const benefit = selectBenefit(classified, locale);
  const replacements = {
    product: brief.product,
    audience: brief.audience,
    topic: brief.topic || brief.product,
    pain,
    painLower: pain,
    benefit,
    benefitLower: benefit,
    differentiator: brief.differentiator || "",
    cta: brief.cta || "",
    goal: brief.goal,
  };

  const hook = selectTemplate(
    angle.hookPatterns[locale] || angle.hookPatterns.pt,
    replacements,
  );

  const ctaText = brief.cta || selectTemplate(
    angle.ctaPatterns[locale] || angle.ctaPatterns.pt,
    replacements,
  );

  const hookLabel = locale === "pt" ? "GANCHO" : locale === "es" ? "GANCHO" : "HOOK";
  const bodyLabel = locale === "pt" ? "CORPO" : locale === "es" ? "CUERPO" : "BODY";
  const ctaLabel = locale === "pt" ? "CHAMADA PARA AÇÃO" : locale === "es" ? "LLAMADA A LA ACCIÓN" : "CALL TO ACTION";
  const hashtagsLabel = locale === "pt" ? "HASHTAGS" : locale === "es" ? "HASHTAGS" : "HASHTAGS";
  const tipsLabel = locale === "pt" ? "DICAS DE PUBLICAÇÃO" : locale === "es" ? "CONSEJOS DE PUBLICACIÓN" : "POSTING TIPS";

  const body = locale === "pt"
    ? `${brief.product} existe para quem quer ${benefit}. ${pain.charAt(0).toUpperCase() + pain.slice(1)}? Existe um caminho mais direto.`
    : locale === "es"
      ? `${brief.product} existe para quien quiere ${benefit}. ¿${pain.charAt(0).toUpperCase() + pain.slice(1)}? Hay un camino más directo.`
      : `${brief.product} exists for those who want to ${benefit}. ${pain.charAt(0).toUpperCase() + pain.slice(1)}? There's a more direct path.`;

  const words = brief.topic || brief.product;
  const tags = words
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3)
    .map((w) => `#${w}`)
    .join(" ");

  return [
    `## ${hookLabel}`,
    hook,
    "",
    `## ${bodyLabel}`,
    body,
    "",
    `## ${ctaLabel}`,
    `- ${ctaText}`,
    "",
    `## ${hashtagsLabel}`,
    `- ${tags} #marketing #conteudo`,
    "",
    `## ${tipsLabel}`,
    `- ${locale === "pt" ? "Publique no horário de pico do seu público e responda os comentários da primeira hora." : locale === "es" ? "Publica en la hora pico de tu audiencia y responde los comentarios de la primera hora." : "Post during your audience's peak hours and reply to comments in the first hour."}`,
    `- ${locale === "pt" ? "Use trending sounds e salve o vídeo para testar no dia seguinte." : locale === "es" ? "Usa sonidos en tendencia y guarda el vídeo para probarlo al día siguiente." : "Use trending sounds and save the video to test it the next day."}`,
  ].join("\n");
}

/* ======================================================================
   GENERATION — ROTEIROS (Reels/Shorts)
   ====================================================================== */

function generateRoteirosLocal(ctx: GenerationContext): string {
  const { brief, classified, angle } = ctx;
  const locale = brief.locale;
  const pain = selectPainForBrief(classified, locale);
  const benefit = selectBenefit(classified, locale);
  const replacements = {
    product: brief.product,
    audience: brief.audience,
    topic: brief.topic || brief.product,
    pain,
    painLower: pain,
    benefit,
    benefitLower: benefit,
    differentiator: brief.differentiator || "",
    cta: brief.cta || "",
  };

  const hook = selectTemplate(angle.hookPatterns[locale] || angle.hookPatterns.pt, replacements);
  const ctaText = brief.cta || selectTemplate(angle.ctaPatterns[locale] || angle.ctaPatterns.pt, replacements);

  const scenePrefix = locale === "pt" ? "CENA" : locale === "es" ? "ESCENA" : "SCENE";
  const labels = {
    hook: locale === "pt" ? "GANCHO" : locale === "es" ? "GANCHO" : "HOOK",
    dev: locale === "pt" ? "DESENVOLVIMENTO" : locale === "es" ? "DESARROLLO" : "DEVELOPMENT",
    cta: "CTA",
  };

  const scriptLabel = locale === "pt" ? "ROTEIRO" : locale === "es" ? "GUION" : "SCRIPT";
  const captionLabel = locale === "pt" ? "LEGENDA SUGERIDA" : locale === "es" ? "LEYENDA SUGERIDA" : "SUGGESTED CAPTION";
  const audioLabel = locale === "pt" ? "TRILHA / ÁUDIO" : locale === "es" ? "PISTA / AUDIO" : "MUSIC / AUDIO";
  const editorLabel = locale === "pt" ? "PARA O EDITOR" : locale === "es" ? "PARA EL EDITOR" : "FOR THE EDITOR";

  const duration = brief.platform || "30";

  const development = locale === "pt"
    ? `${brief.product} ${benefit}. Sem enrolação, direto ao ponto.`
    : locale === "es"
      ? `${brief.product} ${benefit}. Sin vueltas, directo al grano.`
      : `${brief.product} ${benefit}. No fluff, straight to the point.`;

  return [
    `## ${scriptLabel} · ${duration}s`,
    `[${scenePrefix} · 0:00–0:04] ${labels.hook} — ${hook}`,
    `[${scenePrefix} · 0:04–0:${parseInt(duration) > 30 ? "20" : "14"}] ${labels.dev} — ${development}`,
    `[${scenePrefix} · 0:${parseInt(duration) > 30 ? "20" : "14"}–0:${parseInt(duration) > 30 ? "40" : "24"}] ${labels.dev} — ${locale === "pt" ? "O que muda com isso no dia a dia." : locale === "es" ? "Lo que cambia con esto a diario." : "What changes in daily life with this."}`,
    `[${scenePrefix} · 0:${parseInt(duration) > 30 ? "40" : "24"}–${duration}] ${labels.cta} — ${ctaText} →`,
    "",
    `## ${captionLabel}`,
    `- ${hook} ${ctaText} →`,
    "",
    `## ${audioLabel}`,
    `- ${locale === "pt" ? "Trilha leve e crescente; comece no silêncio na primeira cena." : locale === "es" ? "Pista ligera y creciente; empieza en silencio en la primera escena." : "Light, building track; start in silence on the first scene."}`,
    "",
    `## ${editorLabel}`,
    `- ${locale === "pt" ? "Legendas automáticas ativadas, texto centralizado e marca visível nos últimos 3 segundos." : locale === "es" ? "Subtítulos automáticos activados, texto centrado y marca visible en los últimos 3 segundos." : "Auto captions on, centered text and brand visible in the last 3 seconds."}`,
  ].join("\n");
}

/* ======================================================================
   GENERATION — EMAILS
   ====================================================================== */

function generateEmailsLocal(ctx: GenerationContext): string {
  const { brief, classified, angle } = ctx;
  const locale = brief.locale;
  const pain = selectPainForBrief(classified, locale);
  const benefit = selectBenefit(classified, locale);
  const replacements = {
    product: brief.product,
    audience: brief.audience,
    company: brief.company || "",
    pain,
    painLower: pain,
    benefit,
    benefitLower: benefit,
    differentiator: brief.differentiator || "",
    cta: brief.cta || "",
  };

  const hook = selectTemplate(angle.hookPatterns[locale] || angle.hookPatterns.pt, replacements);
  const ctaText = brief.cta || selectTemplate(angle.ctaPatterns[locale] || angle.ctaPatterns.pt, replacements);

  const subjectsLabel = locale === "pt" ? "3 ASSUNTOS PARA TESTAR" : locale === "es" ? "3 ASUNTOS PARA PROBAR" : "3 SUBJECT LINES TO TEST";
  const preheaderLabel = locale === "pt" ? "PRÉ-HEADER" : locale === "es" ? "PREHEADER" : "PREHEADER";
  const bodyLabel = locale === "pt" ? "CORPO DO E-MAIL" : locale === "es" ? "CUERPO DEL CORREO" : "EMAIL BODY";

  const greeting = brief.recipient
    ? `${locale === "pt" ? "Oi" : locale === "es" ? "Hola" : "Hi"}, ${brief.recipient}!`
    : `${locale === "pt" ? "Olá" : locale === "es" ? "Hola" : "Hello"}!`;

  const opener = locale === "pt"
    ? `Quero ser direto com você: `
    : locale === "es"
      ? `Seré directo contigo: `
      : `Let me be direct with you: `;

  const body = `${opener}${brief.product} ${benefit}. ${pain.charAt(0).toUpperCase() + pain.slice(1)}? Existe um caminho mais prático. ${brief.differentiator ? `E o diferencial: ${brief.differentiator}.` : ""}`;

  const offerLine = brief.offer
    ? `${locale === "pt" ? "E tem mais:" : locale === "es" ? "Y hay más:" : "And there's more:"} ${brief.offer}.`
    : "";

  return [
    `## ${subjectsLabel}`,
    `- ${brief.company ? `[${brief.company}] ` : ""}${brief.product} — ${benefit}`,
    `- ${locale === "pt" ? "Uma ideia para você" : locale === "es" ? "Una idea para ti" : "An idea for you"}`,
    `- ${locale === "pt" ? "3 motivos para abrir este e-mail" : locale === "es" ? "3 razones para abrir este correo" : "3 reasons to open this email"}`,
    "",
    `## ${preheaderLabel}`,
    `${benefit}.`,
    "",
    `## ${bodyLabel}`,
    greeting,
    "",
    body,
    "",
    offerLine || (locale === "pt" ? "Nesta edição, incluímos um bônus exclusivo." : locale === "es" ? "En esta edición, incluimos un bono exclusivo." : "In this edition, we included an exclusive bonus."),
    "",
    `${locale === "pt" ? "É só clicar no botão abaixo." : locale === "es" ? "Solo haz clic en el botón de abajo." : "Just click the button below."}`,
    "",
    `- ${ctaText} →`,
    "",
    `${brief.company ? `${locale === "pt" ? "Equipe" : locale === "es" ? "Equipo" : "The"} ${brief.company}` : ""}`,
  ].join("\n");
}

/* ======================================================================
   VALIDATION
   ====================================================================== */

interface ValidationResult {
  passed: boolean;
  issues: string[];
}

function validateCopy(output: string, brief: Brief, classified: ClassifiedBrief): ValidationResult {
  const issues: string[] = [];
  const lowerOutput = output.toLowerCase();

  // 1. Check audience is not literally copied into headlines
  const audienceLower = brief.audience.toLowerCase();
  if (audienceLower.length > 20) {
    // Check if audience appears verbatim in headlines section
    const headlineSection = output.split("## ")[1] || output.split("## ")[2] || "";
    if (headlineSection.toLowerCase().includes(audienceLower.slice(0, 40))) {
      issues.push("AUDIENCE_LITERALLY_COPIED: audience appears verbatim in headlines");
    }
  }

  // 2. Check objective is not treated as customer desire
  const objectivePhrases: Record<string, string[]> = {
    vendas: ["converter interesse em vendas", "convert interest into sales", "convertir el interés en ventas"],
    leads: ["gerar leads qualificados", "generate qualified leads", "generar leads calificados"],
    cliques: ["atrair cliques", "attract clicks", "atraer clics"],
  };
  const objPhrases = objectivePhrases[brief.goal] || [];
  for (const phrase of objPhrases) {
    if (lowerOutput.includes(phrase.toLowerCase())) {
      issues.push(`OBJECTIVE_AS_DESIRE: "${phrase}" appears as if it were customer desire`);
    }
  }

  // 3. Check for unsupported claims (basic patterns)
  const claimPatterns = [
    /\d+%\s*(de\s+)?(aumento|increase|crescimento|result|ganho)/i,
    /comprovad[oa]|proven|comprobado/i,
    /milhares de|thousands of|miles de/i,
    /certificad[oa]|certified|certificado/i,
  ];
  for (const pattern of claimPatterns) {
    if (pattern.test(output) && !Object.values(brief).some((v) => v && pattern.test(v))) {
      issues.push(`UNSUPPORTED_CLAIM: pattern "${pattern.source}" found but not in briefing`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}

function fixValidationIssues(output: string, issues: string[], brief: Brief, locale: Locale): string {
  let fixed = output;

  // If audience was literally copied into headlines, the issue is noted
  // but we can't fix it retroactively without regenerating
  // The engine should avoid this in the first place

  // If objective appeared as desire, try to remove the offending phrase
  const objectivePhrases: Record<string, string[]> = {
    vendas: ["converter interesse em vendas", "convert interest into sales", "convertir el interés en ventas"],
    leads: ["gerar leads qualificados", "generate qualified leads", "generar leads calificados"],
  };
  const phrases = objectivePhrases[brief.goal] || [];
  for (const phrase of phrases) {
    if (fixed.toLowerCase().includes(phrase.toLowerCase())) {
      // Replace with a benefit-oriented phrase
      const replacement = locale === "pt"
        ? "alcançar seus objetivos"
        : locale === "es"
          ? "alcanzar tus objetivos"
          : "reach your goals";
      fixed = fixed.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), replacement);
    }
  }

  return fixed;
}

/* ======================================================================
   FACT GUARD — CLAIM VALIDATION
   ======================================================================

   Differentiates between:
   - STRATEGIC KNOWLEDGE (frameworks, angles, patterns → can be used freely)
   - PRODUCT FACTS (only if present in the briefing)

   Any factual claim about the product that cannot be traced to the briefing
   is either removed or reformulated as a possibility/potential benefit.
   ====================================================================== */

interface BriefFacts {
  tokens: string[];
  rawFields: string[];
}

function extractBriefFacts(brief: Brief): BriefFacts {
  const fields = [
    brief.product,
    brief.audience,
    brief.differentiator,
    brief.offer,
    brief.deadline,
    brief.cta,
    brief.company,
    brief.topic,
    brief.goal,
  ].filter((x): x is string => !!x);

  const tokens = fields
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  return { tokens, rawFields: fields };
}

interface FactGuardPattern {
  regex: RegExp;
  type: string;
  fixable: boolean;
  rephrase: Record<Locale, string>;
}

const FACT_GUARD_PATTERNS: FactGuardPattern[] = [
  // --- Market claims ---
  {
    regex: /o mercado (valoriza|est[aá] pedindo|reconhece|procura|busca|quer|precisa)/i,
    type: "MARKET_CLAIM",
    fixable: true,
    rephrase: {
      pt: "profissionais com essa habilidade se destacam",
      en: "professionals with this skill stand out",
      es: "los profesionales con esta habilidad destacan",
    },
  },
  {
    regex: /the market (values|is asking for|recognizes|seeks|wants|needs)/i,
    type: "MARKET_CLAIM",
    fixable: true,
    rephrase: {
      pt: "profissionais com essa habilidade se destacam",
      en: "professionals with this skill stand out",
      es: "los profesionales con esta habilidad destacan",
    },
  },
  {
    regex: /el mercado (valoriza|est[aá] pidiendo|reconoce|busca|quiere|necesita)/i,
    type: "MARKET_CLAIM",
    fixable: true,
    rephrase: {
      pt: "profissionais com essa habilidade se destacam",
      en: "professionals with this skill stand out",
      es: "los profesionales con esta habilidad destacan",
    },
  },

  // --- Statistics / percentages ---
  {
    regex: /\d+%\s*(de\s+)?(aumento|increase|crescimento|result|ganho|reduction|redu[çc][ãa]o|melhoria|improvement)/i,
    type: "STATISTIC",
    fixable: true,
    rephrase: {
      pt: "pode ajudar a melhorar resultados",
      en: "can help improve results",
      es: "puede ayudar a mejorar resultados",
    },
  },
  {
    regex: /ctr\s*(superior|maior|higher|better|mejor)/i,
    type: "METRIC_CLAIM",
    fixable: true,
    rephrase: {
      pt: "resultados mais relevantes",
      en: "more relevant results",
      es: "resultados más relevantes",
    },
  },

  // --- Specific outcomes not in briefing ---
  {
    regex: /transform[aã]o?\s+(em|into|en)\s+(um|uma|an|el|la)\s+(analista|especialista|profissional|expert|líder|manager|developer|programador|engenheiro)/i,
    type: "SPECIFIC_OUTCOME",
    fixable: true,
    rephrase: {
      pt: "desenvolver uma nova habilidade profissional",
      en: "develop a new professional skill",
      es: "desarrollar una nueva habilidad profesional",
    },
  },

  // --- Specific features not in briefing ---
  {
    regex: /dashboard\s+(automatizado|autom[aá]tico|inteligente|personalizado)/i,
    type: "FEATURE_CLAIM",
    fixable: true,
    rephrase: {
      pt: "ferramentas que simplificam seu dia a dia",
      en: "tools that simplify your daily routine",
      es: "herramientas que simplifican tu día a día",
    },
  },
  {
    regex: /relat[oó]rios?\s+(automatizados?|inteligentes?|em\s+tempo\s+real)/i,
    type: "FEATURE_CLAIM",
    fixable: true,
    rephrase: {
      pt: "informações organizadas de forma prática",
      en: "information organized practically",
      es: "información organizada de forma práctica",
    },
  },

  // --- Specific results ---
  {
    regex: /reduz\s+(erros?|falhas?|perdas?|desperd[ií]cios?)/i,
    type: "RESULT_CLAIM",
    fixable: true,
    rephrase: {
      pt: "pode ajudar a evitar problemas comuns",
      en: "can help avoid common issues",
      es: "puede ayudar a evitar problemas comunes",
    },
  },
  {
    regex: /aumenta\s+(a\s+)?(produtividade|efici[eê]ncia|receita|lucro|faturamento|vendas|results)/i,
    type: "RESULT_CLAIM",
    fixable: true,
    rephrase: {
      pt: "pode contribuir para melhores resultados",
      en: "can contribute to better results",
      es: "puede contribuir a mejores resultados",
    },
  },

  // --- Invented proof ---
  {
    regex: /comprovad[oa]|comprobado|proven|estudos?\s+mostram|research\s+show|est[aá]\s+comprovado/i,
    type: "INVENTED_PROOF",
    fixable: false,
    rephrase: { pt: "", en: "", es: "" },
  },
  {
    regex: /milhares?\s+de|thousands?\s+of|miles?\s+de/i,
    type: "INVENTED_PROOF",
    fixable: false,
    rephrase: { pt: "", en: "", es: "" },
  },
  {
    regex: /depoimentos?|testimonials?|testimonios?/i,
    type: "INVENTED_PROOF",
    fixable: false,
    rephrase: { pt: "", en: "", es: "" },
  },
  {
    regex: /certificad[oa]|certified|certificado/i,
    type: "INVENTED_CREDENTIAL",
    fixable: false,
    rephrase: { pt: "", en: "", es: "" },
  },
];

function isClaimSupportedByBrief(
  claimText: string,
  facts: BriefFacts,
): boolean {
  const claimLower = claimText.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  if (claimLower.length === 0) return true;

  const overlap = claimLower.filter((w) => facts.tokens.includes(w));
  return overlap.length / claimLower.length >= 0.3;
}

function removeClaim(text: string, regex: RegExp): string {
  let result = text;
  const match = result.match(regex);
  if (!match) return result;

  const escapedSource = regex.source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sentenceRegex = new RegExp(
    `[^.!?]*${escapedSource}[^.!?]*[.!?]`,
    "gi",
  );
  const sentenceMatch = result.match(sentenceRegex);
  if (sentenceMatch && sentenceMatch.length > 0) {
    for (const s of sentenceMatch) {
      result = result.replace(s, "");
    }
  } else {
    result = result.replace(regex, "");
  }

  result = result.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1");
  return result;
}

function rephraseClaim(
  text: string,
  regex: RegExp,
  rephrase: Record<Locale, string>,
  locale: Locale,
): string {
  const replacement = rephrase[locale] || rephrase.pt;
  if (!replacement) return removeClaim(text, regex);
  return text.replace(regex, replacement);
}

function validateAndGuardClaims(
  output: string,
  brief: Brief,
  _classified: ClassifiedBrief,
): string {
  const facts = extractBriefFacts(brief);
  let guarded = output;

  for (const pattern of FACT_GUARD_PATTERNS) {
    const match = guarded.match(pattern.regex);
    if (!match) continue;

    const matchedText = match[0];

    if (isClaimSupportedByBrief(matchedText, facts)) {
      continue;
    }

    if (pattern.fixable && Object.values(pattern.rephrase).some((v) => v)) {
      guarded = rephraseClaim(guarded, pattern.regex, pattern.rephrase, brief.locale);
    } else {
      guarded = removeClaim(guarded, pattern.regex);
    }
  }

  guarded = guardStrategySection(guarded, brief, facts);
  guarded = guardTipSection(guarded, brief);

  return guarded;
}

function guardStrategySection(
  output: string,
  brief: Brief,
  _facts: BriefFacts,
): string {
  const lines = output.split("\n");
  const strategyStart = lines.findIndex((l) =>
    /^##\s+(ESTRAT[ÉE]GIA|STRATEGY|ESTRATEGIA)/i.test(l),
  );
  if (strategyStart === -1) return output;

  const strategyEnd = lines.findIndex(
    (l, i) => i > strategyStart && /^##\s+/.test(l),
  );
  const endIdx = strategyEnd === -1 ? lines.length : strategyEnd;

  const allowedPatterns = [
    /objetivo:|goal:|objetivo:/i,
    /p[uú]blico:|audience:|p[uú]blico:/i,
    /tom:|tone:|tono:/i,
    /formato:|format:|formato:/i,
    /framework:/i,
  ];

  const guardedLines = lines.slice(strategyStart, endIdx).filter((line) => {
    if (/^##\s+/.test(line)) return true;
    if (line.trim() === "") return true;
    return allowedPatterns.some((p) => p.test(line));
  });

  return [
    ...lines.slice(0, strategyStart),
    ...guardedLines,
    ...lines.slice(endIdx),
  ].join("\n");
}

function guardTipSection(
  output: string,
  brief: Brief,
): string {
  const lines = output.split("\n");
  const tipStart = lines.findIndex((l) =>
    /^##\s+(DICA|TIP|CONSEJO)/i.test(l),
  );
  if (tipStart === -1) return output;

  const tipEnd = lines.findIndex(
    (l, i) => i > tipStart && /^##\s+/.test(l),
  );
  const endIdx = tipEnd === -1 ? lines.length : tipEnd;

  const tipLines = lines.slice(tipStart, endIdx);
  for (const pattern of FACT_GUARD_PATTERNS) {
    const tipText = tipLines.join(" ");
    if (pattern.regex.test(tipText)) {
      const genericTip = brief.locale === "pt"
        ? "- Foque no benefício principal nos primeiros segundos e mantenha o CTA visível."
        : brief.locale === "es"
          ? "- Enfócate en el beneficio principal en los primeros segundos y mantén el CTA visible."
          : "- Focus on the main benefit in the first few seconds and keep the CTA visible.";
      return [
        ...lines.slice(0, tipStart),
        `## ${tipLines[0].replace(/^##\s+/, "")}`,
        genericTip,
        ...lines.slice(endIdx),
      ].join("\n");
    }
  }

  return output;
}

/* ======================================================================
   MAIN ENTRY POINT
   ====================================================================== */

/**
 * Generate copy locally using the Knowledge Base.
 * This is the fallback engine that runs when Gemini is unavailable.
 *
 * Flow: Brief → Classify → Select Strategy → Generate → Validate → Output
 */
export function generateLocal(
  template: string,
  values: Record<string, string>,
  locale: Locale,
): { text: string; usedKB: boolean } {
  // 1. Build brief from values
  const brief: Brief = {
    template,
    product: values.product?.trim() || "",
    audience: values.audience?.trim() || values.topic?.trim() || "",
    goal: values.goal?.trim() || "vendas",
    tone: values.tone?.trim() || "persuasivo",
    locale,
    differentiator: values.differentiator?.trim(),
    cta: values.cta?.trim(),
    topic: values.topic?.trim(),
    platform: values.platform?.trim(),
    company: values.company?.trim(),
    offer: values.offer?.trim(),
    deadline: values.deadline?.trim(),
    recipient: values.recipient?.trim(),
  };

  // 2. Classify
  const classified = classifyBrief(brief);

  // 3. Select strategy
  const framework = selectFramework(classified);
  const angle = selectAngle(classified, framework);

  // 4. Build generation context
  const ctx: GenerationContext = {
    brief,
    classified,
    framework,
    angle,
    headlinePatterns: angle.headlinePatterns[locale] || angle.headlinePatterns.pt,
    hookPatterns: angle.hookPatterns[locale] || angle.hookPatterns.pt,
    ctaPatterns: angle.ctaPatterns[locale] || angle.ctaPatterns.pt,
    bodyRules: framework.rules[locale] || framework.rules.pt,
    avoidRules: framework.avoid[locale] || framework.avoid.pt,
  };

  // 5. Generate based on template
  let output: string;
  switch (template) {
    case "meta-ads":
      output = generateMetaAdsLocal(ctx);
      break;
    case "legendas":
      output = generateLegendasLocal(ctx);
      break;
    case "roteiros":
      output = generateRoteirosLocal(ctx);
      break;
    case "emails":
      output = generateEmailsLocal(ctx);
      break;
    default:
      output = generateMetaAdsLocal(ctx);
  }

  // 6. Validate
  const validation = validateCopy(output, brief, classified);
  if (!validation.passed) {
    output = fixValidationIssues(output, validation.issues, brief, locale);
  }

  // 7. Fact Guard — validate and sanitize unsupported claims
  output = validateAndGuardClaims(output, brief, classified);

  return { text: output, usedKB: true };
}
