import { CreateUserUseCase } from './create-user.use-case';
import { GetUserUseCase } from './get-user.use-case';
import { SearchUserUseCase } from './search-user.use-case';
import { GetFollowingsUseCase } from './get-followings.use-case';
import { GetFollowersUseCase } from './get-followers.use-case';
import { GetUserLikedPostUseCase } from './get-user-liked-post.use-case';
import { GetUserPostsUseCase } from './get-user-posts.use-case';
// import { GetUserRepliesUseCase } from './get-user-replies.use-case';
export const UserUseCasesProviders = [
  CreateUserUseCase,
  GetUserUseCase,
  SearchUserUseCase,
  GetFollowingsUseCase,
  GetFollowersUseCase,
  GetUserLikedPostUseCase,
  GetUserPostsUseCase,
  // GetUserRepliesUseCase,
];
export {
  CreateUserUseCase,
  GetUserUseCase,
  SearchUserUseCase,
  GetFollowingsUseCase,
  GetFollowersUseCase,
  GetUserLikedPostUseCase,
  GetUserPostsUseCase,
  // GetUserRepliesUseCase,
};
