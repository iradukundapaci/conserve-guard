import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AnimalMap from "@/components/animals/animalMap";
import IncidentPage from "@/components/Incidents/incidents";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "Incidents Page",
};

export default function IncidentsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Incidents" />
      <IncidentPage />
    </DefaultLayout>
  );
}
