export type AuthRole = "trainee" | "staff" | "developer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: AuthRole;
  createdAt?: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  message?: string;
  user?: AuthUser;
  isDeveloper?: boolean;
}

export interface AuthAdapter {
  signUp(email: string, password: string, name?: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthResult>;
}
