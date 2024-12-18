import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "Ranger Schedules",
};

export default function SchedulePage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Schedule" />
      <CalendarBox />
    </DefaultLayout>
  );
}
