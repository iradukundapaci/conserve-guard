import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import { UserProvider } from "@/contexts/user-context";
import { AuthGuard } from "@/components/Auth/auth-guard";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "Dashboard for Conserve Guard",
};

export default function Home() {
  return (
    <DefaultLayout>
      <UserProvider>
        <AuthGuard>
          <ECommerce />
        </AuthGuard>
      </UserProvider>
    </DefaultLayout>
  );
}
