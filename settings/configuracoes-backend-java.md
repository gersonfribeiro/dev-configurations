# Guia de Configuração - Backend Java (Maven)

Este documento faz parte do [repositório centralizador de configurações](../README.md).
Ele descreve uma proposta de ferramentas para projetos Java com Maven que oferece as garantias normalmente obtidas em projetos Node.js com ESLint, Prettier, commitlint, Husky e standard-version.

O objetivo não é adicionar `package.json` a um backend Java. Cada responsabilidade deve ser atendida pela ferramenta mais adequada ao ecossistema Java, pelo Git ou pela CI.

> Este é um guia de referência. Os arquivos e comandos descritos aqui só passam a valer em um projeto depois de serem adicionados e aprovados no próprio repositório.

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Equivalências com o frontend](#2-equivalências-com-o-frontend)
3. [Estrutura sugerida](#3-estrutura-sugerida)
4. [Maven Wrapper](#4-maven-wrapper)
5. [Spotless: formatação](#5-spotless-formatação)
6. [Checkstyle: regras de código](#6-checkstyle-regras-de-código)
7. [Git hooks nativos](#7-git-hooks-nativos)
8. [Conventional Commits](#8-conventional-commits)
9. [Validação local](#9-validação-local)
10. [CI de qualidade](#10-ci-de-qualidade)
11. [Release Please: versões e changelog](#11-release-please-versões-e-changelog)
12. [Fluxo diário](#12-fluxo-diário)
13. [Arquivos que devem permanecer na raiz](#13-arquivos-que-devem-permanecer-na-raiz)
14. [Roteiro de adoção](#14-roteiro-de-adoção)

---

## 1. Visão geral

Um projeto Maven já possui o mecanismo central para executar tarefas de build e qualidade: o ciclo de vida do Maven. A fase `verify` ocorre após compilação e testes, sendo o ponto adequado para verificações que devem impedir uma entrega inválida.

O conjunto proposto separa responsabilidades:

| Responsabilidade | Ferramenta | Onde executa |
| --- | --- | --- |
| Formatar código Java | Spotless | Máquina local e CI |
| Validar convenções de código | Checkstyle | Máquina local e CI |
| Validar mensagem de commit | Hook Git `commit-msg` | Máquina local |
| Impedir envio sem validação completa | Hook Git `pre-push` | Máquina local |
| Garantir qualidade sem depender dos hooks | GitHub Actions | CI |
| Calcular versão, atualizar changelog e criar release | Release Please | GitHub Actions |

Os hooks aceleram o feedback ao desenvolvedor. A CI é obrigatória porque hooks podem ser desabilitados com `--no-verify` ou não estar configurados em uma máquina nova.

---

## 2. Equivalências com o frontend

| Ecossistema Node.js | Ecossistema Java/Maven | Responsabilidade |
| --- | --- | --- |
| Prettier | Spotless | Formatar arquivos automaticamente e detectar formatação divergente |
| ESLint | Checkstyle | Validar padrões e regras estáticas de código |
| Husky | Git hooks nativos | Executar comandos em eventos do Git |
| commitlint | Hook `commit-msg` com regra Conventional Commits | Validar a mensagem de commit |
| `npm run lint` | `./mvnw verify` | Executar validações de qualidade |
| standard-version | Release Please | Gerar versão, changelog, tag e release a partir dos commits |
| `package.json` scripts | Maven Wrapper e `pom.xml` | Centralizar os comandos reproduzíveis do projeto |

---

## 3. Estrutura sugerida

```text
backend-java/
|-- .github/
|   `-- workflows/
|       |-- quality.yml                    # Build e verificações em PRs e pushes
|       `-- release-please.yml             # PR de release, tags e GitHub Releases
|-- .githooks/
|   |-- commit-msg                          # Valida Conventional Commits
|   |-- pre-commit                          # Validações rápidas antes do commit
|   `-- pre-push                            # mvnw verify antes do push
|-- .mvn/                                   # Maven Wrapper e extensões Maven
|-- config/
|   `-- checkstyle/
|       `-- checkstyle.xml                  # Regras Checkstyle do projeto
|-- scripts/
|   |-- configurar-git-hooks.ps1            # Bootstrap para Windows
|   `-- configurar-git-hooks.sh             # Bootstrap para macOS/Linux
|-- .release-please-manifest.json           # Última versão liberada por componente
|-- release-please-config.json              # Regras da automação de release
|-- CHANGELOG.md                            # Histórico publicado das mudanças
|-- pom.xml                                 # Build, dependências, plugins e versão
|-- mvnw                                    # Maven Wrapper para shell Unix
`-- mvnw.cmd                                # Maven Wrapper para Windows
```

O diretório `config/` é reservado para configurações que podem ser referenciadas explicitamente, como o XML do Checkstyle. Hooks e workflows têm locais definidos pelo Git e pelo GitHub, portanto permanecem na raiz.

---

## 4. Maven Wrapper

O Maven Wrapper é composto principalmente por `mvnw`, `mvnw.cmd` e `.mvn/wrapper/`. Ele baixa e usa a versão de Maven declarada pelo projeto, removendo a dependência de uma instalação global para as tarefas comuns.

### Comandos principais

| Plataforma | Comando | Ação |
| --- | --- | --- |
| Windows | `.\mvnw.cmd test` | Compila e executa os testes |
| Windows | `.\mvnw.cmd verify` | Executa testes e verificações de qualidade configuradas |
| Windows | `.\mvnw.cmd clean package` | Limpa e gera o artefato da aplicação |
| macOS/Linux | `./mvnw verify` | Executa testes e verificações de qualidade configuradas |

`verify` deve ser o comando oficial de validação completa do repositório. O mesmo comando executado localmente deve ser usado na CI.

---

## 5. Spotless: formatação

Spotless é o equivalente funcional do Prettier para esta finalidade. Ele compara os arquivos com um formato definido e também pode reformatá-los.

### O que resolve

- Indentação, espaços e quebras de linha consistentes.
- Formatação uniforme de código Java em qualquer IDE.
- Diferenças de formatação detectadas antes de uma PR.
- Correção automática, sem revisão manual de detalhes visuais.

### Comandos esperados

```powershell
# Verifica se o código já está no formato definido.
.\mvnw.cmd spotless:check

# Reescreve os arquivos no formato definido.
.\mvnw.cmd spotless:apply
```

O goal `spotless:check` deve ser ligado à fase `verify`. Assim, `mvnw verify` falha se alguém esquece de formatar o código.

### Decisão de padrão

Spotless precisa de um formatador Java, por exemplo `palantir-java-format` ou `google-java-format`. A escolha deve ser feita antes da primeira aplicação, pois ela reformata o código existente de uma única vez. O commit inicial de formatação deve ser separado de mudanças funcionais para manter o histórico revisável.

---

## 6. Checkstyle: regras de código

Checkstyle é a camada de regras que o formatador não cobre. Enquanto Spotless decide como o código é escrito visualmente, Checkstyle verifica convenções e práticas estruturais.

### O que pode validar

- Nomes de classes, interfaces, records, métodos e parâmetros.
- Imports inválidos ou não utilizados, conforme as regras selecionadas.
- Presença e formato de Javadoc em APIs públicas.
- Tamanho de métodos, complexidade e construções perigosas.
- Espaços, chaves e outras regras que não sejam cobertas pelo formatador escolhido.

### Convenções específicas do projeto

Antes de habilitar regras de nomenclatura, o `config/checkstyle/checkstyle.xml` deve refletir as convenções já estabelecidas:

| Elemento | Convenção |
| --- | --- |
| Classes | Prefixo `C`, como `CUsuarioService` |
| Interfaces | Prefixo `I`, como `IUsuarioRepository` |
| Records | Prefixo `R`, como `RUsuarioResposta` |
| Parâmetros | Prefixo `p`, como `pUsuarioId` |
| Constantes | `UPPER_SNAKE_CASE` |
| Métodos e variáveis | `camelCase` |

Não é seguro ativar uma configuração genérica sem adaptá-la a essas regras, pois ela produziria falsos erros no código existente.

### Estratégia recomendada

1. Começar com regras não controversas e compatíveis com o código atual.
2. Corrigir as violações existentes em um commit dedicado.
3. Tornar as regras bloqueantes no `verify` e na CI.
4. Adicionar regras mais rigorosas apenas quando o time concordar com a convenção.

---

## 7. Git hooks nativos

Git hooks são scripts executados pelo Git em eventos como `commit` e `push`. Husky é apenas uma ferramenta Node.js que facilita sua instalação; em um projeto Java não há necessidade de instalá-lo.

Os hooks do projeto ficam em `.githooks/`, mas o Git não usa esse diretório automaticamente. Cada clone precisa executar uma vez:

```powershell
git config core.hooksPath .githooks
```

O script `scripts/configurar-git-hooks.ps1` deve executar esse comando no Windows. Uma variante `.sh` cobre macOS e Linux.

### `commit-msg`

Recebe o caminho do arquivo com a mensagem do commit e valida o cabeçalho. É o equivalente ao hook Husky que chama commitlint.

### `pre-commit`

Executa verificações rápidas antes de criar o commit. A recomendação é executar `spotless:check`, Checkstyle e compilação, evitando testes de integração demorados a cada commit.

### `pre-push`

Executa a validação completa antes do envio ao servidor:

```powershell
.\mvnw.cmd -B verify
```

O parâmetro `-B` usa modo não interativo, adequado para hooks e CI. Caso a suíte inclua Testcontainers, Docker precisa estar disponível para esse hook concluir.

---

## 8. Conventional Commits

Conventional Commits é uma convenção para mensagens de commit. Ela permite que ferramentas entendam a natureza da mudança e decidam a próxima versão automaticamente.

### Formato

```text
tipo(escopo opcional): descrição objetiva
```

### Tipos permitidos

| Tipo | Uso | Efeito normal no release |
| --- | --- | --- |
| `feat` | Nova funcionalidade | Incrementa a versão minor |
| `fix` | Correção de defeito | Incrementa a versão patch |
| `perf` | Melhoria de desempenho | Normalmente patch |
| `refactor` | Refatoração sem mudança funcional | Registrado no changelog conforme a política |
| `docs` | Documentação | Registrado no changelog conforme a política |
| `test` | Testes | Registrado no changelog conforme a política |
| `build` | Build ou dependências | Registrado no changelog conforme a política |
| `ci` | Pipeline de integração | Registrado no changelog conforme a política |
| `style` | Formatação sem impacto funcional | Registrado no changelog conforme a política |
| `chore` | Manutenção interna | Geralmente oculto do changelog |
| `revert` | Reversão de commit | Tratamento especial de release |

### Exemplos válidos

```text
feat: adicionar fluxo de recuperação de senha
fix(auth): corrigir expiração do refresh token
test: cobrir consulta paginada por cursor
chore: atualizar configuração do Maven Wrapper
```

### Mudanças incompatíveis

Uma mudança incompatível deve usar `!` após o tipo ou escopo, além de descrever a quebra no corpo do commit. Exemplo:

```text
feat(api)!: remover endpoint legado de autenticação
```

Esse marcador permite a geração de uma versão major quando o projeto já estiver em `1.0.0` ou superior. A política para versões `0.x` deve ser definida explicitamente, pois SemVer permite mais flexibilidade antes da primeira versão estável.

---

## 9. Validação local

O fluxo local recomendado é:

```powershell
# Após editar o código.
.\mvnw.cmd spotless:apply

# Antes de enviar a alteração.
.\mvnw.cmd verify
```

Se os hooks estiverem ativos, a mensagem é validada no commit e a verificação completa é repetida no push. Repetir `verify` manualmente antes do push é útil para receber o resultado antes de iniciar a operação Git.

### Por que não executar tudo em cada commit?

Testes de integração com banco de dados ou Testcontainers podem iniciar containers e aumentar bastante o tempo de commit. A divisão entre `pre-commit` rápido e `pre-push` completo mantém qualidade sem interromper o ciclo de edição.

---

## 10. CI de qualidade

O workflow `.github/workflows/quality.yml` deve ser executado em pull requests e pushes para os branches protegidos.

Responsabilidades mínimas:

1. Fazer checkout do código.
2. Configurar Java na versão declarada pelo projeto.
3. Preparar Docker quando os testes de integração o exigirem.
4. Executar `./mvnw -B verify`.
5. Publicar relatórios de teste quando houver falha.

A proteção de branch deve exigir esse workflow antes do merge. Dessa forma, a validação permanece confiável mesmo quando um commit foi criado com `--no-verify`.

---

## 11. Release Please: versões e changelog

Release Please é uma GitHub Action que interpreta o histórico de Conventional Commits. Ele é a alternativa ao standard-version quando o projeto não usa Node.js.

Ele suporta estratégia de release para projetos Java/Maven e trabalha com os arquivos `pom.xml` e `CHANGELOG.md`.

### Ciclo de release

1. Commits convencionais são enviados para o branch de release, normalmente `main`.
2. A Action calcula a próxima versão semântica a partir desses commits.
3. A Action cria ou atualiza uma Pull Request de release.
4. Essa PR atualiza `pom.xml`, `CHANGELOG.md` e o manifesto de versão.
5. Após a aprovação e o merge da PR de release, a Action cria a tag `vX.Y.Z` e a GitHub Release.

O modelo de PR evita publicar uma versão automaticamente sem revisão humana do changelog e da alteração de versão.

### Arquivos de configuração

| Arquivo | Responsabilidade |
| --- | --- |
| `release-please-config.json` | Define a estratégia Java/Maven, branch de destino, seções do changelog e regras de release |
| `.release-please-manifest.json` | Registra a última versão publicada para cada componente do repositório |
| `.github/workflows/release-please.yml` | Executa a Action com permissões para criar PRs, tags e releases |

### Segurança e permissões

O workflow precisa de permissões explícitas para escrever conteúdo do repositório e criar pull requests. Deve usar o `GITHUB_TOKEN` fornecido pela própria GitHub Actions, sem registrar tokens pessoais no repositório.

### O que Release Please não substitui

Release Please gerencia a versão e a publicação da release no GitHub. Publicar uma imagem Docker, subir um JAR para Maven Central ou implantar em produção continua sendo responsabilidade de um workflow de deploy separado, acionado após uma release válida.

---

## 12. Fluxo diário

```text
1. Criar branch para a mudança.
2. Implementar e criar/ajustar testes.
3. Executar mvnw spotless:apply.
4. Executar mvnw verify.
5. Criar commit Conventional Commit.
6. Enviar a branch; o hook pre-push executa verify novamente.
7. Abrir Pull Request; a CI repete verify em ambiente limpo.
8. Fazer merge após aprovação e CI verde.
9. Release Please abre a PR de release conforme os commits acumulados.
10. Aprovar e fazer merge da PR de release para criar tag e GitHub Release.
```

---

## 13. Arquivos que devem permanecer na raiz

| Arquivo ou diretório | Motivo |
| --- | --- |
| `pom.xml` | Maven resolve o projeto a partir deste arquivo na raiz do módulo. |
| `.mvn/`, `mvnw` e `mvnw.cmd` | São a estrutura esperada pelo Maven Wrapper. |
| `.githooks/` | Pode ser versionado em outro local, mas o caminho configurado por `core.hooksPath` deve apontar para ele. Mantê-lo na raiz é previsível. |
| `.github/workflows/` | GitHub Actions só descobre workflows nesse caminho. |
| `.release-please-manifest.json` | O caminho padrão do Release Please é a raiz; outro caminho exigiria configuração adicional. |
| `release-please-config.json` | O caminho padrão do Release Please é a raiz; outro caminho exigiria configuração adicional. |
| `.gitignore` e `.gitattributes` | São arquivos especiais interpretados pelo Git a partir do worktree. |
| `CHANGELOG.md` | Mantê-lo na raiz segue a convenção de ferramentas de release e facilita a descoberta por pessoas e integrações. |

O XML do Checkstyle pode ficar em `config/checkstyle/` porque o plugin Maven aceita receber seu caminho explicitamente no `pom.xml`.

---

## 14. Roteiro de adoção

Para introduzir esse padrão em um backend existente com segurança:

1. Registrar e aprovar a política de commits e versões descrita neste guia.
2. Adicionar Spotless e escolher o formatador Java.
3. Executar a formatação uma vez em commit isolado.
4. Criar uma configuração Checkstyle alinhada às convenções reais do projeto.
5. Corrigir as violações existentes em commit isolado.
6. Ligar Spotless e Checkstyle ao `mvnw verify`.
7. Adicionar os hooks e os scripts de bootstrap.
8. Adicionar a CI de qualidade e marcá-la como obrigatória no branch protegido.
9. Adicionar Release Please, iniciando o manifesto com a versão atual publicada.
10. Atualizar o `README.md` do backend com os comandos e o fluxo adotado.

Cada etapa deve passar por `mvnw verify` antes de ser integrada. Assim, o projeto evolui para um padrão verificável sem misturar uma alteração de infraestrutura com mudanças de negócio.
