"use client";

import React, { useState, useEffect } from "react";
import { generatePDFReport } from "./generateReport";

interface Group {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  groupId: number;
  weekDay: string;
  dutyStart: string;
  dutyEnd: string;
  task: string;
  group: Group;
}

interface FormData {
  groupId: string;
  weekDay: string;
  dutyStart: string;
  dutyEnd: string;
  task: string;
}

const CalendarBox: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [formData, setFormData] = useState<FormData>({
    groupId: "",
    weekDay: "",
    dutyStart: "",
    dutyEnd: "",
    task: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchGroups = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups?page=1&size=10`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setGroups(data.payload?.items || []);
    } catch (error) {
      setError("Failed to load groups. Please try again later.");
      console.error("Error fetching groups:", error);
    }
  };

  const fetchSchedules = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/schedule?page=1&size=10`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await response.json();
      setSchedules(data.payload?.items || []);
    } catch (error) {
      setError("Failed to load schedules. Please try again later.");
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchSchedules();
  }, []);

  const validateForm = (): boolean => {
    if (!formData.groupId) {
      setError("Please select a group");
      return false;
    }

    const startTime = new Date(`1970-01-01T${formData.dutyStart}`);
    const endTime = new Date(`1970-01-01T${formData.dutyEnd}`);
    if (endTime <= startTime) {
      setError("End time must be after start time");
      return false;
    }

    if (formData.task.trim().length === 0) {
      setError("Task description is required");
      return false;
    }

    if (!formData.weekDay) {
      setError("Please select a weekday");
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/schedule/${editId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/schedule`;

    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          groupId: Number(formData.groupId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message?.[0] || "Failed to save schedule");
      }

      setFormData({
        groupId: "",
        weekDay: "",
        dutyStart: "",
        dutyEnd: "",
        task: "",
      });
      setIsEditing(false);
      setEditId(null);
      await fetchSchedules();
    } catch (error) {
      setError("Failed to save schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/schedule/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }

      await fetchSchedules();
    } catch (error) {
      setError("Failed to delete schedule");
      console.error("Error deleting schedule:", error);
    }
  };

  const handleEdit = (schedule: Schedule): void => {
    setFormData({
      groupId: schedule.group.id.toString(),
      weekDay: schedule.weekDay,
      dutyStart: schedule.dutyStart,
      dutyEnd: schedule.dutyEnd,
      task: schedule.task,
    });
    setIsEditing(true);
    setEditId(schedule.id);
    setError("");
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  return (
    <div className="w-full max-w-full rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-900">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2 focus:border-primary focus:outline-none dark:bg-gray-800"
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            name="weekDay"
            value={formData.weekDay}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2 focus:border-primary focus:outline-none dark:bg-gray-800"
          >
            <option value="">Select Weekday</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            type="time"
            name="dutyStart"
            value={formData.dutyStart}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2 focus:border-primary focus:outline-none dark:bg-gray-800"
          />
          <input
            type="time"
            name="dutyEnd"
            value={formData.dutyEnd}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2 focus:border-primary focus:outline-none dark:bg-gray-800"
          />
          <input
            type="text"
            name="task"
            placeholder="Task"
            value={formData.task}
            onChange={handleInputChange}
            required
            className="rounded-md border p-2 focus:border-primary focus:outline-none dark:bg-gray-800"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update Schedule"
              : "Create Schedule"}
        </button>
      </form>

      <button
        onClick={() => generatePDFReport(schedules)}
        className="mt-4 w-full rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 md:w-auto"
      >
        Download PDF Report
      </button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="rounded-lg border p-4 shadow-sm dark:border-gray-700"
          >
            <h3 className="mb-3 text-center font-bold">{day}</h3>
            <div className="space-y-2">
              {schedules
                .filter((schedule) => schedule.weekDay === day)
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className="rounded-md bg-gray-50 p-3 dark:bg-gray-800"
                  >
                    <p className="text-sm font-medium">{schedule.task}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {schedule.dutyStart} - {schedule.dutyEnd}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Group: {schedule.group.name}
                    </p>
                    <div className="mt-2 flex justify-between space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="rounded bg-blue-500 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white transition-colors hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarBox;
