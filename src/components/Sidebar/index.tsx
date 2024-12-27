"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
        route: "/users",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 5c1.66 0 3-1.34 3-3S13.66 1 12 1 9 2.34 9 4s1.34 3 3 3zm6.12 1.5c.83 0 1.5-.67 1.5-1.5S19 3.5 18.12 3.5 16.5 4.17 16.5 5s.67 1.5 1.62 1.5zM6.88 6.5c.83 0 1.5-.67 1.5-1.5S7.71 3.5 6.88 3.5 5.5 4.17 5.5 5s.67 1.5 1.38 1.5zm5.12 1.5c-2.67 0-8 1.34-8 4v3.5c0 1.5.89 2.8 2.25 3.36C7.14 18.5 9.53 18 12 18s4.86.5 5.88 1.36C19.11 17.8 20 16.5 20 15v-3.5c0-2.66-5.33-4-8-4zM4 15v-3.5c0-.94 1.96-2.15 4.88-2.44C7.2 11.24 6 12.12 6 13v2c0 .38.1.73.25 1.06C4.89 15.8 4 15.5 4 15zm12 1c0-.88-1.2-1.76-2.88-2.44C16.04 12.35 18 13.56 18 14.5V15c0 .5-.89.8-2.25.94-.15-.33-.25-.68-.25-1zm0-1c.88 0 1.88.12 2.75.25C19.96 13.65 20 13.12 20 12.5c0-1.12-1.75-2.34-4.88-2.72C15.04 9.76 16 10.64 16 11.5v2z" />
          </svg>
        ),
        label: "Groups",
        route: "/groups",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM4 12c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2V15c0 .66-.54 1.2-1.2 1.2-.66 0-1.2-.54-1.2-1.2v-3zM2 7.6C2 6.71 2.71 6 3.6 6H5c.66 0 1.2.54 1.2 1.2V9.6c0 .66-.54 1.2-1.2 1.2H3.6C2.71 10.8 2 10.09 2 9.2zM12 16c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM16 10c.66 0 1.2.54 1.2 1.2V12c0 .66-.54 1.2-1.2 1.2H8c-.66 0-1.2-.54-1.2-1.2v-.8c0-.66.54-1.2 1.2-1.2h8z" />
          </svg>
        ),
        label: "Assign Users",
        route: "/assign",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm-7-9c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2v3.5l2.25 1.35.75-1.3-1.75-1V13h-1z" />
          </svg>
        ),
        label: "Schedule",
        route: "/schedule",
      },
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
