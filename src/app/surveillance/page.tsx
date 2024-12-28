import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import ObjectDetection from "@/components/detection/obectDetection";

export const metadata: Metadata = {
  title: "Conserve Guard",
  description: "Object Detection",
};

export default function Home() {
  return (
    <DefaultLayout>
      <ObjectDetection />
    </DefaultLayout>
  );
}
