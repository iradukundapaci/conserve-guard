"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Animal {
  id: number;
  names: string;
  species: string;
  latitude: number;
  longitude: number;
}

interface ApiResponse {
  payload: {
    items: Animal[];
  };
  message?: string;
}

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

// Dynamically import other map components
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false },
);

const createCustomIcon = (color = "#2563eb"): L.DivIcon => {
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;

  return L.divIcon({
    html: svgTemplate,
    className: "custom-pin-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
    tooltipAnchor: [12, -30],
  });
};

const AnimalMap: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  const API_BASE_URL = `${process.env.API_URL}/api/v1/animals`;

  useEffect(() => {
    // Add custom styles for the pin icon and tooltip
    const style = document.createElement("style");
    style.textContent = `
      .custom-pin-icon {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-tooltip {
        background: white;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 8px;
        border-radius: 4px;
        font-size: 14px;
      }
      .custom-tooltip::before {
        display: none;
      }
    `;
    document.head.appendChild(style);
    setMapReady(true);
    fetchAnimals();
  }, []);

  const fetchAnimals = async (page = 1, size = 10): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`);
      const data: ApiResponse = await response.json();
      if (response.ok) {
        setAnimals(data.payload.items);
      } else {
        setError(data.message || "Failed to fetch animals.");
      }
    } catch (err) {
      setError("An error occurred while fetching animals.");
    } finally {
      setLoading(false);
    }
  };

  const createAnimal = async (newAnimal: Omit<Animal, "id">): Promise<void> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnimal),
      });
      const data: ApiResponse = await response.json();
      if (response.ok) {
        fetchAnimals();
      } else {
        setError(data.message || "Failed to create animal.");
      }
    } catch (err) {
      setError("An error occurred while creating an animal.");
    }
  };

  const deleteAnimal = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAnimals();
      } else {
        setError("Failed to delete animal.");
      }
    } catch (err) {
      setError("An error occurred while deleting an animal.");
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const animal = {
      names: formData.get("names") as string,
      species: formData.get("species") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
    };
    createAnimal(animal);
    event.currentTarget.reset();
  };

  const customIcon = createCustomIcon();

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">
          Animal Locations in Akagera National Park
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="names"
              placeholder="Name"
              required
              className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="species"
              placeholder="Species"
              required
              className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="any"
              name="latitude"
              placeholder="Latitude"
              required
              className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="any"
              name="longitude"
              placeholder="Longitude"
              required
              className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Add Animal
          </button>
        </form>

        {loading && <div className="p-4 text-center">Loading animals...</div>}

        {mapReady && (
          <div className="h-[500px] w-full overflow-hidden rounded-lg border">
            <MapContainer
              center={[-1.875, 30.058]}
              zoom={10}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {animals.map((animal) => (
                <Marker
                  key={animal.id}
                  position={[animal.latitude, animal.longitude]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      if (
                        window.confirm("Do you want to delete this animal?")
                      ) {
                        deleteAnimal(animal.id);
                      }
                    },
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -20]}
                    opacity={1}
                    permanent={false}
                    className="custom-tooltip"
                  >
                    <div className="font-medium">
                      <div>{animal.names}</div>
                      <div className="text-gray-600">
                        Species: {animal.species}
                      </div>
                    </div>
                  </Tooltip>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{animal.names}</h3>
                      <p>Species: {animal.species}</p>
                      <p>
                        Location: ({animal.latitude}, {animal.longitude})
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Click marker to delete
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalMap;
