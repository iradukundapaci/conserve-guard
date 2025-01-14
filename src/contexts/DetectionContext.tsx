import React, { createContext, useContext, useState, useEffect } from "react";

interface Detection {
  class: string;
  score: number;
  timestamp: Date;
  type: "detection";
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: "detection" | "incident";
  data: Detection | Incident;
}

interface DetectionContextType {
  notifications: NotificationItem[];
  addDetection: (detection: Omit<Detection, "timestamp" | "type">) => void;
  clearNotifications: () => void;
  unreadCount: number;
  markAllAsRead: () => void;
  refreshIncidents: () => Promise<void>;
}

const DetectionContext = createContext<DetectionContextType | null>(null);

export const DetectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentlyDetected, setRecentlyDetected] = useState<Set<string>>(
    new Set(),
  );

  // Clear the recently detected set after a timeout
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRecentlyDetected(new Set());
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    refreshIncidents();
  }, []);

  const refreshIncidents = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/incidents?page=1&size=10`,
      );
      const data: IncidentResponse = await response.json();

      const incidentNotifications: NotificationItem[] = data.payload.items.map(
        (incident) => ({
          id: `incident-${incident.id}`,
          title: `Incident Report by ${incident.ranger.names}`,
          description: incident.description,
          timestamp: new Date(incident.createdAt),
          type: "incident",
          data: incident,
        }),
      );

      setNotifications((prev) => {
        const existingDetections = prev.filter((n) => n.type === "detection");
        return [...existingDetections, ...incidentNotifications].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
        );
      });
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
    }
  };

  const addDetection = (detection: Omit<Detection, "timestamp" | "type">) => {
    const detectionKey = `${detection.class}-${Math.round(detection.score)}`;

    if (!recentlyDetected.has(detectionKey)) {
      const newDetection: NotificationItem = {
        id: `detection-${Date.now()}`,
        title: `New ${detection.class} Detected`,
        description: `Confidence: ${detection.score.toFixed(1)}%`,
        timestamp: new Date(),
        type: "detection",
        data: { ...detection, timestamp: new Date(), type: "detection" },
      };

      setNotifications((prev) => [newDetection, ...prev].slice(0, 50));
      setUnreadCount((prev) => prev + 1);

      setRecentlyDetected((prev) => {
        const newSet = new Set(prev);
        newSet.add(detectionKey);
        return newSet;
      });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setRecentlyDetected(new Set());
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <DetectionContext.Provider
      value={{
        notifications,
        addDetection,
        clearNotifications,
        unreadCount,
        markAllAsRead,
        refreshIncidents,
      }}
    >
      {children}
    </DetectionContext.Provider>
  );
};
export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error("useDetection must be used within a DetectionProvider");
  }
  return context;
};
