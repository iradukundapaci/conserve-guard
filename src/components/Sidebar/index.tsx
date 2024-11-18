"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      // "Dashboard" menu item with icon path
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        ),
        label: "Dashboard",
        route: "/",
      },
      // "Location" menu item with icon path
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
          </svg>
        ),
        label: "Location",
        route: "#",
        children: [
          { label: "Animals", route: "/animals" },
          { label: "Guards", route: "/guards" },
          { label: "Intruders", route: "/intruders" },
        ],
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
          </svg>
        ),
        label: "Users",
        route: "#",
        children: [
          { label: "Admins", route: "/admins" },
          { label: "Rangers", route: "/rangers" },
          { label: "Tourists ", route: "/tourists" },
        ],
      },
      // "Poachers" menu item with icon path
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61l-1.8-1.8a2.29 2.29 0 00-3.2 0L13.05 6.6a5.5 5.5 0 00-7.34 8.01l4.13 4.13a5.5 5.5 0 008.02-7.34l2.14-2.14a2.29 2.29 0 000-3.2z" />
          </svg>
        ),
        label: "Poachers",
        route: "/poachers",
      },
      // "Lawyers" menu item with icon path
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l4 4h-3v9h-2V6H8l4-4zm-6 8v10h12V10H6zm2 8v-6h8v6H8z" />
          </svg>
        ),
        label: "Lawyers",
        route: "/lawyers",
      },
      // "Surveillance" menu item with icon path
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 4c-5 0-9 2.69-9 6s4 6 9 6 9-2.69 9-6-4-6-9-6zm0 10c-3.87 0-7-1.69-7-4s3.13-4 7-4 7 1.69 7 4-3.13 4-7 4zm0 4c-4.41 0-8-1.79-8-4v2c0 2.21 3.59 4 8 4s8-1.79 8-4v-2c0 2.21-3.59 4-8 4z" />
          </svg>
        ),
        label: "Surveillance",
        route: "/surveillance",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 3C6.48 3 2 6.58 2 11c0 1.85.75 3.55 2 4.93V21l4.07-2.4C9.44 19.3 10.7 19.5 12 19.5c5.52 0 10-3.58 10-8.5S17.52 3 12 3zm0 14c-1.12 0-2.18-.18-3.16-.5L5.5 17.5V15.3c-1.06-1.16-1.7-2.58-1.7-4.3C3.8 7.58 7.22 5 12 5s8.2 2.58 8.2 6c0 3.42-3.42 6-8.2 6z" />
          </svg>
        ),
        label: "Chat",
        route: "/chat",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z" />
          </svg>
        ),
        label: "Tables",
        route: "#",
        children: [{ label: "Tables", route: "/tables" }],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/" className="flex items-center gap-2">
            {/* Icon for Project Title */}
            <svg
              className="fill-current text-blue-600 dark:text-blue-400"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM10 17l5-5-5-5v10z" />
            </svg>

            {/* Project Title Text */}
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Akagera ConserveGuard
            </span>
          </Link>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- END SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
