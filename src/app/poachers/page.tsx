import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersClient from "@/components/Users/UsersClient";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of poachers",
};

export default function PoachersPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Poachers" />
      <UsersClient role="POACHER" />
    </DefaultLayout>
  );
}
