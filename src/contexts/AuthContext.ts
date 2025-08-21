"use client";

import { AuthContextProps, AuthState } from "@/interfaces/auth.interface";
import { createContext } from "react";

export type AuthAction =
    | { type: "INITIAL"; payload: Omit<AuthState, "isInitialized"> }
    | { type: "LOGIN"; payload: Omit<AuthState, "isInitialized"> }
    | { type: "REGISTER"; payload: Omit<AuthState, "isAuthenticated"> }
    | { type: "LOGOUT" };

export const initialState: AuthState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

// ✅ Fix: yaha pe default value exactly AuthContextProps ke hisaab se dena hai
export const AuthContext = createContext<AuthContextProps>({
    ...initialState,
    method: "jwt",
    login: async () => { },
    logout: async () => { },
    signUp: async () => { },
    initialize: async () => { },
});
