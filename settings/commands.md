# Comandos de Setup

Guia rápido de instalação e configuração de ferramentas para projetos novos ou existentes.  
Este documento é parte do [repositório centralizador de configurações](../README.md) — use os comandos abaixo para replicar o mesmo padrão em qualquer projeto.

---

## ESLint + Prettier (Vue 3 + TypeScript)

```bash
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier @eslint/js globals typescript typescript-eslint
```

### Scripts para o `package.json`

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write"
  }
}
```

### Uso

| Comando | Ação |
|---|---|
| `npm run lint` | Verifica problemas de lint |
| `npm run lint:fix` | Corrige automaticamente problemas corrigíveis |
| `npm run format` | Formata todo o projeto com Prettier |

---

## commitlint + Husky

```bash
npm install -D @commitlint/cli @commitlint/config-conventional husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### Scripts para o `package.json`

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

> O script `prepare` é executado automaticamente após `npm install` para ativar os hooks do Husky.

---

## Arquivos de configuração

Os arquivos de configuração padronizados estão neste repositório:

- [`eslint.config.js`](./) — Configuração do ESLint
- [`prettier.config.cjs`](./) — Configuração do Prettier
- [`commitlint.config.cjs`](./) — Configuração do commitlint
- [`.editorconfig`](./) — Configuração do EditorConfig
- [`.vscode/settings.json`](./) — Configurações do VS Code
