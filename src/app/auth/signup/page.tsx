import React from "react";
import { Metadata } from "next";
import Signup from "@/components/Auth/Signup";
import { GuestGuard } from "@/components/Auth/guest-guard";
import { UserProvider } from "@/contexts/user-context";

export const metadata: Metadata = {
  title: "Sign In - Your Account",
  description:
    "Access your account by signing in through our secure login portal.",
};

const SignIn: React.FC = () => {
  return (
    <UserProvider>
      <GuestGuard>
        <div
          className="flex min-h-screen items-center justify-center"
          style={{
            backgroundImage: "url('/images/bckg.png')",
          }}
        >
          <div className="mx-auto max-w-lg rounded-[10px] bg-white p-8 shadow-lg dark:bg-gray-900 dark:shadow-xl lg:p-12">
            <Signup />
          </div>
        </div>
      </GuestGuard>
    </UserProvider>
  );
};

export default SignIn;
