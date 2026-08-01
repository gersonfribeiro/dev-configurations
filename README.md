# dev-configurations

**Repositório de referência para configuração de novos projetos.**

Na prática, é o lugar onde eu mantenho anotado:

- Os comandos de setup que eu vou esquecer se não escrever
- O padrão de `config/` que deu trabalho descobrir
- As diretrizes dos agentes de IA que uso em todos os projetos
- Os arquivos de configuração que eu copio quando crio um boilerplate novo

---

## O que tem aqui

```text
dev-configurations/
├── agents/             ← Diretrizes, skills e contexto para agentes de IA
├── settings/           ← Padrões de configuração de ferramentas + comandos de setup
├── snippets/           ← Trechos de código reutilizáveis
├── prompts/            ← Instruções reutilizáveis para automação
└── docs/               ← Convenções arquiteturais e boas práticas
```

## Como usar

Cada projeto de verdade (os boilers, os apps) tem seus próprios arquivos de configuração dentro de um diretório `config/` local. Este repositório serve como **consulta** na hora de criar ou atualizar esses arquivos.

1. Vai criar um projeto novo? Consulta `settings/commands.md` para os comandos de instalação.
2. Vai estruturar as configurações? Consulta `settings/configuracoes-ferramentas.md` para o padrão de organização.
3. Vai configurar um backend Java com Maven? Consulta `settings/configuracoes-backend-java.md` para o fluxo de qualidade, commits e releases.
4. Vai configurar o agente de IA? Os guidelines estão em `agents/`.
