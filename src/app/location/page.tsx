import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";
import AnimalMap from "@/components/animals/animalMap";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "Animal Locations",
};

export default function LocationPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Location" />
      <AnimalMap />
    </DefaultLayout>
  );
}
