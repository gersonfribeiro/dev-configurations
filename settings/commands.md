# Comandos de Setup

Guia rápido de instalação e configuração de ferramentas para projetos novos ou existentes.  
Este documento é parte do [repositório centralizador de configurações](../README.md) — use os comandos abaixo para replicar o mesmo padrão em qualquer projeto.

---

## ESLint + Prettier (Vue 3 + TypeScript)

```bash
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier @eslint/js globals typescript typescript-eslint eslint-plugin-jsdoc eslint-plugin-simple-import-sort
```

### Scripts do ESLint + Prettier (Vue 3 + TypeScript) para o `package.json`

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write"
  },
  "prettier": "./config/prettier.config.cjs"
}
```

### Uso

|       Comando       |                      Ação                      |
|---------------------|------------------------------------------------|
| `npm run lint`      | Verifica problemas de lint                     |
| `npm run lint:fix`  | Corrige automaticamente problemas corrigíveis  |
| `npm run format`    | Formata todo o projeto com Prettier            |

---

## commitlint + Husky

```bash
npm install -D @commitlint/cli @commitlint/config-conventional husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### Scripts do commitlint + Husky para o `package.json`

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

> O script `prepare` é executado automaticamente após `npm install` para ativar os hooks do Husky.

---

## Assets Generator

```bash
npm install -D @vite-pwa/assets-generator@^1.0.2
```

### Scripts para o `package.json`

```json
{
  "generate-pwa-assets": "pwa-assets-generator --config config/pwa-assets.config.ts"
}
```

---

## Arquivos de configuração

Os arquivos de configuração padronizados estão neste repositório:

- [`eslint.config.js`](./config/eslint.config.js) — Configuração do ESLint
- [`prettier.config.cjs`](./config/prettier.config.cjs) — Configuração do Prettier
- [`commitlint.config.cjs`](./config/commitlint.config.cjs) — Configuração do commitlint
- [`.editorconfig`](./.editorconfig) — Configuração do EditorConfig
- [`pwa-assets.config.ts`](./config/pwa-assets.config.ts) - Configuração do plugin para o assets generator
- [`.vscode/settings.json`](../settings/.vscode/settings.json) — Configurações do VS Code
