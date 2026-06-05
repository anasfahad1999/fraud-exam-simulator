import { serverAdapter } from "./serverAdapter";
import type { AuthAdapter } from "./types";

export const authClient: AuthAdapter = serverAdapter;

export type { AuthRole, AuthUser, AuthResult } from "./types";
