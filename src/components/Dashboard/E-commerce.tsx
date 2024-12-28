"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AlertCircle, Users, UserCheck, Calendar } from "lucide-react";

interface IncidentDataPoint {
  date: string;
  count: number;
}

interface GroupSize {
  groupId: number;
  size: number;
}

interface AnalyticsData {
  totalUsers: number;
  assignedUsers: number;
  totalGroups: number;
  totalIncidents: number;
  incidentsOverTime: IncidentDataPoint[];
  shiftsPerDay: Record<string, number>;
  groupSizes: GroupSize[];
}

interface ShiftChartDataPoint {
  day: string;
  shifts: number;
}

const ECommerce: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/v1/analytics`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        No data available
      </div>
    );
  }

  // Transform incidents over time data for the line chart
  const incidentsChartData: IncidentDataPoint[] = data.incidentsOverTime || [];

  // Transform shifts per day data for the bar chart
  const shiftsChartData: ShiftChartDataPoint[] = Object.entries(
    data.shiftsPerDay || {},
  ).map(([day, count]) => ({
    day,
    shifts: count,
  }));

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-4">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{data.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-4">
            <UserCheck className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Assigned Users</p>
              <h3 className="text-2xl font-bold">{data.assignedUsers}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-4">
            <Calendar className="text-purple-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Groups</p>
              <h3 className="text-2xl font-bold">{data.totalGroups}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Incidents</p>
              <h3 className="text-2xl font-bold">{data.totalIncidents}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Incidents Over Time Chart */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Incidents Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Shifts per Day Chart */}
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-lg font-semibold">Shifts per Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shiftsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shifts" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Group Sizes Table */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-lg font-semibold">Group Sizes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Group ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Size
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.groupSizes.map((group) => (
                <tr key={group.groupId}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {group.groupId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {group.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
