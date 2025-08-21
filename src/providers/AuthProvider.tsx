"use client";

import { AuthAction, AuthContext, initialState } from "@/contexts/AuthContext";
import {
  AuthState,
  LoginInterface,
  RegisterInterface,
} from "@/interfaces/auth.interface";
import axiosAuthInstance from "@/utils/axiosAuthInstance";
import { getSession, setSession } from "@/utils/jwt";
import localStorageAvailable from "@/utils/localStorageAvailable";


import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { ReactNode, useCallback, useEffect, useMemo, useReducer } from "react";

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIAL":
    case "LOGIN":
    case "REGISTER":
      return {
        ...state,
        isInitialized: true,
        ...action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();
  const router = useRouter();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? getSession() : "";
      if (accessToken) {
        const response = await axiosAuthInstance.get("/auth/get-profile");
        const user = response.data;

        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: "INITIAL",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: "INITIAL",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [state.isAuthenticated, initialize]);

  const login = useCallback(
    async (data: LoginInterface) => {
      const { email, password } = data;
      const response = await axiosAuthInstance.post("/auth/sign-in", {
        email,
        password,
        type: "company_user",
      });
      const { accessToken, user } = response.data;

      // ✅ Allow only if user.type === "user"
      if (user?.type === "company_user") {
        throw new Error(
          "Only users with type 'Company User' are allowed to login."
        );
      }

      setSession(accessToken);

      dispatch({
        type: "LOGIN",
        payload: {
          isAuthenticated: true,
          user,
        },
      });

      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterInterface) => {
      const { name, email, password, password_confirmation } = data;

      const response = await axiosAuthInstance.post("/auth/sign-up", {
        name,
        email,
        password,
        password_confirmation,
      });

      const { accessToken, user } = response.data;

      setSession(accessToken);

      dispatch({
        type: "REGISTER",
        payload: {
          user,
          isInitialized: false,
        },
      });

      router.push("/");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await axiosAuthInstance
      .delete("/auth/sign-out")
      .then((response: AxiosResponse) => {
        if (response.status === 200) {
          setSession("");
          dispatch({ type: "LOGOUT" });
          initialize();
          router.push("/sign-in");
        }
      })
      .catch((error: unknown) => {
        console.log("SIGNOUT ERROR", error);
        setSession("");
        dispatch({ type: "LOGOUT" });
      });
  }, [initialize, router]);

  const signUp = useCallback(
    async (data: RegisterInterface) => {
      const { name, email, password, password_confirmation } = data;

      const response = await axiosAuthInstance.post("/auth/sign-up", {
        name,
        email,
        password,
        password_confirmation,
      });

      const { accessToken, user } = response.data;

      setSession(accessToken);

      dispatch({
        type: "REGISTER",
        payload: {
          user,
          isInitialized: false,
        },
      });

      router.push("/");
    },
    [router]
  );

  const memoizedValue = useMemo(
    () => ({
      ...state,
      method: "jwt",
      login,
      register,
      logout,
      initialize,
      signUp,
    }),
    [state, login, register, logout, initialize, signUp]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
