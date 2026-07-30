# Guia de Configuração — Frontend (Vue 3 + Vite)

Este documento faz parte do [repositório centralizador de configurações](../README.md).  
Ele documenta o padrão utilizado para mover arquivos de configuração de ferramentas (ESLint, Prettier, commitlint, Docker, etc.) para um diretório `config/` dentro de cada projeto, mantendo a centralização sem quebrar o funcionamento individual.

Em vez de cada projeto ter seus próprios arquivos de configuração soltos na raiz, todos passam a seguir a mesma estrutura — o que torna o setup previsível, a manutenção escalável e o versionamento das regras rastreável.

---

## Índice

1. [Estrutura Final](#1-estrutura-final)
2. [package.json](#2-packagejson)
3. [.vscode/settings.json](#3-vscodesettingsjson)
4. [.husky/commit-msg](#4-huskycommit-msg)
5. [config/Dockerfile](#5-configdockerfile)
6. [config/eslint.config.js](#6-configeslintconfigjs)
7. [config/prettier.config.cjs](#7-configprettierconfigcjs)
8. [config/commitlint.config.cjs](#8-configcommitlintconfigcjs)
9. [config/.versionrc.cjs](#9-configversionrccjs)
10. [Arquivos que NÃO podem ser movidos](#10-arquivos-que-não-podem-ser-movidos)
11. [docker-compose.yml](#11-docker-composeyml)

---

## 1. Estrutura Final

```text
infra/frontend/
├── config/                          ← Configurações centralizadas
│   ├── .dockerignore
│   ├── .versionrc.cjs
│   ├── commitlint.config.cjs
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── eslint.config.js
│   ├── nginx.conf
│   └── prettier.config.cjs
├── .husky/
│   └── commit-msg                   ← Atualizado com --config
├── .vscode/
│   └── settings.json                ← Atualizado com paths explícitos
├── package.json                     ← Atualizado (scripts + config pointers)
├── src/                             ← Código fonte (inalterado)
├── vite.config.ts                   ← Permanece na raiz
├── tsconfig.json                    ← Permanece na raiz
└── ...
```

> ⚠️ `.editorconfig` foi **removido** — a raiz `k6/.editorconfig` (com `root = true`) já cobre todo o repositório com as mesmas regras.

---

## 2. package.json

### Scripts alterados

```diff
- "lint": "eslint .",
+ "lint": "eslint --config config/eslint.config.js .",

- "lint:fix": "eslint . --fix",
+ "lint:fix": "eslint --config config/eslint.config.js . --fix",

- "release": "standard-version",
+ "release": "standard-version --config config/.versionrc.cjs",

- "generate-pwa-assets": "pwa-assets-generator",
+ "generate-pwa-assets": "pwa-assets-generator --config config/pwa-assets.config.ts",
```

**Por quê?** O ESLint (flat config), standard-version e o assets-generator procuram seus arquivos de configuração apenas na raiz do projeto. Com `--config` apontamos explicitamente para o novo local.

### Campo prettier adicionado

```diff
+ "prettier": "./config/prettier.config.cjs",
  "devDependencies": { ... }
```

**Por quê?** O Prettier usa cosmiconfig para encontrar sua configuração. O campo `"prettier"` no `package.json` com prefixo `./` diz exatamente onde está o arquivo. O prefixo `./` é obrigatório para evitar que o valor seja interpretado como nome de pacote npm.

---

## 3. .vscode/settings.json

```jsonc
{
  // ESLint 9+ Flat Config — caminho explícito via ESLint class API
  "eslint.options": {
    "overrideConfigFile": "config/eslint.config.js"
  },

  "eslint.validate": [
    "html",
    "css",
    "scss",
    "vue",
    "typescript",
    "javascript",
    "json",
    "jsonc",
    "cjs"
  ],

  // Executa correcoes automaticas do ESLint ao salvar, quando disponiveis.
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
  },

  // Prettier — caminho explícito para o arquivo de config
  "prettier.configPath": "config/prettier.config.cjs",

  // ... demais configurações
}
```

### Por quê cada campo?

| Campo                        | Função                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `overrideConfigFile`         | Caminho explicito para o `eslint.config.js` que não está mais na raiz                                  |
| `eslint.validate`            | Garante que o ESLint valide arquivos `.vue`, `.ts`, `.js`, `.html` e `.json`                           |
| `prettier.configPath`        | Caminho explícito para o `prettier.config.cjs` que não está mais na raiz                               |

### 🔄 Fluxo do Ctrl+S

1. ESLint auto-fix — corrige imports, naming conventions, etc.
2. Prettier formata — aspas simples, atributos por linha, indentação, etc.
3. Warnings/Errors aparecem no Problems panel do VS Code

---

## 4. .husky/commit-msg

```diff
- npx --no -- commitlint --edit "$1"
+ npx --no -- commitlint --config config/commitlint.config.cjs --edit "$1"
```

**Por quê?** O commitlint também procura o arquivo de configuração apenas na raiz. O `--config` aponta para o novo local.

---

## 5. config/Dockerfile

O Dockerfile agora está em `config/`. As instruções `COPY` que referenciam arquivos do projeto usam paths relativos ao **build context** (`infra/frontend/`), não ao Dockerfile:

```diff
- COPY nginx.conf /etc/nginx/conf.d/default.conf
+ COPY config/nginx.conf /etc/nginx/conf.d/default.conf

- COPY entrypoint.sh /entrypoint.sh
+ COPY config/entrypoint.sh /entrypoint.sh
```

As demais instruções permanecem inalteradas pois referenciam paths que existem no build context:

- `COPY package*.json ./` — ainda está na raiz do build context
- `COPY . .` — copia tudo

---

## 6. config/eslint.config.js

O arquivo `eslint.config.js` foi movido para `config/` **sem alteração de conteúdo interno**. Ele continua sendo um flat config do ESLint 9 que importa plugins e define regras.

A única diferença é que o ESLint (CLI e extensão VS Code) agora precisa ser explicitamente informado de sua localização via:

- `--config config/eslint.config.js` (CLI)
- `"eslint.configFile": "config/eslint.config.js"` (VS Code)

---

## 7. config/prettier.config.cjs

Movido sem alteração de conteúdo. O Prettier o encontra através do campo `"prettier": "./config/prettier.config.cjs"` no `package.json`.

---

## 8. config/commitlint.config.cjs

Movido sem alteração de conteúdo. O Husky o encontra através do `--config` no `.husky/commit-msg`.

---

## 9. config/.versionrc.cjs

Movido sem alteração de conteúdo. O standard-version o encontra através do `--config` no script `release` do `package.json`.

---

## 10. Arquivos que NÃO podem ser movidos

| Arquivo                                                      | Motivo                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.editorconfig`                                              | Editores (VS Code, WebStorm) sobem a árvore de diretórios a partir do arquivo sendo editado. Se estiver em `config/`, só arquivos dentro de `config/` seriam afetados. A raiz `k6/.editorconfig` cobre todo o repositório. |
| `.gitignore`                                                 | O Git procura `.gitignore` em cada diretório para determinar o escopo de arquivos ignorados. Mover para `config/` mudaria o escopo.                                                                                        |
| `.gitattributes`                                             | O Git lê este arquivo apenas na raiz do worktree.                                                                                                                                                                          |
| `.husky/`                                                    | O Husky espera a pasta `.husky/` na raiz do projeto (configurável via `core.hooksPath`, mas é a convenção padrão).                                                                                                         |
| `vite.config.ts`                                             | O Vite procura por `vite.config.ts` apenas na raiz.                                                                                                                                                                        |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | O TypeScript/Vue-TSC procura por `tsconfig.json` na raiz.                                                                                                                                                                  |

---

## 11. docker-compose.yml

Em `infra/docker/docker-compose.yml`:

```diff
  frontend:
    build:
      context: ../../infra/frontend
-     dockerfile: Dockerfile
+     dockerfile: config/Dockerfile
```

O `context` continua apontando para `infra/frontend/` (raiz do build context). O `dockerfile` agora aponta para `config/Dockerfile` dentro desse context.

---

## Backend (NestJS) — resumo

O `infra/backend/` seguiu o mesmo padrão, com adaptações para o ecossistema NestJS:

| Arquivo                    | Ajuste                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `package.json`             | `"lint": "eslint --config config/eslint.config.mjs ..."`                                |
| `config/eslint.config.mjs` | `project: './tsconfig.json'` (em vez de `projectService: true`), regras prettier inline |
| `config/tsconfig.json`     | `include: ["../src/**/*.ts"]`, `outDir: "../dist"`, `baseUrl: "../"`                    |
| `nest-cli.json`            | `tsConfigPath: "config/tsconfig.build.json"`                                            |

> ⚠️ Diferente do frontend, o backend manteve as regras do Prettier **inline** no `eslint.config.mjs` porque o `eslint-plugin-prettier` teve dificuldade em resolver o `.prettierrc` externo de dentro de `config/`.

---

## Sobre o .editorconfig

> **Não é possível colocar `.editorconfig` em `config/`.**

O EditorConfig funciona por **busca ascendente**: ao editar `src/views/HomeView.vue`, o editor procura `.editorconfig` em:

1. `src/views/` (não encontrado)
2. `src/` (não encontrado)
3. `infra/frontend/` — **aqui estava antes**
4. `infra/` (não encontrado)
5. `k6/` — **encontra o `root = true` e para**

Se o `.editorconfig` estivesse em `config/`, ele só seria encontrado ao editar arquivos dentro de `config/`. Por isso ele foi **removido** do frontend — o da raiz `k6/` já o substitui com as mesmas regras.
