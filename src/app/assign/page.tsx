import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AssignUsersToGroups from "@/components/groups/asignment";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "List of Groups Assignment",
};

export default function GroupsAssignmentPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Groups Assignment" />
      <AssignUsersToGroups />
    </DefaultLayout>
  );
}
