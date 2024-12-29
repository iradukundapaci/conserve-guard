"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ImageIcon, Edit, Trash2, Download, X, FileDown } from "lucide-react";

// Types
interface Ranger {
  id: number;
  names: string;
}

interface ReportOptions {
  type: "weekly" | "monthly";
  format: "pdf" | "xlsx" | "csv" | "json";
}

interface Incident {
  id: number;
  createdAt: string;
  updatedAt: string;
  dateCaught: string;
  description?: string;
  evidence: string[];
  ranger?: Ranger;
  status: "PENDING" | "RESOLVED" | "CLOSED";
}

interface FormData {
  poacherName: string;
  dateCaught: string;
  status: "PENDING" | "RESOLVED" | "CLOSED";
  description: string;
  evidence: File[];
}

const INITIAL_FORM_DATA: FormData = {
  poacherName: "",
  dateCaught: "",
  status: "PENDING",
  description: "",
  evidence: [],
};

const IncidentPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getToken = () => localStorage.getItem("accessToken") || "";

  const api = {
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    headers: () => ({
      Authorization: `Bearer ${getToken()}`,
    }),

    async fetchIncidents() {
      const response = await axios.get(`${this.baseURL}/incidents`, {
        headers: this.headers(),
      });
      return response.data.payload?.items || [];
    },

    async createIncident(formData: FormData) {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "evidence" && Array.isArray(value)) {
          value.forEach((file) => form.append("files", file));
        } else {
          form.append(key, value as string);
        }
      });

      return axios.post(`${this.baseURL}/incidents`, form, {
        headers: {
          ...this.headers(),
          "Content-Type": "multipart/form-data",
        },
      });
    },

    async updateIncident(id: number, formData: FormData) {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "evidence" && Array.isArray(value)) {
          value.forEach((file) => form.append("files", file));
        } else {
          form.append(key, value as string);
        }
      });

      return axios.put(`${this.baseURL}/incidents/${id}`, form, {
        headers: {
          ...this.headers(),
          "Content-Type": "multipart/form-data",
        },
      });
    },

    async deleteIncident(id: number) {
      return axios.delete(`${this.baseURL}/incidents/${id}`, {
        headers: this.headers(),
      });
    },

    async fetchImage(filename: string) {
      return axios.get(`${this.baseURL}/incidents/download/${filename}`, {
        responseType: "blob",
        headers: this.headers(),
      });
    },

    async downloadReport(options: ReportOptions) {
      const response = await axios.get(
        `${this.baseURL}/incidents/report?type=${options.type}&format=${options.format}`,
        {
          responseType: "blob",
          headers: this.headers(),
        },
      );
      return response.data;
    },
  };

  // Image handling
  const loadImage = useCallback(async (filename: string) => {
    try {
      const response = await api.fetchImage(filename);
      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      setImageUrls((prev) => ({ ...prev, [filename]: blobUrl }));
    } catch (error) {
      console.error(`Error loading image ${filename}:`, error);
    }
  }, []);

  const loadImagesForIncidents = useCallback(
    (incidents: Incident[]) => {
      incidents.forEach((incident) => {
        incident.evidence.forEach((filename) => {
          if (!imageUrls[filename]) {
            loadImage(filename);
          }
        });
      });
    },
    [imageUrls, loadImage],
  );

  // Data fetching
  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const items = await api.fetchIncidents();
      setIncidents(items);
      loadImagesForIncidents(items);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportDownload = async (options: ReportOptions) => {
    setIsDownloading(true);
    try {
      const blob = await api.downloadReport(options);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `incident-report-${options.type}.${options.format}`;
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setShowReportModal(false);
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Add Report Modal component
  const ReportModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Download Report</h2>
          <button
            onClick={() => setShowReportModal(false)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Weekly Reports</h3>
            <div className="flex flex-wrap gap-2">
              {["pdf", "xlsx", "csv", "json"].map((format) => (
                <button
                  key={format}
                  onClick={() =>
                    handleReportDownload({
                      type: "weekly",
                      format: format as ReportOptions["format"],
                    })
                  }
                  disabled={isDownloading}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Monthly Reports</h3>
            <div className="flex flex-wrap gap-2">
              {["pdf", "xlsx", "csv", "json"].map((format) => (
                <button
                  key={format}
                  onClick={() =>
                    handleReportDownload({
                      type: "monthly",
                      format: format as ReportOptions["format"],
                    })
                  }
                  disabled={isDownloading}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isDownloading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Preparing your report...
          </div>
        )}
      </div>
    </div>
  );

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        evidence: Array.from(e.target.files || []),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIncident) {
        await api.updateIncident(editingIncident.id, formData);
      } else {
        await api.createIncident(formData);
      }
      await fetchIncidents();
      resetForm();
    } catch (error) {
      console.error("Error saving incident:", error);
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setEditingIncident(null);
    setShowForm(false);
  };

  const startEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setFormData({
      poacherName: incident.ranger?.names || "",
      dateCaught: new Date(incident.dateCaught).toISOString().slice(0, 10),
      status: incident.status,
      description: incident.description || "",
      evidence: [],
    });
    setShowForm(true);
  };

  const downloadImage = async (filename: string) => {
    try {
      const response = await api.fetchImage(filename);
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Effects
  useEffect(() => {
    fetchIncidents();
    return () => {
      // Cleanup blob URLs
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Components
  const IncidentForm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingIncident ? "Edit Incident" : "Create New Incident"}
          </h2>
          <button
            onClick={resetForm}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Poacher Name
              </label>
              <input
                name="poacherName"
                value={formData.poacherName}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Date Caught
              </label>
              <input
                type="date"
                name="dateCaught"
                value={formData.dateCaught}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-md border p-2"
            >
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Evidence</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {editingIncident ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ImageModal = () =>
    selectedImage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="mx-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Evidence Image</h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadImage(selectedImage)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {imageUrls[selectedImage] && (
            <img
              src={imageUrls[selectedImage]}
              alt="Evidence"
              className="h-100 w-100"
            />
          )}
        </div>
      </div>
    );

  const IncidentCard = ({ incident }: { incident: Incident }) => (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {incident.ranger?.names || "Unknown Poacher"}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(incident.dateCaught).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startEdit(incident)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => api.deleteIncident(incident.id).then(fetchIncidents)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-600">{incident.description}</p>
      {incident.evidence.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {incident.evidence.map((filename, index) => (
            <div
              key={index}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => setSelectedImage(filename)}
            >
              {imageUrls[filename] ? (
                <img
                  src={imageUrls[filename]}
                  alt={`Evidence ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <FileDown className="h-4 w-4" />
            Download Report
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add New Incident
          </button>
        </div>
      </div>

      {showForm && <IncidentForm />}
      {showReportModal && <ReportModal />}
      <ImageModal />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading incidents...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentPage;
