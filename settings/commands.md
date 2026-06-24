# Comandos de configuração em projeto existente ou inicial

### Instalação do ESLint + Prettier para Vue 3 e TS:
```
npm install -D eslint eslint-plugin-vue prettier eslint-config-prettier eslint-plugin-prettier @eslint/js globals typescript typescript-eslint
```
- Esse comando já faz toda a configuração da instalação de pacotes de ambos os formatadores e ainda adiciona a parte do typescript


### Considerando que os arquivos de [settings]('https://github.com/gersonfribeiro/dev-configurations/tree/main/settings') de ambos já estão configurados:
#### package.json
```
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write"
  }
}
```
##### Adicionando esses scripts de comandos ao arquivo, facilita o uso no projeto com o npm
- *Verificar problemas:* npm run lint;
- *Corrigir automaticamente:* npm run lint:fix;
- *Formatar todo o projeto:* npm run format;
