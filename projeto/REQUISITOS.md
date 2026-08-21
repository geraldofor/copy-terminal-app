# Requisitos do CopyForge

## 1. Requisitos funcionais

### RF01 — Briefing
O sistema deve receber produto/serviço, características, benefícios, público, objetivo, oferta, canal e tom.

### RF02 — Geração
O sistema deve gerar copy a partir do briefing e permitir múltiplas versões para comparação.

### RF03 — Auditoria
O sistema deve analisar uma copy existente ou recém-gerada e apresentar avaliação estruturada.

### RF04 — Critérios de auditoria
A análise deve considerar, conforme aplicável:
- clareza;
- proposta de valor;
- adequação ao público;
- força do benefício;
- especificidade;
- credibilidade/evidência;
- CTA;
- coerência entre promessa e oferta;
- adequação ao canal;
- riscos de exagero ou afirmações não comprovadas.

### RF05 — Melhoria
O sistema deve sugerir alterações justificadas e permitir gerar uma versão revisada.

### RF06 — Comparação
O usuário deve conseguir comparar versões de uma mesma copy e entender o motivo das diferenças.

### RF07 — Contexto
A auditoria deve considerar o briefing original sempre que disponível.

### RF08 — Histórico
O sistema deve permitir preservar trabalhos e versões de copy associados ao usuário, conforme o modelo de acesso adotado.

### RF09 — Autenticação
O produto já possui autenticação por Convex Auth, incluindo usuários anônimos e OTP por e-mail. As convenções existentes de autenticação devem ser preservadas.

### RF10 — Responsividade
A experiência deve funcionar em desktop e dispositivos móveis.

## 2. Requisitos não funcionais

- Manter compatibilidade com a stack atual.
- Evitar alterações desnecessárias na autenticação existente.
- Manter separação entre frontend, regras de negócio e backend.
- Garantir tratamento de estados de carregamento e erro.
- Utilizar toasts para feedback de ações quando apropriado.
- Evitar hardcode de regras que possam futuramente ser configuradas.
- Não expor chaves ou segredos no frontend.

## 3. Stack existente

O repositório utiliza Vite, TypeScript, React 19, React Router v7, Tailwind v4, shadcn/ui, Lucide, Convex, Convex Auth, Framer Motion e Three.js. O README atual também estabelece Bun como gerenciador de pacotes e a organização de páginas/componentes dentro de `src`.

## 4. Regras de qualidade

- A IA não deve tratar inferência como fato.
- Toda crítica deve ser explicável.
- A geração não deve apagar informações relevantes do briefing sem justificativa.
- O sistema deve privilegiar copy utilizável em contexto real, não apenas texto linguisticamente bonito.
