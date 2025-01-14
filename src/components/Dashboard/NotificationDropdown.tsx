"use client";
import React, { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { useDetection } from "@/contexts/DetectionContext";

const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, refreshIncidents } =
    useDetection();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const handleRefresh = async () => {
    await refreshIncidents();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-3">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button
              onClick={handleRefresh}
              className="rounded-full p-1 hover:bg-gray-100"
              title="Refresh incidents"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-gray-100 p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        notification.type === "incident"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {notification.type}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {notification.description}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {notification.timestamp.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
