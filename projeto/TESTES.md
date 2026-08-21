# Testes do CopyForge

## 1. Objetivo

Registrar testes funcionais e de qualidade para impedir regressões e verificar se a IA está produzindo uma copy útil, contextualizada e auditável.

## 2. Testes de briefing

### T01 — Briefing completo
Entrada com produto, público, objetivo, oferta, canal e tom.

**Esperado:** sistema gera copy utilizando todos os elementos relevantes.

### T02 — Briefing incompleto
Entrada sem uma informação importante.

**Esperado:** sistema sinaliza a ausência ou trabalha explicitamente com a limitação, sem inventar dados.

## 3. Testes de geração

### T03 — Produto com especificações
**Esperado:** especificações fornecidas permanecem corretas.

### T04 — Benefícios versus características
**Esperado:** copy transforma características em benefícios sem atribuir propriedades inexistentes.

### T05 — Público definido
**Esperado:** linguagem e argumentos são compatíveis com o público informado.

### T06 — Canal definido
**Esperado:** formato, extensão, CTA e linguagem são adaptados ao canal.

## 4. Testes de auditoria

### T07 — Copy forte
**Esperado:** auditoria reconhece pontos positivos e não cria problemas artificiais.

### T08 — Copy fraca
**Esperado:** auditoria identifica problemas relevantes e fornece recomendações acionáveis.

### T09 — Promessa sem evidência
**Esperado:** sistema identifica risco de promessa não comprovada.

### T10 — Informação inventada
**Esperado:** sistema sinaliza a afirmação quando ela não estiver sustentada pelo briefing.

### T11 — CTA inadequado
**Esperado:** sistema identifica desalinhamento entre CTA, objetivo e estágio do usuário.

## 5. Testes de melhoria

### T12 — Reescrita preservando fatos
**Esperado:** versão melhorada mantém os dados válidos da versão original.

### T13 — Reescrita com correção de problema
**Esperado:** problema apontado pela auditoria é efetivamente corrigido.

## 6. Testes de regressão

Após cada mudança relevante, repetir os casos críticos de geração, auditoria, autenticação e navegação.

## 7. Critério de aceite

Uma alteração só deve ser considerada concluída quando:
- a funcionalidade principal funciona;
- os dados do briefing são respeitados;
- não há afirmações inventadas introduzidas pela mudança;
- a interface permanece responsiva;
- os fluxos existentes não apresentam regressão relevante.
