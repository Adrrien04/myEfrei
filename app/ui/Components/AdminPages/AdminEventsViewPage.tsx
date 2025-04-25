"use client";

import { useEffect, useState } from "react";
import { getEvents, Event } from "@/app/ui/Components/Events/getEvents";

function AdminEventsViewPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchEvents();
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">
        Gestion des événements
      </h2>
      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600 text-sm">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm">📍 {event.location}</p>
            </div>
            <button
              onClick={() => handleDelete(event.id)}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminEventsViewPage;
