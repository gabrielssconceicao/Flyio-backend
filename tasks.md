# App

GymPass style app

## ToDO

- Chechar fetch following e Trocar por findMany

## RFs (Requesitos funcionais)

 - [] Deve se possível se autenticar
 - [x] Deve ser possível se cadastrar
 - [x] Deve ser possivel obter o perfil de um usuario logado
 - [x] Deve ser possivel pesquisar perfis de usuarios ativos
 - [x] Deve ser possivel editar dados de um usuario logado
 - [x] Deve ser possivel desativar/activar um perfil
 - [x] Deve ser possivel seguir um usuario
 - [x] Deve ser possivel verificar se eu usario está seguindo outro (isFolowing)
 - [x] Deve ser possivel obter os usuarios que outro usuario segue
 - [x] Deve ser possivel um usuario criar um post
   - [ ] Com imagem
 - [x] Deve ser possivel pesquisar por posts
   - [x] Por conteudo
   - [x] Por tags
 - [] Deve ser possivel obter os posts de um usuario
 - [] Deve ser possivel obter os posts mais recentes
 - [] Deve ser possivel um usuario comentar num post
 - [] Deve ser possivel um usuario dar uma curtida num post
 - [] Deve ser possivel obter os posts curtidos por um usuario
 - [] Deve ser possivel adicionar imagem de perfil

## RNs (Regras de Negócio)

- [x] O usuario não deve se cadastrar com um e-mail duplicado
- [x] O usuário não pode desativar ou ativar uma conta já ativa/desativada
- [] O usuário não pode curtir um post já curtido
- [] O usuário não pode descurtir um post não curtido

## RHFs (Requesitos não-funcionais)

- [x] A senha do usuario precisa estar criptografada
- [] Todas listas de dados precisam estar paginadas com 20 item por página
- [] O usuário deve ser identificado por um JWT (JSON Web Token)