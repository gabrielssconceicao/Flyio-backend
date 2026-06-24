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
- [x] Criar `Entity`
- [x] Criar `AggregateRoot`
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

### Error Codes

- [x] Criar enum `ErrorCode`

---

# Domain

# Identity

## Enterprise

### Entities

#### User (Aggregate Root)

##### Propriedades

- [x] id
- [x] name
- [x] username
- [x] email
- [x] passwordHash
- [x] bio
- [x] isActive
- [ ] followersCount
- [ ] followingCount
- [x] createdAt
- [x] updatedAt

##### Regras

- [x] Alterar nome
- [x] Alterar username
- [ ] Alterar email
- [x] Alterar bio
- [x] Alterar senha
- [x] Ativar conta
- [ ] Desativar conta
- [ ] Incrementar followers
- [ ] Decrementar followers
- [ ] Incrementar following
- [ ] Decrementar following
- [x] Atualizar updated_at

---

#### RefreshToken (Aggregate Root)

##### Propriedades

- [x] id
- [x] userId
- [x] token
- [x] expiresAt
- [x] createdAt

##### Regras

- [x] Verificar se está expirado

### ActivationToken

- [ ] id
- [ ] user_id
- [ ] token
- [ ] expires_at
- [ ] created_at

##### Regras

- [x] Verificar se está expirado

### PasswordResetToken

- [ ] id
- [ ] user_id
- [ ] token
- [ ] expires_at
- [ ] created_at

##### Regras

- [x] Verificar se está expirado

---

### Value Objects

#### Email

- [x] Validar formato
- [x] Retornar InvalidEmailError

#### Username

- [x] Validar tamanho mínimo
- [x] Validar tamanho máximo
- [x] Validar caracteres permitidos

#### Password

- [x] Validar tamanho mínimo
- [x] Validar tamanho máximo

---

### Errors

- [x] InvalidEmailError
- [x] InvalidUsernameError
- [x] InvalidPasswordError
- [x] EmailAlreadyExistsError
- [x] UsernameAlreadyExistsError
- [x] UserNotFoundError
- [x] InvalidCredentialsError
- [x] InvalidRefreshTokenError
- [x] ExpiredRefreshTokenError

---

## Application

### Repositories

#### UsersRepository

- [x] create
- [x] save
- [x] delete
- [x] findById
- [x] findByEmail
- [x] findByUsername

#### RefreshTokensRepository

- [x] create
- [x] findByToken
- [x] delete
- [x] save

#### ActivateRepository

- [ ] create
- [ ] findByToken
- [ ] delete

#### RecoverPasswordRepository

- [ ] create
- [ ] findByToken
- [ ] delete

---

### Cryptography

#### Password

- [x] HashGenerator
- [x] HashComparer

#### Token

- [ ] Encrypter
- [ ] Decrypter

---

### Use Cases

---

#### User

##### Get Profile

- [x] Validar usuario

##### Get User by username

- [x] Validar usuario

##### Register User

- [x] Validar email
- [x] Validar username
- [x] Validar senha
- [x] Verificar email único
- [x] Verificar username único
- [x] Gerar hash da senha
- [x] Criar usuário

##### Update User

- [x] Atualizar perfil

##### Change Password

- [x] Validar senha atual
- [x] Gerar novo hash

##### Deactivate User

- [x] Desativar conta

##### Activate User

- [ ] Buscar token de ativação
- [ ] Validar o token
- [ ] Activar o usuario
- [ ] Apagar o token

---

#### Auth

##### Login

- [x] Buscar usuário
- [x] Validar senha
- [x] Gerar Access Token
- [x] Gerar Refresh Token
- [x] Salvar Refresh Token

##### Refresh Token

- [x] Buscar Refresh Token
- [x] Verificar expiração
- [x] Gerar novo Access Token
- [x] Gerar novo Refresh Token
- [x] Invalidar Refresh Token antigo

##### LogoutUser

- [x] Remover Refresh Token

##### LogoutAllDevices

- [ ] Remover todos os Refresh Tokens do usuário

---

#### Activation

#### Password Recovery

##### Send Activation Code

- [ ] Verificar email
- [ ] Buscar usuario pelo email
- [ ] criar token de ativação
- [ ] Salvar token
- [ ] Enviar código

##### Activate User

- [ ] Buscar token
- [ ] atualizar senha
- [ ] apagar token

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
