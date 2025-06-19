import { CreateUserUseCase } from './create-user.use-case';
import { GetUserUseCase } from './get-user.use-case';
import { SearchUserUseCase } from './search-user.use-case';
import { GetFollowingsUseCase } from './get-followings.use-case';
import { GetFollowersUseCase } from './get-followers.use-case';
export const UserUseCasesProviders = [
  CreateUserUseCase,
  GetUserUseCase,
  SearchUserUseCase,
  GetFollowingsUseCase,
  GetFollowersUseCase,
];
export {
  CreateUserUseCase,
  GetUserUseCase,
  SearchUserUseCase,
  GetFollowingsUseCase,
  GetFollowersUseCase,
};
