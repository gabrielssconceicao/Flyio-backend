import { AuthUseCase } from './auth.use-case';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { SignInUseCase } from './sign-in.use-case';

export const AuthUseCasesProviders = [
  AuthUseCase,
  RefreshTokenUseCase,
  SignInUseCase,
];
export { AuthUseCase, RefreshTokenUseCase, SignInUseCase };
