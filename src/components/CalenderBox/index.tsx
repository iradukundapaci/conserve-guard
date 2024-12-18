"use client";

import React, { useState, useEffect } from "react";

const CalendarBox = () => {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    rangerId: "",
    weekDay: "",
    dutyStart: "",
    dutyEnd: "",
    location: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch schedules from the backend
  const fetchSchedules = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/schedule?page=1&size=10",
      );
      const data = await response.json();
      setSchedules(data.payload?.items || []); // Access the items or default to an empty array
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for creating or editing a schedule
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `http://localhost:8000/api/v1/schedule/${editId}`
      : "http://localhost:8000/api/v1/schedule";

    const method = isEditing ? "PATCH" : "POST";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Reset form and state
      setFormData({
        rangerId: "",
        weekDay: "",
        dutyStart: "",
        dutyEnd: "",
        location: "",
      });
      setIsEditing(false);
      setEditId(null);
      fetchSchedules(); // Refresh the schedule list
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  // Handle editing a schedule
  const handleEdit = (schedule) => {
    setFormData({
      rangerId: schedule.rangerId,
      weekDay: schedule.weekDay,
      dutyStart: schedule.dutyStart,
      dutyEnd: schedule.dutyEnd,
      location: schedule.location,
    });
    setIsEditing(true);
    setEditId(schedule.id);
  };

  // Days of the week
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
    <div className="w-full max-w-full rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit} className="mb-4 rounded bg-gray-100 p-4">
        <input
          type="number"
          name="rangerId"
          placeholder="Ranger ID"
          value={formData.rangerId}
          onChange={handleInputChange}
          required
          className="m-2 rounded border p-2"
        />
        <select
          name="weekDay"
          value={formData.weekDay}
          onChange={handleInputChange}
          required
          className="m-2 rounded border p-2"
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
          className="m-2 rounded border p-2"
        />
        <input
          type="time"
          name="dutyEnd"
          value={formData.dutyEnd}
          onChange={handleInputChange}
          required
          className="m-2 rounded border p-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
          className="m-2 rounded border p-2"
        />
        <button type="submit" className="rounded bg-primary p-2 text-white">
          {isEditing ? "Update Schedule" : "Create Schedule"}
        </button>
      </form>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="rounded border p-4">
            <h3 className="mb-2 text-center font-bold">{day}</h3>
            {schedules
              .filter((schedule) => schedule.weekDay === day)
              .map((schedule) => (
                <div
                  key={schedule.id}
                  className="mb-2 cursor-pointer rounded bg-gray-200 p-2"
                  onClick={() => handleEdit(schedule)}
                >
                  <p className="text-sm font-medium">{schedule.location}</p>
                  <p className="text-xs">
                    {schedule.dutyStart} - {schedule.dutyEnd}
                  </p>
                  <p className="text-xs">Ranger ID: {schedule.ranger.id}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarBox;
