import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersClient from "@/components/Users/UsersClient";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of lawyers",
};

export default function LawyersPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Lawyer" />
      <UsersClient role="LAWYER" />
    </DefaultLayout>
  );
}
