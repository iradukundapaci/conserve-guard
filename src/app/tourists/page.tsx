import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersClient from "@/components/Users/UsersClient";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of tourists",
};

export default function TouristsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tourist" />
      <UsersClient role="TOURIST" />
    </DefaultLayout>
  );
}
