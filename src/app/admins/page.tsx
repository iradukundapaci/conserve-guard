import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersClient from "@/components/Users/UsersClient";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of admins",
};

export default function AdminPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Admin" />
      <UsersClient role="ADMIN" />
    </DefaultLayout>
  );
}
