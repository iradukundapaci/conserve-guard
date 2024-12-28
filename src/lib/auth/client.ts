"use client";

import { User } from "@/types/user";

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
}

const user = {
  id: "USR-000",
  avatar: "/assets/avatar.png",
  firstName: "Sofia",
  lastName: "Rivers",
  email: "sofia@devias.io",
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: "google" | "discord";
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(values: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            role: values.role,
            names: `${values.firstName} ${values.lastName}`,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 201) {
        return { error: data.message || "Signup failed" };
      }
      window.location.href = "/auth/signin";
      return { error: undefined };
    } catch (error) {
      return { error: "An error occurred during login. Please try again." };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: "Social authentication not implemented" };
  }

  async signInWithPassword(
    params: SignInWithPasswordParams,
  ): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || "Login failed" };
      }

      const { accessToken, refreshToken } = data.payload;

      localStorage.setItem("accessToken", accessToken);

      return {};
    } catch (error) {
      // Handle any errors during the fetch
      return { error: "An error occurred during login. Please try again." };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: "Password reset not implemented" };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: "Update reset not implemented" };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return { data: null };
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/users/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || "Failed to fetch user profile" };
      }

      const { payload } = await response.json();
      const user: User = {
        id: payload.id,
        email: payload.email,
        name: payload.names,
        role: payload.role,
        avatar: payload.profileImage || null,
      };
      localStorage.setItem("role", payload.role);
      return { data: user };
    } catch (error) {
      return { error: "An error occurred while fetching the user profile" };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    return {};
  }
}

export const authClient = new AuthClient();
