import { ReactNode } from "react";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: string;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  _id?: string;
  image?: string;
}

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInterface | null;
}

export interface AuthContextProps {
  method: string;
  login: (data: LoginInterface) => Promise<void>;
  signUp: (data: RegisterInterface) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserInterface | null;
}

export interface AuthGuardProps {
  children: ReactNode;
}
