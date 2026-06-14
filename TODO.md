# API Rede Social - TODO

## Estrutura do Projeto

- [ ] Criar estrutura base

```text
src/
├── core/
├── domain/
│   ├── identity/
│   ├── social/
│   └── messaging/
├── infra/
└── tests/
```

---

# Core

## Base

- [x] Criar `UniqueEntityId`
- [ ] Criar `Entity`
- [ ] Criar `AggregateRoot`
- [x] Criar utilitário `Optional`
- [x] Criar implementação de `Either`
- [x] Criar função `left`
- [x] Criar função `right`

## Errors

- [x] Criar `AppError`
- [x] Criar `ValidationError`
- [x] Criar `ConflictError`
- [x] Criar `NotFoundError`
- [x] Criar `UnauthorizedError`
- [x] Criar `ForbiddenError`

## Error Codes

- [x] Criar enum `ErrorCode`

---

# Domain

# Identity

## Enterprise

### Entities

#### User (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] name
- [ ] username
- [ ] email
- [ ] password_hash
- [ ] bio
- [ ] is_active
- [ ] followers_count
- [ ] following_count
- [ ] created_at
- [ ] updated_at

##### Regras

- [ ] Alterar nome
- [ ] Alterar username
- [ ] Alterar email
- [ ] Alterar bio
- [ ] Alterar senha
- [ ] Ativar conta
- [ ] Desativar conta
- [ ] Incrementar followers
- [ ] Decrementar followers
- [ ] Incrementar following
- [ ] Decrementar following
- [ ] Atualizar updated_at

---

#### RefreshToken (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] user_id
- [ ] token
- [ ] expires_at
- [ ] created_at

##### Regras

- [ ] Verificar se está expirado
- [ ] Verificar se pertence ao usuário

---

### Value Objects

#### Email

- [ ] Validar formato
- [ ] Retornar InvalidEmailError

#### Username

- [ ] Validar tamanho mínimo
- [ ] Validar tamanho máximo
- [ ] Validar caracteres permitidos

#### Password

- [ ] Validar tamanho mínimo
- [ ] Validar tamanho máximo

---

### Errors

- [ ] InvalidEmailError
- [ ] InvalidUsernameError
- [ ] InvalidPasswordError
- [ ] EmailAlreadyExistsError
- [ ] UsernameAlreadyExistsError
- [ ] UserNotFoundError
- [ ] InvalidCredentialsError
- [ ] InvalidRefreshTokenError
- [ ] ExpiredRefreshTokenError

---

### Events (Futuro)

- [ ] UserCreatedEvent

---

## Application

### Repositories

#### UsersRepository

- [ ] create
- [ ] save
- [ ] delete
- [ ] findById
- [ ] findByEmail
- [ ] findByUsername

#### RefreshTokensRepository

- [ ] create
- [ ] findByToken
- [ ] findManyByUserId
- [ ] delete
- [ ] deleteManyByUserId

---

### Cryptography

#### Password

- [ ] HashGenerator
- [ ] HashComparer

#### Token

- [ ] Encrypter
- [ ] Decrypter

---

### Use Cases

#### RegisterUser

- [ ] Validar email
- [ ] Validar username
- [ ] Validar senha
- [ ] Verificar email único
- [ ] Verificar username único
- [ ] Gerar hash da senha
- [ ] Criar usuário

#### AuthenticateUser

- [ ] Buscar usuário
- [ ] Validar senha
- [ ] Gerar Access Token
- [ ] Gerar Refresh Token
- [ ] Salvar Refresh Token

#### RefreshAccessToken

- [ ] Buscar Refresh Token
- [ ] Verificar expiração
- [ ] Gerar novo Access Token
- [ ] Gerar novo Refresh Token
- [ ] Invalidar Refresh Token antigo

#### LogoutUser

- [ ] Remover Refresh Token

#### LogoutAllDevices

- [ ] Remover todos os Refresh Tokens do usuário

#### UpdateUser

- [ ] Atualizar perfil

#### ChangePassword

- [ ] Validar senha atual
- [ ] Gerar novo hash

#### DeactivateUser

- [ ] Desativar conta

---

# Social

## Enterprise

### Value Objects

#### PostContent

- [ ] Validar tamanho mínimo
- [ ] Validar tamanho máximo
- [ ] Não permitir conteúdo vazio

#### ImageUrl

- [ ] Validar URL
- [ ] Permitir valor opcional

#### Tag

- [ ] Remover "#" automaticamente
- [ ] Converter para lowercase
- [ ] Remover espaços extras
- [ ] Validar tamanho mínimo
- [ ] Validar tamanho máximo

Exemplos:

```text
#NestJS    -> nestjs
#NESTJS    -> nestjs
#NeStJs    -> nestjs
```

#### CommentContent

- [ ] Validar tamanho mínimo
- [ ] Validar tamanho máximo

---

### Entities

#### Post (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] author_id
- [ ] content
- [ ] image_url (opcional)
- [ ] tags
- [ ] likes_count
- [ ] comments_count
- [ ] created_at
- [ ] updated_at

##### Regras

- [ ] Editar conteúdo
- [ ] Alterar imagem
- [ ] Adicionar tag
- [ ] Remover tag
- [ ] Incrementar likes
- [ ] Decrementar likes
- [ ] Incrementar comentários
- [ ] Decrementar comentários
- [ ] Atualizar updated_at

##### Tags

- [ ] Extrair tags automaticamente do conteúdo
- [ ] Normalizar tags para lowercase
- [ ] Não permitir tags duplicadas

Exemplo:

```text
Conteúdo:

"Aprendendo #NestJS #TypeScript #nestjs"

Tags geradas:

nestjs
typescript
```

---

#### Comment (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] author_id
- [ ] post_id
- [ ] parent_comment_id
- [ ] content
- [ ] created_at
- [ ] updated_at

##### Regras

- [ ] Editar comentário

---

#### Follow (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] follower_id
- [ ] following_id
- [ ] created_at

##### Regras

- [ ] Impedir seguir a si mesmo
- [ ] Impedir follow duplicado

---

#### PostLike (Aggregate Root)

##### Propriedades

- [ ] id
- [ ] user_id
- [ ] post_id
- [ ] created_at

##### Regras

- [ ] Impedir like duplicado

---

### Errors

- [ ] PostNotFoundError
- [ ] InvalidPostContentError
- [ ] InvalidImageUrlError
- [ ] InvalidTagError
- [ ] NotPostOwnerError
- [ ] CommentNotFoundError
- [ ] AlreadyFollowingError
- [ ] FollowNotFoundError
- [ ] PostAlreadyLikedError
- [ ] LikeNotFoundError
- [ ] NotPostOwnerError
- [ ] NotCommentOwnerError

---

### Events (Futuro)

- [ ] PostCreatedEvent
- [ ] PostLikedEvent
- [ ] CommentCreatedEvent
- [ ] UserFollowedEvent

---

## Application

### Repositories

#### PostsRepository

- [ ] create
- [ ] save
- [ ] delete
- [ ] findById
- [ ] findManyByAuthorId
- [ ] findTimeline

#### CommentsRepository

- [ ] create
- [ ] save
- [ ] delete
- [ ] findById
- [ ] findManyByPostId
- [ ] findManyByTag

#### FollowsRepository

- [ ] create
- [ ] delete
- [ ] findFollow
- [ ] findFollowers
- [ ] findFollowing

#### PostLikesRepository

- [ ] create
- [ ] delete
- [ ] findLike
- [ ] countByPostId

---

### Use Cases

#### Posts

- [ ] CreatePost
- [ ] UpdatePost
- [ ] DeletePost
- [ ] GetPost
- [ ] GetUserPosts

#### Timeline

- [ ] GetTimeline

#### Comments

- [ ] CreateComment
- [ ] UpdateComment
- [ ] DeleteComment
- [ ] GetPostComments

#### Likes

- [ ] LikePost
- [ ] UnlikePost

#### Follow

- [ ] FollowUser
- [ ] UnfollowUser

---

# Messaging (Futuro)

## Enterprise

### Entities

#### Conversation (Aggregate Root)

- [ ] id
- [ ] created_at
- [ ] updated_at

#### Participant

- [ ] conversation_id
- [ ] user_id

#### Message (Aggregate Root)

- [ ] id
- [ ] conversation_id
- [ ] sender_id
- [ ] content
- [ ] created_at
- [ ] updated_at

---

### Errors

- [ ] ConversationNotFoundError
- [ ] MessageNotFoundError
- [ ] UserNotParticipantError

---

### Events

- [ ] MessageSentEvent

---

## Application

### Repositories

#### ConversationsRepository

- [ ] create
- [ ] save
- [ ] findById

#### MessagesRepository

- [ ] create
- [ ] save
- [ ] delete
- [ ] findById
- [ ] findManyByConversationId

---

### Use Cases

- [ ] CreateConversation
- [ ] SendMessage
- [ ] DeleteMessage
- [ ] GetConversationMessages
- [ ] GetUserConversations

---

# Infra

## Database

- [ ] Configurar Prisma
- [ ] Criar schema
- [ ] Criar migrations
- [ ] Criar tabela users
- [ ] Criar tabela refresh_tokens
- [ ] Criar tabela posts
- [ ] Criar tabela comments
- [ ] Criar tabela follows
- [ ] Criar tabela post_likes

---

## Repositories

- [ ] PrismaUsersRepository
- [ ] PrismaRefreshTokensRepository
- [ ] PrismaPostsRepository
- [ ] PrismaCommentsRepository
- [ ] PrismaFollowsRepository
- [ ] PrismaPostLikesRepository

---

## Cryptography

- [ ] BcryptHasher
- [ ] JwtEncrypter

---

## HTTP

### Auth

- [ ] JwtStrategy
- [ ] JwtAuthGuard
- [ ] CurrentUserDecorator

### Cookies

- [ ] Configurar @fastify/cookie
- [ ] Configurar cookie refresh_token
- [ ] Configurar HttpOnly
- [ ] Configurar Secure
- [ ] Configurar SameSite

---

### Controllers

#### Identity

- [ ] RegisterUserController
- [ ] AuthenticateUserController
- [ ] RefreshAccessTokenController
- [ ] LogoutUserController
- [ ] LogoutAllDevicesController
- [ ] UpdateUserController

#### Social

- [ ] CreatePostController
- [ ] UpdatePostController
- [ ] DeletePostController
- [ ] LikePostController
- [ ] UnlikePostController
- [ ] FollowUserController
- [ ] UnfollowUserController
- [ ] CreateCommentController
- [ ] TimelineController

---

### Presenters

- [ ] UserPresenter
- [ ] PostPresenter
- [ ] CommentPresenter

---

### Mappers

- [ ] ErrorMapper

---

# Testes

## Unitários

- [ ] Entities
- [ ] Value Objects
- [ ] Use Cases

## Integração

- [ ] Repositories
- [ ] Controllers

## E2E

- [ ] Autenticação
- [ ] Usuários
- [ ] Refresh Token
- [ ] Logout
- [ ] Posts
- [ ] Likes
- [ ] Comentários
- [ ] Follow
- [ ] Timeline

---

# Regras de Negócio

## Usuários

- [ ] Email único
- [ ] Username único
- [ ] Senha criptografada

## Likes

- [ ] Não curtir duas vezes o mesmo post
- [ ] Não remover like inexistente

## Follow

- [ ] Não seguir duas vezes o mesmo usuário
- [ ] Não remover follow inexistente
- [ ] Não seguir a si mesmo

## Permissões

- [ ] Apenas autor pode editar post
- [ ] Apenas autor pode excluir post
- [ ] Apenas autor pode editar comentário
- [ ] Apenas autor pode excluir comentário

## Autenticação

- [ ] Access Token expira em 15 minutos
- [ ] Refresh Token expira em 30 dias
- [ ] Refresh Token salvo no banco
- [ ] Refresh Token enviado por cookie HttpOnly
- [ ] Refresh Token pode ser revogado
- [ ] Logout invalida Refresh Token
- [ ] Logout de todos dispositivos invalida todos os Refresh Tokens
- [ ] Implementar Refresh Token Rotation
