/* ------------------------------------------------------------------ */
/* Locale type + UI strings (pt / en / es)                             */
/* ------------------------------------------------------------------ */

export type Locale = "pt" | "en" | "es";

export const LOCALES: Locale[] = ["pt", "en", "es"];

/** BCP-47 tags used by toLocaleDateString for each UI locale. */
export const DATE_LOCALE: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const pt = {
  /* Shared */
  "common.signout": "Sair",
  "common.cancel": "Cancelar",
  "common.delete": "Excluir",
  "common.copy": "Copiar texto",
  "common.copied": "Texto copiado para a área de transferência",
  "common.copyError": "Não foi possível copiar o texto.",

  /* Landing */
  "nav.signin": "entrar",
  "nav.signup": "começar grátis",
  "nav.templates": "templates",
  "nav.how": "como-funciona",
  "landing.badge": "copywriting assistido por IA · pt-BR",
  "landing.heroLine1": "Escreva copy",
  "landing.heroLine2": "que",
  "landing.heroAccent": "converte",
  "landing.heroSub":
    "O terminal de copywriting para criadores de conteúdo e profissionais de marketing. Gere anúncios, legendas, roteiros e e-mails em segundos — com o tom certo para cada marca.",
  "landing.feature1": "4 templates profissionais de copy",
  "landing.feature2": "25 créditos grátis para começar",
  "landing.feature3": "histórico ilimitado de textos salvos",
  "landing.ctaFree": "criar conta grátis",
  "landing.ctaTemplates": "ver templates",
  "landing.note": "// sem cartão de crédito · cancele quando quiser",
  "landing.termFooter": "1 copy gerada · 24 créditos restantes",
  "landing.sectionTemplatesLabel": "// ls ~/templates",
  "landing.sectionTemplatesTitle": "Templates prontos para cada canal",
  "landing.sectionTemplatesDesc":
    "Cada template tem campos próprios — público-alvo, tom de voz, objetivo — e devolve uma copy estruturada e pronta para publicar.",
  "landing.useTemplate": "usar template",
  "landing.sectionHowLabel": "// cat README.md",
  "landing.sectionHowTitle": "Do briefing à publicação em 3 passos",
  "landing.stepLabel": "passo {n}",
  "landing.step1.title": "Monte o briefing",
  "landing.step1.desc":
    "Preencha público-alvo, produto, tom de voz e objetivo no template escolhido.",
  "landing.step2.title": "Gere a copy",
  "landing.step2.desc":
    "A IA estrutura variações prontas para testar, com o tom exato que você pediu.",
  "landing.step3.title": "Salve e publique",
  "landing.step3.desc":
    "Copie, edite ou salve no histórico. Tudo organizado na sua biblioteca.",
  "landing.stat1.label": "copies geradas",
  "landing.stat2.label": "templates profissionais",
  "landing.stat3.label": "créditos grátis",
  "landing.stat4.label": "tempo no ar",
  "landing.ctaLabel": "// pronto para rodar?",
  "landing.ctaTitle": "Sua próxima copy está a um comando de distância",
  "landing.setup1": "criando conta gratuita … ok",
  "landing.setup2": "créditos de boas-vindas: +25",
  "landing.setup3": "sem cartão de crédito · cancele quando quiser",
  "landing.ctaButton": "criar conta grátis",
  "landing.hasAccount": "já tem conta?",
  "landing.ctaSignin": "entrar →",
  "landing.footerTagline":
    "feito para criadores de conteúdo e profissionais de marketing",
  "landing.heroText": `$ copyforge run meta-ads --tone persuasivo
› modelo de linguagem … ok
› público: criadores de conteúdo … ok
› tom: persuasivo … ok

## 3 TÍTULOS (A/B/C)
- Copy que converte, sem chute.
- Para criadores que querem vender mais.
- Chega de perder tempo — copyforge resolve.

## TEXTO PRINCIPAL
Escreva anúncios, legendas e e-mails que
vendem — em segundos, não em horas.

## CTA
- Comece grátis hoje →`,

  /* Auth */
  "auth.loginTitle": "$ copyforge login",
  "auth.sending": "enviando…",
  "auth.subtitle":
    "// entre com seu e-mail para acessar o painel. Novos usuários ganham 25 créditos grátis.",
  "auth.emailLabel": "email",
  "auth.emailPlaceholder": "nome@exemplo.com",
  "auth.sendCode": "enviar código →",
  "auth.sendingCode": "enviando código…",
  "auth.or": "ou",
  "auth.guest": "continuar como visitante",
  "auth.verifyTitle": "verificar e-mail",
  "auth.verifySubtitle":
    "// enviamos um código de 6 dígitos para {email}",
  "auth.verifyCode": "verificar código →",
  "auth.verifying": "verificando…",
  "auth.notReceived": "não recebeu?",
  "auth.tryAgain": "tentar novamente",
  "auth.errSend": "Falha ao enviar o código de verificação. Tente novamente.",
  "auth.errOtp": "O código de verificação digitado está incorreto.",
  "auth.errGuest": "Falha ao entrar como visitante: {msg}",

  /* Dashboard */
  "dash.gen": "gerador",
  "dash.lib": "biblioteca",
  "dash.credits": "{n} créditos",
  "dash.title": "Painel de controle",
  "dash.subtitle": "resumo do plano e das suas gerações",
  "dash.statCredits": "créditos restantes",
  "dash.statCreditsHint": "{pct}% do plano starter",
  "dash.statSaved": "textos salvos",
  "dash.statSavedHint": "no seu histórico",
  "dash.statGenerated": "gerações feitas",
  "dash.statGeneratedHint": "copies geradas com o copyforge",
  "dash.libTitle": "Meus Textos Salvos",
  "dash.libSubtitle": "visualize, filtre e exclua as copies do seu histórico",
  "dash.rechargeOk": "+10 créditos adicionados (demo)",
  "dash.rechargeErr": "Não foi possível recarregar.",

  /* Sidebar */
  "side.templates": "templates",
  "side.library": "biblioteca",
  "side.saved": "Meus Textos Salvos",
  "side.admin": "Painel Admin",
  "side.plan": "plano: starter",
  "side.credits": "● {credits}/{total} créditos",
  "side.creditsLow": "⚠ créditos baixos — recarregue abaixo",
  "side.creditsInfo": "// 1 crédito = 1 copy gerada",
  "side.recharge": "+10 créditos (demo)",

  /* Generator */
  "gen.req": "Preencha o campo \"{field}\".",
  "gen.errCredits": "Créditos esgotados — recarregue para continuar gerando.",
  "gen.errStart": "Não foi possível iniciar a geração.",
  "gen.errSave": "Não foi possível salvar.",
  "gen.savedOk": "Copy salva no histórico",
  "gen.editEmpty": "A copy não pode ficar vazia.",
  "gen.editApplied": "Alterações aplicadas",
  "gen.logModel": "conectando à IA Gemini … ok",
  "gen.logBrief": "briefing: {name} … ok",
  "gen.logAudience": "público-alvo: {value} … ok",
  "gen.logTone": "tom de voz: {tone} … ok",
  "gen.logStructure": "estruturando saída …",
  "gen.processing": "Processando…",
  "gen.another": "Gerar outra copy",
  "gen.generate": "Gerar copy",
  "gen.required": "obrigatório",
  "gen.select": "Selecione…",
  "gen.emptyMain": "sua copy aparecerá aqui",
  "gen.emptySubPre": "preencha o briefing e rode",
  "gen.emptySubPost": "para começar.",
  "gen.recent": "histórico recente",
  "gen.seeAll": "ver todos →",
  "gen.recentEmpty":
    "nenhuma copy salva ainda — gere um texto e clique em {action}.",
  "gen.warnLow": "créditos esgotados — recarregue no menu lateral para continuar.",
  "gen.creditNote": "1 crédito por geração · {n} disponíveis",
  "gen.calc": "calculando…",
  "gen.termBrief": "copyforge — brief · {path}",
  "gen.termOutput": "copyforge — output",

  /* Output actions */
  "out.waiting": "// aguardando saída…",
  "out.apply": "Aplicar alterações",
  "out.saved": "Salvo no histórico",
  "out.save": "Salvar no histórico",
  "out.edit": "Editar",
  "out.rewrite": "Reescrever",
  "out.engineTip": "Gerado pela IA Gemini",

  /* Library */
  "lib.search": "buscar por título ou conteúdo…",
  "lib.all": "Todos os templates",
  "lib.count": "// {visible} de {total} texto(s) salvo(s)",
  "lib.emptyNone": "nenhuma copy salva ainda",
  "lib.emptyFilter": "nada encontrado com esses filtros",
  "lib.first": "gerar primeira copy →",
  "lib.deleted": "Copy excluída",
  "lib.deleteErr": "Não foi possível excluir.",
  "lib.confirmTitle": "Excluir copy?",
  "lib.confirmDesc":
    "\"{title}\" será removida permanentemente do seu histórico. Essa ação não pode ser desfeita.",

  /* Admin */
  "admin.open": "painel administrativo",
  "admin.title": "painel administrativo",
  "admin.subtitle": "usuários, créditos e acesso da plataforma",
  "admin.back": "voltar ao painel",
  "admin.role": "cargo",
  "admin.roleAdmin": "admin",
  "admin.roleUser": "usuário",
  "admin.roleMember": "membro",
  "admin.anon": "visitante",
  "admin.blocked": "bloqueado",
  "admin.search": "buscar por nome, e-mail ou id…",
  "admin.noUsers": "nenhum usuário encontrado",
  "admin.statUsers": "usuários",
  "admin.statUsersHint": "contas na plataforma",
  "admin.statCopies": "textos salvos",
  "admin.statCopiesHint": "copies na biblioteca",
  "admin.statCredits": "créditos emitidos",
  "admin.statCreditsHint": "total distribuído",
  "admin.statGenerated": "gerações",
  "admin.statGeneratedHint": "copies geradas por todos",
  "admin.colUser": "usuário",
  "admin.colEmail": "e-mail",
  "admin.colCredits": "créditos",
  "admin.colSaved": "salvos",
  "admin.colGenerated": "gerações",
  "admin.colActions": "ações",
  "admin.you": "(você)",
  "admin.creditsDelta": "ajuste",
  "admin.apply": "aplicar",
  "admin.promote": "tornar admin",
  "admin.demote": "remover admin",
  "admin.block": "bloquear",
  "admin.unblock": "desbloquear",
  "admin.creditsOk": "Créditos atualizados",
  "admin.roleOk": "Cargo atualizado",
  "admin.blockOk": "Acesso atualizado",
  "admin.err": "Ação não autorizada",
  "admin.selfRoleErr": "Você não pode alterar seu próprio cargo",
  "admin.selfBlockErr": "Você não pode bloquear seu próprio acesso",
  "admin.claimTitle": "configurar administrador",
  "admin.claimDesc":
    "Nenhum administrador existe ainda. Como primeiro usuário, você pode reivindicar o cargo de dono da plataforma.",
  "admin.claimBtn": "tornar-me admin",
  "admin.claimedOk": "Você agora é administrador!",
  "admin.deniedTitle": "acesso restrito",
  "admin.deniedDesc": "Esta área é exclusiva para administradores.",
  "admin.loading": "carregando…",
} as const;

export type UiStrings = { [K in keyof typeof pt]: string };

const en: UiStrings = {
  /* Shared */
  "common.signout": "Sign out",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.copy": "Copy text",
  "common.copied": "Text copied to clipboard",
  "common.copyError": "Could not copy the text.",

  /* Landing */
  "nav.signin": "sign in",
  "nav.signup": "start free",
  "nav.templates": "templates",
  "nav.how": "how-it-works",
  "landing.badge": "AI-powered copywriting · EN",
  "landing.heroLine1": "Write copy",
  "landing.heroLine2": "that",
  "landing.heroAccent": "converts",
  "landing.heroSub":
    "The copywriting terminal for content creators and marketing professionals. Generate ads, captions, scripts and emails in seconds — with the right tone for every brand.",
  "landing.feature1": "4 professional copy templates",
  "landing.feature2": "25 free credits to start",
  "landing.feature3": "unlimited saved-text history",
  "landing.ctaFree": "create free account",
  "landing.ctaTemplates": "view templates",
  "landing.note": "// no credit card · cancel anytime",
  "landing.termFooter": "1 copy generated · 24 credits left",
  "landing.sectionTemplatesLabel": "// ls ~/templates",
  "landing.sectionTemplatesTitle": "Ready-made templates for every channel",
  "landing.sectionTemplatesDesc":
    "Each template has its own fields — target audience, tone of voice, goal — and returns structured copy that's ready to publish.",
  "landing.useTemplate": "use template",
  "landing.sectionHowLabel": "// cat README.md",
  "landing.sectionHowTitle": "From brief to publication in 3 steps",
  "landing.stepLabel": "step {n}",
  "landing.step1.title": "Build the brief",
  "landing.step1.desc":
    "Fill in target audience, product, tone of voice and goal in the template you chose.",
  "landing.step2.title": "Generate the copy",
  "landing.step2.desc":
    "The AI structures ready-to-test variations with the exact tone you asked for.",
  "landing.step3.title": "Save and publish",
  "landing.step3.desc":
    "Copy, edit or save to history. Everything organized in your library.",
  "landing.stat1.label": "copies generated",
  "landing.stat2.label": "professional templates",
  "landing.stat3.label": "free credits",
  "landing.stat4.label": "uptime",
  "landing.ctaLabel": "// ready to run?",
  "landing.ctaTitle": "Your next copy is one command away",
  "landing.setup1": "creating free account … ok",
  "landing.setup2": "welcome credits: +25",
  "landing.setup3": "no credit card · cancel anytime",
  "landing.ctaButton": "create free account",
  "landing.hasAccount": "already have an account?",
  "landing.ctaSignin": "sign in →",
  "landing.footerTagline":
    "made for content creators and marketing professionals",
  "landing.heroText": `$ copyforge run meta-ads --tone persuasivo
› language model … ok
› audience: content creators … ok
› tone: persuasive … ok

## 3 HEADLINES (A/B/C)
- Copy that converts, no guesswork.
- For creators who want to sell more.
- Stop wasting time — copyforge delivers.

## MAIN TEXT
Write ads, captions and emails that
sell — in seconds, not hours.

## CTA
- Start free today →`,

  /* Auth */
  "auth.loginTitle": "$ copyforge login",
  "auth.sending": "sending…",
  "auth.subtitle":
    "// enter your email to access the dashboard. New users get 25 free credits.",
  "auth.emailLabel": "email",
  "auth.emailPlaceholder": "name@example.com",
  "auth.sendCode": "send code →",
  "auth.sendingCode": "sending code…",
  "auth.or": "or",
  "auth.guest": "continue as guest",
  "auth.verifyTitle": "verify email",
  "auth.verifySubtitle": "// we sent a 6-digit code to {email}",
  "auth.verifyCode": "verify code →",
  "auth.verifying": "verifying…",
  "auth.notReceived": "didn't get it?",
  "auth.tryAgain": "try again",
  "auth.errSend": "Failed to send the verification code. Please try again.",
  "auth.errOtp": "The verification code you entered is incorrect.",
  "auth.errGuest": "Failed to sign in as guest: {msg}",

  /* Dashboard */
  "dash.gen": "generator",
  "dash.lib": "library",
  "dash.credits": "{n} credits",
  "dash.title": "Control panel",
  "dash.subtitle": "summary of your plan and generations",
  "dash.statCredits": "remaining credits",
  "dash.statCreditsHint": "{pct}% of the starter plan",
  "dash.statSaved": "saved texts",
  "dash.statSavedHint": "in your history",
  "dash.statGenerated": "generations",
  "dash.statGeneratedHint": "copies generated with copyforge",
  "dash.libTitle": "My Saved Texts",
  "dash.libSubtitle": "view, filter and delete copies from your history",
  "dash.rechargeOk": "+10 credits added (demo)",
  "dash.rechargeErr": "Could not recharge.",

  /* Sidebar */
  "side.templates": "templates",
  "side.library": "library",
  "side.saved": "My Saved Texts",
  "side.admin": "Admin Panel",
  "side.plan": "plan: starter",
  "side.credits": "● {credits}/{total} credits",
  "side.creditsLow": "⚠ low credits — recharge below",
  "side.creditsInfo": "// 1 credit = 1 generated copy",
  "side.recharge": "+10 credits (demo)",

  /* Generator */
  "gen.req": "Please fill in \"{field}\".",
  "gen.errCredits": "Out of credits — recharge to keep generating.",
  "gen.errStart": "Could not start generation.",
  "gen.errSave": "Could not save.",
  "gen.savedOk": "Copy saved to history",
  "gen.editEmpty": "The copy cannot be empty.",
  "gen.editApplied": "Changes applied",
  "gen.logModel": "connecting to Gemini AI … ok",
  "gen.logBrief": "briefing: {name} … ok",
  "gen.logAudience": "target audience: {value} … ok",
  "gen.logTone": "tone of voice: {tone} … ok",
  "gen.logStructure": "structuring output …",
  "gen.processing": "Processing…",
  "gen.another": "Generate another copy",
  "gen.generate": "Generate copy",
  "gen.required": "required",
  "gen.select": "Select…",
  "gen.emptyMain": "your copy will appear here",
  "gen.emptySubPre": "fill in the briefing and run",
  "gen.emptySubPost": "to start.",
  "gen.recent": "recent history",
  "gen.seeAll": "view all →",
  "gen.recentEmpty":
    "no copies saved yet — generate a text and click {action}.",
  "gen.warnLow": "out of credits — recharge from the sidebar to continue.",
  "gen.creditNote": "1 credit per generation · {n} available",
  "gen.calc": "calculating…",
  "gen.termBrief": "copyforge — brief · {path}",
  "gen.termOutput": "copyforge — output",

  /* Output actions */
  "out.waiting": "// waiting for output…",
  "out.apply": "Apply changes",
  "out.saved": "Saved to history",
  "out.save": "Save to history",
  "out.edit": "Edit",
  "out.rewrite": "Rewrite",
  "out.engineTip": "Generated by Gemini AI",

  /* Library */
  "lib.search": "search by title or content…",
  "lib.all": "All templates",
  "lib.count": "// {visible} of {total} saved text(s)",
  "lib.emptyNone": "no copies saved yet",
  "lib.emptyFilter": "nothing found with these filters",
  "lib.first": "generate first copy →",
  "lib.deleted": "Copy deleted",
  "lib.deleteErr": "Could not delete.",
  "lib.confirmTitle": "Delete copy?",
  "lib.confirmDesc":
    "\"{title}\" will be permanently removed from your history. This action cannot be undone.",

  /* Admin */
  "admin.open": "admin panel",
  "admin.title": "admin panel",
  "admin.subtitle": "platform users, credits and access",
  "admin.back": "back to dashboard",
  "admin.role": "role",
  "admin.roleAdmin": "admin",
  "admin.roleUser": "user",
  "admin.roleMember": "member",
  "admin.anon": "guest",
  "admin.blocked": "blocked",
  "admin.search": "search by name, email or id…",
  "admin.noUsers": "no users found",
  "admin.statUsers": "users",
  "admin.statUsersHint": "accounts on the platform",
  "admin.statCopies": "saved texts",
  "admin.statCopiesHint": "copies in the library",
  "admin.statCredits": "credits issued",
  "admin.statCreditsHint": "total distributed",
  "admin.statGenerated": "generations",
  "admin.statGeneratedHint": "copies generated by everyone",
  "admin.colUser": "user",
  "admin.colEmail": "email",
  "admin.colCredits": "credits",
  "admin.colSaved": "saved",
  "admin.colGenerated": "generated",
  "admin.colActions": "actions",
  "admin.you": "(you)",
  "admin.creditsDelta": "adjust",
  "admin.apply": "apply",
  "admin.promote": "make admin",
  "admin.demote": "remove admin",
  "admin.block": "block",
  "admin.unblock": "unblock",
  "admin.creditsOk": "Credits updated",
  "admin.roleOk": "Role updated",
  "admin.blockOk": "Access updated",
  "admin.err": "Action not authorized",
  "admin.selfRoleErr": "You cannot change your own role",
  "admin.selfBlockErr": "You cannot block your own access",
  "admin.claimTitle": "set up administrator",
  "admin.claimDesc":
    "No administrator exists yet. As the first user, you can claim the owner role of the platform.",
  "admin.claimBtn": "make me admin",
  "admin.claimedOk": "You are now an administrator!",
  "admin.deniedTitle": "restricted access",
  "admin.deniedDesc": "This area is for administrators only.",
  "admin.loading": "loading…",
};

const es: UiStrings = {
  /* Shared */
  "common.signout": "Salir",
  "common.cancel": "Cancelar",
  "common.delete": "Eliminar",
  "common.copy": "Copiar texto",
  "common.copied": "Texto copiado al portapapeles",
  "common.copyError": "No se pudo copiar el texto.",

  /* Landing */
  "nav.signin": "entrar",
  "nav.signup": "empezar gratis",
  "nav.templates": "plantillas",
  "nav.how": "como-funciona",
  "landing.badge": "copywriting con IA · ES",
  "landing.heroLine1": "Escribe copy",
  "landing.heroLine2": "que",
  "landing.heroAccent": "convierte",
  "landing.heroSub":
    "La terminal de copywriting para creadores de contenido y profesionales de marketing. Genera anuncios, leyendas, guiones y correos en segundos — con el tono adecuado para cada marca.",
  "landing.feature1": "4 plantillas profesionales de copy",
  "landing.feature2": "25 créditos gratis para empezar",
  "landing.feature3": "historial ilimitado de textos guardados",
  "landing.ctaFree": "crear cuenta gratis",
  "landing.ctaTemplates": "ver plantillas",
  "landing.note": "// sin tarjeta de crédito · cancela cuando quieras",
  "landing.termFooter": "1 copy generada · 24 créditos restantes",
  "landing.sectionTemplatesLabel": "// ls ~/templates",
  "landing.sectionTemplatesTitle": "Plantillas listas para cada canal",
  "landing.sectionTemplatesDesc":
    "Cada plantilla tiene sus propios campos — público objetivo, tono de voz, objetivo — y devuelve un copy estructurado y listo para publicar.",
  "landing.useTemplate": "usar plantilla",
  "landing.sectionHowLabel": "// cat README.md",
  "landing.sectionHowTitle": "Del briefing a la publicación en 3 pasos",
  "landing.stepLabel": "paso {n}",
  "landing.step1.title": "Arma el briefing",
  "landing.step1.desc":
    "Completa público objetivo, producto, tono de voz y objetivo en la plantilla elegida.",
  "landing.step2.title": "Genera el copy",
  "landing.step2.desc":
    "La IA estructura variaciones listas para probar, con el tono exacto que pediste.",
  "landing.step3.title": "Guarda y publica",
  "landing.step3.desc":
    "Copia, edita o guarda en el historial. Todo organizado en tu biblioteca.",
  "landing.stat1.label": "copies generadas",
  "landing.stat2.label": "plantillas profesionales",
  "landing.stat3.label": "créditos gratis",
  "landing.stat4.label": "tiempo en línea",
  "landing.ctaLabel": "// ¿listo para ejecutar?",
  "landing.ctaTitle": "Tu próximo copy está a un comando de distancia",
  "landing.setup1": "creando cuenta gratuita … ok",
  "landing.setup2": "créditos de bienvenida: +25",
  "landing.setup3": "sin tarjeta de crédito · cancela cuando quieras",
  "landing.ctaButton": "crear cuenta gratis",
  "landing.hasAccount": "¿ya tienes cuenta?",
  "landing.ctaSignin": "entrar →",
  "landing.footerTagline":
    "hecho para creadores de contenido y profesionales de marketing",
  "landing.heroText": `$ copyforge run meta-ads --tone persuasivo
› modelo de lenguaje … ok
› público: creadores de contenido … ok
› tono: persuasivo … ok

## 3 TÍTULOS (A/B/C)
- Copy que convierte, sin adivinar.
- Para creadores que quieren vender más.
- Basta de perder tiempo — copyforge resuelve.

## TEXTO PRINCIPAL
Escribe anuncios, leyendas y correos que
vendan — en segundos, no en horas.

## CTA
- Empieza gratis hoy →`,

  /* Auth */
  "auth.loginTitle": "$ copyforge login",
  "auth.sending": "enviando…",
  "auth.subtitle":
    "// ingresa tu correo para acceder al panel. Los nuevos usuarios reciben 25 créditos gratis.",
  "auth.emailLabel": "correo",
  "auth.emailPlaceholder": "nombre@ejemplo.com",
  "auth.sendCode": "enviar código →",
  "auth.sendingCode": "enviando código…",
  "auth.or": "o",
  "auth.guest": "continuar como invitado",
  "auth.verifyTitle": "verificar correo",
  "auth.verifySubtitle": "// enviamos un código de 6 dígitos a {email}",
  "auth.verifyCode": "verificar código →",
  "auth.verifying": "verificando…",
  "auth.notReceived": "¿no lo recibiste?",
  "auth.tryAgain": "intentar de nuevo",
  "auth.errSend": "No se pudo enviar el código de verificación. Inténtalo de nuevo.",
  "auth.errOtp": "El código de verificación ingresado es incorrecto.",
  "auth.errGuest": "No se pudo iniciar sesión como invitado: {msg}",

  /* Dashboard */
  "dash.gen": "generador",
  "dash.lib": "biblioteca",
  "dash.credits": "{n} créditos",
  "dash.title": "Panel de control",
  "dash.subtitle": "resumen de tu plan y tus generaciones",
  "dash.statCredits": "créditos restantes",
  "dash.statCreditsHint": "{pct}% del plan starter",
  "dash.statSaved": "textos guardados",
  "dash.statSavedHint": "en tu historial",
  "dash.statGenerated": "generaciones",
  "dash.statGeneratedHint": "copies generados con copyforge",
  "dash.libTitle": "Mis Textos Guardados",
  "dash.libSubtitle": "visualiza, filtra y elimina copies de tu historial",
  "dash.rechargeOk": "+10 créditos añadidos (demo)",
  "dash.rechargeErr": "No se pudo recargar.",

  /* Sidebar */
  "side.templates": "plantillas",
  "side.library": "biblioteca",
  "side.saved": "Mis Textos Guardados",
  "side.admin": "Panel Admin",
  "side.plan": "plan: starter",
  "side.credits": "● {credits}/{total} créditos",
  "side.creditsLow": "⚠ créditos bajos — recarga abajo",
  "side.creditsInfo": "// 1 crédito = 1 copy generado",
  "side.recharge": "+10 créditos (demo)",

  /* Generator */
  "gen.req": "Completa el campo \"{field}\".",
  "gen.errCredits": "Créditos agotados — recarga para seguir generando.",
  "gen.errStart": "No se pudo iniciar la generación.",
  "gen.errSave": "No se pudo guardar.",
  "gen.savedOk": "Copy guardado en el historial",
  "gen.editEmpty": "El copy no puede estar vacío.",
  "gen.editApplied": "Cambios aplicados",
  "gen.logModel": "conectando a la IA Gemini … ok",
  "gen.logBrief": "briefing: {name} … ok",
  "gen.logAudience": "público objetivo: {value} … ok",
  "gen.logTone": "tono de voz: {tone} … ok",
  "gen.logStructure": "estructurando salida …",
  "gen.processing": "Procesando…",
  "gen.another": "Generar otro copy",
  "gen.generate": "Generar copy",
  "gen.required": "obligatorio",
  "gen.select": "Selecciona…",
  "gen.emptyMain": "tu copy aparecerá aquí",
  "gen.emptySubPre": "completa el briefing y ejecuta",
  "gen.emptySubPost": "para empezar.",
  "gen.recent": "historial reciente",
  "gen.seeAll": "ver todos →",
  "gen.recentEmpty":
    "aún no hay copies guardados — genera un texto y haz clic en {action}.",
  "gen.warnLow": "créditos agotados — recarga desde el menú lateral para continuar.",
  "gen.creditNote": "1 crédito por generación · {n} disponibles",
  "gen.calc": "calculando…",
  "gen.termBrief": "copyforge — brief · {path}",
  "gen.termOutput": "copyforge — output",

  /* Output actions */
  "out.waiting": "// esperando salida…",
  "out.apply": "Aplicar cambios",
  "out.saved": "Guardado en el historial",
  "out.save": "Guardar en el historial",
  "out.edit": "Editar",
  "out.rewrite": "Reescribir",
  "out.engineTip": "Generado por la IA Gemini",

  /* Library */
  "lib.search": "buscar por título o contenido…",
  "lib.all": "Todas las plantillas",
  "lib.count": "// {visible} de {total} texto(s) guardado(s)",
  "lib.emptyNone": "aún no hay copies guardados",
  "lib.emptyFilter": "no se encontró nada con estos filtros",
  "lib.first": "generar primer copy →",
  "lib.deleted": "Copy eliminado",
  "lib.deleteErr": "No se pudo eliminar.",
  "lib.confirmTitle": "¿Eliminar copy?",
  "lib.confirmDesc":
    "\"{title}\" se eliminará permanentemente de tu historial. Esta acción no se puede deshacer.",

  /* Admin */
  "admin.open": "panel de administración",
  "admin.title": "panel de administración",
  "admin.subtitle": "usuarios, créditos y acceso de la plataforma",
  "admin.back": "volver al panel",
  "admin.role": "rol",
  "admin.roleAdmin": "admin",
  "admin.roleUser": "usuario",
  "admin.roleMember": "miembro",
  "admin.anon": "invitado",
  "admin.blocked": "bloqueado",
  "admin.search": "buscar por nombre, correo o id…",
  "admin.noUsers": "no se encontraron usuarios",
  "admin.statUsers": "usuarios",
  "admin.statUsersHint": "cuentas en la plataforma",
  "admin.statCopies": "textos guardados",
  "admin.statCopiesHint": "copies en la biblioteca",
  "admin.statCredits": "créditos emitidos",
  "admin.statCreditsHint": "total distribuido",
  "admin.statGenerated": "generaciones",
  "admin.statGeneratedHint": "copies generados por todos",
  "admin.colUser": "usuario",
  "admin.colEmail": "correo",
  "admin.colCredits": "créditos",
  "admin.colSaved": "guardados",
  "admin.colGenerated": "generados",
  "admin.colActions": "acciones",
  "admin.you": "(tú)",
  "admin.creditsDelta": "ajuste",
  "admin.apply": "aplicar",
  "admin.promote": "hacer admin",
  "admin.demote": "quitar admin",
  "admin.block": "bloquear",
  "admin.unblock": "desbloquear",
  "admin.creditsOk": "Créditos actualizados",
  "admin.roleOk": "Rol actualizado",
  "admin.blockOk": "Acceso actualizado",
  "admin.err": "Acción no autorizada",
  "admin.selfRoleErr": "No puedes cambiar tu propio rol",
  "admin.selfBlockErr": "No puedes bloquear tu propio acceso",
  "admin.claimTitle": "configurar administrador",
  "admin.claimDesc":
    "Aún no existe ningún administrador. Como primer usuario, puedes reclamar el rol de dueño de la plataforma.",
  "admin.claimBtn": "hacerme admin",
  "admin.claimedOk": "¡Ahora eres administrador!",
  "admin.deniedTitle": "acceso restringido",
  "admin.deniedDesc": "Esta área es exclusiva para administradores.",
  "admin.loading": "cargando…",
};

export const STRINGS: Record<Locale, UiStrings> = { pt, en, es };
