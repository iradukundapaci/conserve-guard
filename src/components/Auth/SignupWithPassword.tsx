"use client";
import React, { useState } from "react";

export default function SignupWithPassword() {
  const [formData, setFormData] = useState({
    names: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Names */}
      <div className="mb-4">
        <label
          htmlFor="names"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Names
        </label>
        <input
          type="text"
          name="names"
          placeholder="Enter your full name"
          value={formData.names}
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
        />
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full rounded-lg border border-stroke bg-transparent px-6 py-3 font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
        />
      </div>

      {/* Submit Button */}
      <div className="mb-5">
        <button
          type="submit"
          className="hover:bg-primary-dark w-full rounded-lg bg-primary py-2 font-medium text-white"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
