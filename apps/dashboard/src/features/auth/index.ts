/**
 * Auth Feature
 * Public exports for auth module
 */

// Components
export { LoginForm } from './components/LoginForm';
export { ProtectedRoute } from './components/ProtectedRoute';

// Hooks
export {
  useAuth,
  useUser,
  useIsAuthenticated,
  useUserRole,
  useHasRole,
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from './hooks/use-auth';

// Query hooks
export {
  authKeys,
  useForgotPassword,
  useResetPassword,
  useRefreshToken,
} from './api/auth.queries';

// Schemas
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from './schemas/login.schema';

// Types
export type * from './types/auth.types';
