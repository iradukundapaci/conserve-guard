"use client";

import React, { useState, useEffect } from "react";

const CalendarBox = () => {
  const [schedules, setSchedules] = useState([]);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    groupId: "",
    weekDay: "",
    dutyStart: "",
    dutyEnd: "",
    task: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch groups from the backend
  const fetchGroups = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/groups?page=1&size=10",
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

  // Fetch schedules from the backend
  const fetchSchedules = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/schedule?page=1&size=10",
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

  const validateForm = () => {
    // Validate groupId
    if (!formData.groupId) {
      setError("Please select a group");
      return false;
    }

    // Validate time format and range
    const startTime = new Date(`1970-01-01T${formData.dutyStart}`);
    const endTime = new Date(`1970-01-01T${formData.dutyEnd}`);
    if (endTime <= startTime) {
      setError("End time must be after start time");
      return false;
    }

    // Validate task
    if (formData.task.trim().length === 0) {
      setError("Task description is required");
      return false;
    }

    // Validate weekDay
    if (!formData.weekDay) {
      setError("Please select a weekday");
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const url = isEditing
      ? `http://localhost:8000/api/v1/schedule/${editId}`
      : "http://localhost:8000/api/v1/schedule";

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
      setError(error.message || "Failed to save schedule");
      console.error("Error saving schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/schedule/${id}`,
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

  const handleEdit = (schedule: any) => {
    setFormData({
      groupId: schedule.group.id.toString(),
      weekDay: schedule.weekDay,
      dutyStart: schedule.dutyStart,
      dutyEnd: schedule.dutyEnd,
      task: schedule.task,
    });
    setIsEditing(true);
    setEditId(schedule.id);
    setError(""); // Clear any existing errors
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
                {group.name} ({group.rangersCount} rangers)
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
                      Group: {schedule.group.name} (
                      {schedule.group.rangersCount} rangers)
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
