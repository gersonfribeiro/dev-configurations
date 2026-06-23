# Agents Context & Skills Configuration

Este arquivo define os papeis, habilidades e restricoes dos agentes de IA operando no repositorio do Invoice. O agente deve ler este arquivo para calibrar suas respostas de acordo com a stack tecnologica exigida.

## Linguagem de comunicação
* Português (pt-BR)

## 1. Frontend Agent (Vue 3 + Vuetify)

**Role:** Desenvolvedor Frontend especialista em Progressive Web Apps (PWA) e interfaces reativas.

**Skills & Stack:**
* Vue.js 3 (Composition API, `<script setup>`).
* Vuetify 4 (Componentizacao e Design System).
* TypeScript.
* SCSS.
* PWA (Service Workers, configuracao do `icon` no manifest).

**Guidelines:**
* Sempre ter atenção e cuidado com os comentários, eles devem ser adicionados nos arquivos de models (Types e interfaces) para descrever o que cada um dos atributos possui de responsabilidade (comentário sempre acima do atributo, uma senha separando os atributos dos comentários de outros, então seria comentário, atributo, quebra de linha, repete...). A mesma coisa seria para props em componentes, cada prop deve ter um comentário sobre o que a mesma influencia no comportamento do componente.

* Imports no topo do arquivo possuem uma ordem clara e altamente restrita para fins de organização, leitura e manutenção, usamos os comentários para agrupar imports e sempre separamos com uma quebra de linha, por exemplo -> // Ecossistema Vue, abaixo vamos usar os imports para vue, vue-router, vuetify... (ref, mergeProps, computed, composables do vuetify...), em seguida vem tudo que for do Pinia, inclusive o import das stores, logo abaixo vem // Contantes (enums por exemplo), // Types e Interfaces, // Composables (exceto as do vuetify que são junto do ecossistema vue), // Utils, // Services, // Componentes e por fim // Outros.

* Nosso script setup também tem uma ordem clara, novamente sendo separado com comentário, após os imports devem ser declarados types, props, emits e interfaces, seguidos de constantes, variáveis reativas com o defineModel, variáveis reativas com ref ( se em um script, usarmos tanto ref quanto defineModel, ambos devem ter uma linha de comentário acima das declarações 'Reativas - Model/ref', se for usado apenas uma das opções, manter apenas 'Reativas'), Funções sincrónas seguidas de Funções assíncronas (apenas uma linha de comentário como 'Funções'), computeds ('Computadas'), watch ('Observadores'), LifeCicly Hooks e por fim Expose.

* Comentar atributos cuja responsabilidade não seja imediatamente óbvia. Evitar comentários que apenas repitam o nome do atributo.

* Se formos usar o defineProps ou defineEmits, esses devem sempre ser declarados no script setup abaixo do tipo correspondente de cada um, ou seja, após os imports, declaro um type TProps = { /* assinatura */ }, na próxima linha eu faço defineProps<TProps>(); ou const props = defineProps<TProps>(); Mesma coisa com o TEmits ( props primeiro, emits depois ). Props e emits são as únicas variáveis que nós não usaremos o padrão de nomenclatura aplicado nas demais variáveis em um arquivo script (será descrito nos próximos Guidelines).

* Nos nossos Types e Interfaces do projeto, todos os atributos usam o padrão camelCase, mantendo consistencia com a nomenclatura declarada no script e que o nosso Prittier + ESLint faz a formatação nos arquivos vue.

* Tipagem forte para manter a seguranca, exportar os tipos, interfaces e classes em locais centralizados como em diretorios model, classes em diretorios estrategicos e afins.

* Padrão de nomenclatura bem aplicado, separacao intuitiva de responsabilidades dos diretorios, sejam componentes, interfaces, types, enums, classes... Quando declarar uma Constante, usar o prefixo 'C', types 'T', interfaces 'I', classes 'Class'. A nomenclatura deve ser bem estruturada, preferencialmente usar o Camel Case, jamais usar espaços.

* Priorizar a criacao de componentes reutilizaveis, tanto em template quanto em script.

* Componentes, stores, composables, interfaces e types reutilizaveis devem ter um comentario curto explicando sua responsabilidade geral e comentarios pontuais em decisoes de logica que nao sejam obvias durante revisoes futuras.

* Garantir responsividade nativa e suporte a dispositivos moveis. Layouts com um comportamento muito bem definido e ajustável a diferentes disposicoes da view-port.

* Ao manipular estagios de UI, atentar-se a regras de paginacao (exemplo: usar o ultimo indice da lista para paginacao invertida de mensagens de chat, e nao o indice 0).

* Nao sugerir bibliotecas de componentes de terceiros que fujam da base do Vuetify.

* Sempre priorizar o uso de componentes nativos do Vuetify para a construção dos templates em nossos arquivos vue.

* Aplicar o principio de DRY em componentes, composables, services, classes, funcoes e mixins SCSS, evitando repeticao de props, estilos e regras de comportamento.

* Eventos emitidos devem representar intenções de negócio e não detalhes de implementação. Preferir: @save, @cancel ao invés de @clickButton, @closeModalButton.

* Preferir recursos nativos do Vuetify antes de criar wrappers, grids manuais ou CSS estrutural proprio; wrappers so devem existir quando encapsularem comportamento real, como loading, requisicoes, permissoes, defaults ou regras reutilizaveis.

* Folhas de estilo devem ser sempre importadas com a tag `<style>` passando o caminho do arquivo para o atributo `src`, especificar o atributo `lang` de acordo com a extensao de cada arquivo de style.

* Arquivos SCSS de componentes devem ficar em arquivo separado com o mesmo nome do componente, alterando apenas a extensao (`MeuComponente.vue` e `MeuComponente.scss`), e o componente deve usar `<style src="./MeuComponente.scss" scoped lang="scss"></style>` quando o estilo for local.

* Manter o `App.vue` minimo, preferencialmente apenas com `v-app` e `RouterView`; qualquer tag estrutural adicional neste arquivo deve ser debatida antes.

* Layouts devem controlar estrutura, responsividade, scroll e disposicao macro da tela; pages e components nao devem compensar problemas estruturais com repeticoes de `d-flex`, paddings ou wrappers desnecessarios.

* O scroll principal da aplicacao deve ficar em `v-main` ou na area scrollable definida pelo layout, nunca em `body`, `html` ou wrappers arbitrarios.

* Componentes de layout devem usar `useDisplay` e demais composables do Vuetify para responsividade sempre que possivel.

* Scrollbars devem ser discretas, com trilho transparente, sem botoes de controle e definidas por mixins SCSS reutilizaveis.

* Priorizar UX clara e previsivel: controles de layout devem ter funcoes distintas entre desktop e mobile, evitando botoes redundantes quando hover, pin ou comportamento responsivo ja resolvem a acao.

* Itens de navegacao devem ser derivados das rotas e seus metadados sempre que possivel, incluindo grupos recursivos para rotas com `children`, icones, titulos e hotkeys.

* Hotkeys devem usar o composable `useHotkey` do Vuetify e ser registradas condicionalmente para desktop; em mobile, evitar processamento e elementos visuais de atalhos que nao agregam a experiencia.

* Preferencias de usuario, como tema e estado persistente de layout, devem viver em stores Pinia e ser persistidas por utilitarios centralizados de storage, nunca espalhadas por `localStorage` direto nos componentes.

* Comentarios devem ser objetivos e explicar contratos de props, eventos, models, exposes e decisoes nao obvias; nao comentar linhas triviais ou comportamento autoexplicativo. Em componentes genericos, comentar 
tambem a responsabilidade geral do componente e o efeito esperado dos slots principais.

* Estilizacoes de hover, active e estados interativos devem usar tokens/paleta do Vuetify para manter temas claro/escuro e futuras alteracoes centralizadas.

* Estados persistentes com significados diferentes devem permanecer isolados; por exemplo, fixacao do drawer no desktop nao deve ser resetada por acoes de exibir/ocultar o drawer.

* Nossos services vão ser encapsulado em classes para podermos utilizar de poderes da POO, quando tivermos uma ClassServiceAlguma coisa, que a sua responsabilidade seja realizar requisições, os métodos devem ser por essência estátivos, poupando a necessidade de instanciar uma classe apenas para fazer a requisição.

* Métodos estáticos dos services que fizerem requisição, devem apenas ter um try catch com a tentativa da request e um throw, estados e tratamentos vão ser feitos em camadas em níveis superiores mais próximos dos usuários, ou seja, service não trata o erro, apenas o captura e manda para o próximo nível.

* Nossos services precisam sempre ter uma assinatura extremamente clara de seus tipos, tanto de parâmetros quanto de retornos, mesmo que sejam voids.

* Services não devem exibir snackbar, navegar ou manipular estado visual.

* Se um service for realizar uma requisição paginada, o padrão é montar uma nova interface para receber todos os atributos que podem ser enviados (normalmente usamos para a paginação um nextEntry (usamos cursor ao invés de página), limit, order, também podemos ter um campo filter, mas isso varia de acordo com cada responsabilidade do endpoint que o service vai consumir, o importante é não criar um método que tenha 20 parâmetros em sua assinatura).

* Não realizar chamadas HTTP diretamente em componentes quando a lógica puder ser encapsulada em composables.

* Podemos abstrair as requisições em Composables, as mesmas devem conter lógica reutilizável de estado ou comportamento. Assim elas podem ser responsáveis por lidar com a requisição, o tratamento dos parâmetros e a UX do usuário no caso de erro, disparando uma snackbar por exemplo, redirecionando para uma rota de not found ou forbidden.

* Evitar watchers quando uma computed resolver o problema.

* Evitar computed encadeadas desnecessariamente.

* Evitar renderização de listas sem key.

* Priorizar lazy loading para rotas e componentes pesados.

* Sempre tratar o lock de uma requisição nos componentes usando um loading, assim, não vamos disparar a mesma requisição http enquanto ainda não obtivermos a resposta de outra requisição.

* Loading de lock deve sempre ser visual, até mesmo quando tivermos processos em segundo plano como workers, o usuário deve saber que algo está acontecendo e que o sistema não travou, obviamente loadings de processos em segundo plano não podem ser um overlay impedindo a interação.

* Stores devem conter apenas estado compartilhado da aplicação, como por exemplo os estados de preferência do usuário, parâmetros globais de filtros e paginação, comunicações entre diversos componentes fora da hierarquia familiar (componentes que se comunicam mesmo não sendo parentes).

* Não realizar chamadas HTTP diretamente em stores quando a lógica puder ser encapsulada em composables.

* Componentes devem usar preferencialmente as store que usam as composables que usam as services para realizar as chamadas http, assim garantimos que as responsabilidades vão ser todas aproveitadas e ninguém será sobrecarregado, services só faz a chamada e intercepta o erro, sem tratamentos, composable recebe os parâmetros e repassa para o service tratando erros e lidando com UX, store cria os estados compartilhados e usa os mesmos como parâmetros para as chamadas das composables além de persistir o que for necessário como os nossos contextos de simulação rápida de micro cache das listas genéricas, com isso nossos componentes só fazem as chamadas para o método da store e manipulam os parâmetros no template, deixando muito enxuto, limpo e reutilizável.

* Stores não devem conhecer componentes, elas precisam funcionar independete de quem as chama.

* Preferir actions pequenas e específicas, isso garante mais reutilização e facilita a manutenção.

* Nossos formatadores de dados estão sempre centralizados em uma ClassFormatters, lá nós definimos todos os tratamentos de dados para cada um dos nossos valores por meio de métodos estáticos. Nossas datas, valores booleanos e assim por diante. Essa classe também é usada nos templates por meio de composables que fazem a chamada ao método do Formatter, principalmente em slots de um DataTable.

* Componentes Base devem ser genéricos e não conhecer regras de negócio. Quando um componente começar a depender de entidades específicas, ele deve ser promovido para um componente de domínio.
