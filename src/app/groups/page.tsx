import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import GroupsTable from "@/components/groups/groupsTable";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of Groups",
};

export default function GroupsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Groups" />
      <GroupsTable />
    </DefaultLayout>
  );
}
