# Flyio - Social Network API

[ ] add docker
[ ] try websocket

This project involves the development of a social network using the NestJS framework, with a focus on scalability, modularity, and security. The application allows users to create profiles, post content, interact with other posts, and connect with other users. The system also includes common social network features, such as comments and likes.

# Table of Contents

- [Flyio - Social Network API](#flyio---social-network-api)
- [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Project Details](#project-details)
  - [Features](#features)
  - [API Routes Functionalities](#api-routes-functionalities)
    - [Authentication](#authentication)
    - [Posts](#posts)
      - [Likes](#likes)
      - [Replies](#replies)
    - [Me](#me)
    - [User](#user)
    - [Follow](#follow)
  - [API Documentation](#api-documentation)
  - [How to execute](#how-to-execute)
  - [License](#license)


## Tech Stack

![NodeJs](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Nestjs](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-0C8ED8?style=for-the-badge&logo=prisma&logoColor=white)
![Postgress](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Bcryptjs](https://img.shields.io/badge/BcryptJS-000000?style=for-the-badge&logo=bcrypt&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Cloudnary](https://img.shields.io/badge/Cloudinary-343A40?style=for-the-badge&logo=cloudinary&logoColor=white)


## Project Details

- **Language**: TypeScript
- **Framework**: NestJS,Prisma ORM
- **Database**: Postgress
- **Authentication**: JWT
- **Password Encryption**: BcryptJS
- **API Documentation**: Swagger
- **Testing**: Jest
- **Image Provider**: Cloudinary

## Features

- **User Authentication and Authorization**: Securely manage user access and permissions
- **Data Management with Prisma ORM**: Easily interact with your database using Prisma's intuitive ORM
- **API Documentation with Swagger**: Automatically generate API documentation for easy consumption
- **Automated Testing with Jest**: Ensure your code is reliable and stable with Jest's robust testing framework
- **Image Provider**: Cloudinary

## API Routes Functionalities

### Authentication
- `POST /auth/sign-in`: Logs in a user.
- `POST /auth/refresh-token`: Refreshes the authentication token.

### Posts
- `POST /post`: Creates a post.
- `GET /post`: Retrieve posts or Search for posts.
- `GET /post/:id`: Retrieves a post by ID.
- `DELETE /post/:id`: Deletes a post by ID.

#### Likes
- `POST /post/:id/like`: Likes a post.
- `POST /post/:id/deslike`: Deslikes a post.

#### Replies
- `POST /post/:postId`: Reply a post.

### Me
- `GET /me`: Get logged user information
- `PATCH /me`: Update logged user
- `DELETE /me`: Desactivate logged user
- `DELETE /me/profile-image`: Delete profile image
- `DELETE /me/banner-image`: Delete banner image

### User
- `POST /user`: Creates a new user
- `GET /user`: Search users by name or username
- `GET /user/:username`: Retrieves user information.
- `GET /user/:username/followings`: Retrieve users that a user follows
- `GET /user/:username/followers`: Retrieve users that follow a user
- `GET /user/:username/liked-posts`: Retrieve post that are liked by a user
- `GET /user/:username/posts`: Retrieve posts of a user

### Follow
- `/follow/:username`: Follow a user
- `/unfollow/:username`: Unfollow a user

## API Documentation

The API documentation is available at the `/doc/api` endpoint of the API.

The documentation includes information about the available endpoints, request and response formats, and examples of how to use each endpoint.

To access the documentation, you can use the following URL:

```
https://your-api-url/doc/api
```

## How to execute

1. Install the dependencies:
   ```sh
   npm install
   ```

2. Configure the environment variables in the `.env` file.

3. Execute migrations:
   ```
    npx prisma migrate dev
   ```

4. Run the application:
   ```sh
   npm run start
   ```

## License

This project is licensed under the [MIT License](./LICENSE).

