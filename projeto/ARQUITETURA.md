# Arquitetura do CopyForge

## 1. Visão geral

O CopyForge deve ser organizado em camadas, mantendo a interface desacoplada das regras de análise e das integrações de IA.

```text
Usuário
  ↓
Interface / Dashboard
  ↓
Briefing → Geração → Auditoria → Melhoria → Comparação
  ↓
Camada de regras e orquestração
  ↓
IA / provedores externos
  ↓
Persistência Convex
```

## 2. Frontend

Responsável por:
- briefing;
- editor de copy;
- resultados da geração;
- auditoria;
- comparação de versões;
- histórico;
- navegação e autenticação.

A organização deve seguir as convenções existentes: páginas em `src/pages`, componentes em `src/components` e componentes shadcn em `src/components/ui`.

## 3. Backend

O Convex permanece como backend e banco de dados. Queries e mutations devem cuidar da persistência e autorização; ações devem ser utilizadas quando houver integração externa.

A autenticação existente deve ser preservada conforme as regras documentadas no README.

## 4. Motor de Copy

O motor deve receber um objeto de briefing estruturado, e não apenas um prompt livre.

Exemplo conceitual:

```text
Briefing
├── produto
├── público
├── objetivo
├── oferta
├── canal
├── tom
├── diferenciais
├── evidências
└── restrições
```

## 5. Motor de Auditoria

A auditoria deve ser independente da geração. Ela recebe:
- briefing;
- copy;
- canal;
- objetivo;
- critérios de avaliação.

Saída conceitual:

```text
Auditoria
├── score/avaliação
├── pontos fortes
├── problemas
├── riscos
├── oportunidades
└── recomendações
```

## 6. Evidência e alucinação

Informações fornecidas pelo usuário devem ser tratadas como dados do briefing. Informações que não estejam presentes devem ser classificadas como inferência ou exigir validação, evitando que a IA invente especificações, benefícios ou provas.

## 7. IA

A arquitetura deve permitir trocar ou combinar provedores de IA sem acoplar a interface a um único fornecedor.

O prompt de sistema deve separar:
1. contexto;
2. regras;
3. dados do produto;
4. tarefa;
5. formato de saída;
6. critérios de validação.

## 8. Evolução

A arquitetura deve permitir futuramente:
- biblioteca de templates;
- presets por canal;
- testes A/B;
- pontuação histórica;
- equipes/workspaces;
- analytics;
- integrações de publicação;
- diferentes modelos de IA.
