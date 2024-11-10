import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";

export const metadata: Metadata = {
  title: "Sign In - Your Account",
  description:
    "Access your account by signing in through our secure login portal.",
};

const SignIn: React.FC = () => {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-lg rounded-[10px] bg-white p-8 shadow-lg dark:bg-gray-900 dark:shadow-xl lg:p-12">
          {/* Sign In Form Section */}
          <div className="w-full p-6 lg:p-10">
            <h2 className="mb-4 text-2xl font-bold dark:text-white">Sign In</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Access your account by completing the fields below.
            </p>
            <Signin />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;