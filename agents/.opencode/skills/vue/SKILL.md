---
name: vue
description: Use when working with Vue 3 components, Vuetify, Pinia stores, composables, or Vue-specific patterns including template structure, component design, and reactive state management.
---

# Skill: Vue 3 + Vuetify

## Role

Desenvolvedor Frontend especialista em Progressive Web Apps, Vue 3, Vuetify, TypeScript, SCSS e interfaces reativas.

## Stack

- Vue.js 3 com Composition API e `<script setup>`
- Vuetify
- TypeScript
- SCSS
- PWA com Service Workers
- Pinia
- Vue Router

## Estrutura do `<script setup>`

Utilize o snippet `vsetup` definido em `.vscode/vue-component.code-snippets`:

1. `// Types e Interfaces` com JSDoc `@property`
2. `defineProps` / `defineEmits`
3. `// Constantes`
4. `// Reativas - Model` (`defineModel`)
5. `// Reativas - Ref` (`ref`)
6. `// Computadas`
7. `// Funções`
8. `// Observadores`
9. `// Lifecycle Hooks`
10. `// Expose`

Quando houver apenas um tipo de reatividade, usar `// Reativas` (sem subcategoria).

## Props e emits

`defineProps` e `defineEmits` devem ficar logo abaixo dos seus respectivos types. Props antes de emits. Eventos devem representar intenções de negócio (`save`, `cancel`), não implementação (`clickButton`).

## Componentes

- Priorizar criação de componentes reutilizáveis.
- Componentes Base devem ser genéricos e não conhecer regras de negócio.
- Componentes reutilizáveis devem ter comentário curto de responsabilidade.

## Vuetify

- Priorizar componentes nativos do Vuetify antes de wrappers ou CSS estrutural próprio.
- Wrappers só quando encapsularem comportamento real (loading, permissões, defaults).
- Layout responsivo com `useDisplay`.
- Hotkeys com `useHotkey`, condicional para desktop.

## Layout

- `App.vue` mínimo (`v-app` + `RouterView`).
- Layout controla estrutura, responsividade e scroll macro.
- Scroll principal em `v-main`, não em `body`/`html`.

## SCSS

- Arquivo SCSS separado por componente, mesmo nome do `.vue`.
- Import via `<style src="./Componente.scss" scoped lang="scss">`.
- Scrollbars discretas com mixins reutilizáveis.

## Pinia

Stores contêm apenas estado compartilhado: preferências, tema, idioma, layout persistente, filtros globais, paginação compartilhada, micro cache. Não conhecem componentes, não chamam HTTP diretamente, não concentram regras de services.

## Composables

Contêm lógica reutilizável de estado/comportamento: preparar parâmetros, tratar erros, snackbar, redirect, loading, encapsular UX.

**Fluxo:** `Component → Store → Composable → Service`

## Performance

- Preferir `computed` a `watch`.
- Evitar computed encadeadas desnecessárias.
- `key` obrigatória em listas.
- Lazy loading para rotas e componentes pesados.

## Loading e lock

Toda requisição acionada pela UI deve ter lock visual para evitar disparos duplicados.

## PWA

Responsividade nativa, ícones no manifest, atenção a `icon`/`badge` em notificações web push.

## Navegação

- Itens de navegação derivados das rotas e metadados.
- Preferências de usuário em stores Pinia com persistência centralizada.
- Sem acesso direto a `localStorage` em componentes.
