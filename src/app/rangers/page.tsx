import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersClient from "@/components/Users/UsersClient";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of rangers",
};

export default function RangersPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ranger" />
      <UsersClient role="RANGER" />
    </DefaultLayout>
  );
}
