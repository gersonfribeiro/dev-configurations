# Arquivo de configuração para delegar a alias de hosts diferentes chaves SSH

## Diversas chaves SSH registradas para o mesmo domínio, criar um arquivo config para apontar os arquivos das chaves aos alias dos hosts correspondentes

* O arquivo config é criado na raiz da pasta .ssh sem o uso de extensões, o seu conteúdo aponta qual o arquivo de chave ssh deve ser utilizado por um determinado host.
* Demonstrando com o github.com como exemplo por ser o mais comum:

|    host    |      alias      |                arquivo                |
| ---------- | --------------- | ------------------------------------- |
| github.com | --------------- | "C:/Users/User/.ssh/github_company"   |
| github.com | github-pessoal  | "C:/Users/User/.ssh/github_pessoal"   |
| gitlab.com | --------------- | "C:/Users/User/.ssh/gitlab_company"   |

## Como as configurações são feitas no arquivo config

### Configuração para GitHub (Conta Corporativa)

Host github.com
  HostName github.com
  User git
  IdentityFile "C:/Users/User/.ssh/github_company"
  IdentitiesOnly yes

### Configuração para GitLab (Conta Corporativa)

Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile "C:/Users/User/.ssh/gitlab_company"
  IdentitiesOnly yes

### Configuração para GitHub (Conta Pessoal - usar um alias diferente por ser o mesmo host)

* Se usar o mesmo 'github.com', o SSH tentará a primeira chave que funcionar. Então pode-se criar um alias no Host (ex: github-pessoal) e mudar a URL do remote.
* O que antes seria `git@github.com:user/nomeProjeto.git` agora se torna `git@github-pessoal.com:user/nomeProjeto.git`, essa é a nova origin do repositório git.

Host github-pessoal.com
  HostName github.com
  User git
  IdentityFile "C:/Users/User/.ssh/github_pessoal"
  IdentitiesOnly yes
