/**
 * Auth Feature
 * Public exports for auth module
 */

// Components
export { LoginForm } from './components/LoginForm';
export { ProtectedRoute } from './components/ProtectedRoute';
export { RegisterForm } from './components/RegisterForm';
export { ClientRegisterForm } from './components/ClientRegisterForm';
export { ProviderRegisterForm } from './components/ProviderRegisterForm';

// Hooks
export {
  useAuth,
  useUser,
  useIsAuthenticated,
  useUserType,
  useIsUserType,
  useIsClient,
  useIsProvider,
  useIsAdmin,
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from './hooks/use-auth';

// Query hooks
export { authKeys, useForgotPassword, useResetPassword, useRefreshToken } from './api/auth.queries';

// Schemas
export {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from './schemas/login.schema';
export { registerSchema, type RegisterInput } from './schemas/register.schema';

// Types
export type * from './types/auth.types';
