# CopyForge — Estratégia de Preços & Posicionamento para o Mercado Internacional

**Preparado para:** lançamento internacional (EUA como mercado prioritário)
**Base:** produto funcional, IA Gemini integrada, estética terminal, mercado brasileiro validado
**Status:** implementado no produto (ver `src/convex/packs.ts` e `/plans`)

---

## 1. Nova tabela de preços em USD (precificação independente)

**Princípio:** conversão direta de R$→US$ estaria errada (R$19 ≈ US$3,40 — um preço que *sinalizaria baixa qualidade* no mercado americano). A precificação americana é por valor, não por custo: uma copy de anúncio profissional custa US$20–100 no mercado. O Gemini torna o custo marginal quase zero (≈ US$0,002–0,005 por copy gerada), então a margem é de ~95%+ em qualquer preço desta tabela — o preço é uma decisão de *posicionamento*, não de matemática.

### Tabela implementada — modelo híbrido (assinatura + créditos com rollover)

| Tier | Mensal | Anual (2 meses grátis)* | Créditos/mês | Rollover máx. | Custo por copy | Público |
|---|---|---|---|---|---|---|
| **Free** | US$ 0 | — | 25 (boas-vindas) | — | — | Avaliação |
| **Starter** | **US$ 9** | US$ 7,50/mo (US$ 90/ano) | 100 | 500 | US$ 0,09 | Freelancers, solopreneurs |
| **Pro** ⭐ | **US$ 19** | US$ 15,83/mo (US$ 190/ano) | 300 | 1.500 | US$ 0,06 | Growth marketers, criadores |
| **Studio** | **US$ 39** | US$ 32,50/mo (US$ 390/ano) | 900 | 4.500 | US$ 0,04 | Times pequenos, agências iniciantes |
| **Agency** | **US$ 99** | US$ 82,50/mo (US$ 990/ano) | 2.500 | 10.000 | US$ 0,04 | Agências (5 seats + API) |
| **Enterprise** | Custom | — | Volume | — | — | Corporativo (SSO, SLA, SOC2) |

\* Desconto anual de 16,7% = padrão da indústria ("pague 10 meses, leve 12" — praticado por Slack, Zoom, HubSpot).

**Top-ups avulsos (um pagamento, créditos sem expiração):** Brasil continua em BRL (R$19/50 · R$39/120 · R$69/250 · R$99/400) e internacional em USD (US$5/50 · US$12/120 · US$22/250 · US$32/400) — preserva a psicologia "pré-pago" validada no Brasil, para picos de demanda.

### Racional dos números

| Fator | Dado de mercado | Decisão do CopyForge |
|---|---|---|
| Entrada de mercado | Anyword US$49 · Jasper US$69 · Copy.ai US$24–29 | **US$9** — ponto de preço "impulso", 2–7x mais barato que os líderes |
| Âncora principal | Jasper Pro US$59–69 | **US$19** — preço de varejo americano de "ferramenta de trabalho", fácil de aprovar |
| Percepção de valor | Freelancer cobra US$20–100/copy | US$0,06/copy exibido é um argumento de venda **absurdo de bom** |
| Margem | Custo Gemini ≈ US$0,003/copy | ~97% de margem bruta mesmo no tier mais barato |

---

## 2. Posicionamento de marca

**Recomendação: MANTER a estética terminal — e transformá-la no diferencial central.**

### Por quê

- **O mercado de IA de copy está saturado de clones visualmente idênticos** (gradientes roxo/rosa, avatares sorridentes). O terminal é a única identidade memorável da categoria — é a diferença entre "mais uma ferramenta de IA" e "uma ferramenta feita por quem entende de performance".
- **Rima com o público-alvo:** growth marketers e criadores de conteúdo vivem em ferramentas "dev-like" (Notion, Linear, Vercel). A estética terminal sinaliza *precisão*, *velocidade* e *sem bullshit* — exatamente a promessa de valor.
- **É honesta:** a cópia do produto é literalmente "rodar um comando e receber output". A interface espelha a experiência real.
- **Custo de migração:** você já tem a marca, o logo (`>_`), o favicon e a UI. Mudar agora seria jogar fora ativo de marca já construído.

### Como reforçar

1. **Linguagem de marketing técnica:** "Prompt → Output → Optimize". `copyforge run meta-ads --tone persuasivo`.
2. **Prova social na mesma estética:** depoimentos formatados como logs de terminal (`✓ 1.200 copies geradas por @nome`).
3. **Vídeo demo em terminal:** 30s de uma copy sendo gerada em tempo real vale mais que 10 screenshots.
4. **Comunidade/DevRel:** templates de copy open-source, CLI de exemplo, presença em Product Hunt com o pitch "terminal para copywriting".

---

## 3. Modelo de monetização: híbrido (assinatura + créditos)

**Recomendação: ASSINATURA RECORRENTE como base + créditos com rollover + top-ups avulsos.**

### Por que assinatura (não só créditos pré-pagos)

| Critério | Só créditos pré-pagos | Assinatura + créditos |
|---|---|---|
| Receita | Volátil, sem recorrência | **MRR previsível** — o que investidores querem ver |
| Churn | "Some quando os créditos acabam" | Churn mensal é métrica gerenciável |
| Retenção | Baixo motivo para voltar | Rollover + créditos novos todo mês = hábito |
| LTV | Baixo (compras esporádicas) | Alto (recorrência) |
| Avaliação SaaS | Difícil (sem MRR) | **MRR × múltiplo** — padrão do mercado |

### Por que manter créditos no modelo

- **Psicologia "sem expiração"** já validada no Brasil — reduz atrito de compra.
- **Rollover (acúmulo até o teto do plano)** resolve a objeção "vou pagar e não usar" — créditos nunca "se perdem" (até o teto).
- **Top-ups avulsos** capturam picos de demanda sem migrar de plano.

### Implementado no produto

- **PayPal Subscriptions** (cobrança recorrente mensal/anual, com **1º mês grátis** como trial via billing cycle TRIAL de US$0) — criado via API no servidor, sem precisar criar planos no dashboard do PayPal.
- **Sincronização diária automática:** créditos do mês são liberados quando o PayPal confirma cada cobrança (`billing_info.last_payment.time`), com teto de rollover.
- **Top-ups** seguem no fluxo de Orders (pagamento único) com preço por mercado (BRL/USD).

---

## 4. Tier para agências/times (Agency)

**Preço: US$99/mês (US$990/ano) — 2.500 créditos/mês, rollover até 10.000.**

- **5 assentos de equipe** (colaboradores no mesmo workspace).
- **API de geração** — agências automatizam produção em escala (integração com ferramentas internas dos clientes).
- **Posicionamento:** o plano Agency de ferramentas de IA de ads custa US$249+/mês (AdCreative.ai Agency US$249/mês, Copy.ai Scale US$299/mês). **US$99 é o único abaixo de US$249 no mercado** — a "objeção preço" de agência some.
- **Upsell natural:** agência que assina Studio (US$39) e estoura 900 créditos/mês sobe para Agency sem fricção.

**Roadmap sugerido:** workspace com convites (assinatura já suporta o tier; UI de gerenciamento de assentos fica como próximo passo), chaves de API com rate-limit, webhooks de eventos.

---

## 5. Plano de trial/onboarding

**Recomendação: MANTER 25 créditos grátis SEM cartão + adicionar "1º mês grátis" do Pro na assinatura.**

| Mecânica | Prós | Contras |
|---|---|---|
| 25 créditos grátis, sem cartão (atual) | Atrito zero; usuário vê o valor em 1 minuto; conversão para pago via créditos acabando | Não gera receita nem dado de cartão |
| Trial de 7 dias sem cartão | Padrão B2B; data de expiração = urgência | Metade dos trials nunca ativa; usuário esquece |
| **1º mês grátis na assinatura (escolhido)** | Ativação imediata com cartão salvo; 30 dias para provar valor; churn pós-trial é do produto, não do onboarding | Exige cartão na entrada (fricção) |

**O combo escolhido:** o caminho sem fricção (25 grátis) continua para quem quer testar; quem já decide pagar entra com **1º mês grátis** (trial via PayPal, cobrança só no 2º mês). Os dois caminhos cobrem o funil completo.

### Onboarding de ativação (< 60 segundos)

1. Landing com demo interativa de terminal (typewriter) — já implementada.
2. Sign-up → 25 créditos → primeiro template pré-selecionado (Meta Ads).
3. Placeholder "brilhante" com briefing de exemplo → 1 clique gera a primeira copy.
4. Salvar, copiar, editar — a biblioteca vira o "segundo produto".

### Métricas de acompanhamento

- **Ativação:** % de contas que geram ≥ 1 copy nas primeiras 24h.
- **Conversão free→pago:** % de contas com créditos zerados que convertem (créditos acabando = gatilho).
- **Trial→pago:** conversão do 1º mês grátis após 30 dias.
- **MRR / ARPU / churn mensal** por tier.

---

## Resumo executivo (1 parágrafo)

> CopyForge entra no mercado internacional como **a ferramenta verticalizada de copy para performance marketing** — estética terminal como identidade única, 2–7x mais barato que os líderes, margem bruta ~97%. Monetização híbrida: **assinatura US$9–99/mês (MRR para investidores) + créditos com rollover (psicologia "sem expiração") + top-ups + tier Agency US$99 com API** — o único abaixo de US$249 no mercado. Onboarding: 25 créditos grátis sem cartão + 1º mês grátis na assinatura, com ativação em 60 segundos.
