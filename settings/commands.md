# 1. Comandos de configuração em projeto existente ou inicial

## 1.1 Instalação do ESLint + Prettier para Vue 3 e TypeScript

```
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier @eslint/js globals typescript typescript-eslint
```

> Esse comando já instala todos os pacotes necessários para ambos os formatadores e suporte a TypeScript.

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

## 1.2 Instalação do commitlint + Husky

```
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

## 1.3 Arquivos de configuração

Os arquivos de configuração padronizados estão disponíveis no repositório de configurações:

- [ESLint (.eslintrc.cjs)](https://github.com/gersonfribeiro/dev-configurations/tree/main/settings)
- [Prettier (prettier.config.cjs)](https://github.com/gersonfribeiro/dev-configurations/tree/main/settings)
- [commitlint (commitlint.config.cjs)](https://github.com/gersonfribeiro/dev-configurations/tree/main/settings)
- [EditorConfig (.editorconfig)](https://github.com/gersonfribeiro/dev-configurations/tree/main/settings)
- [VSCode Settings](https://github.com/gersonfribeiro/dev-configurations/tree/main/settings)
