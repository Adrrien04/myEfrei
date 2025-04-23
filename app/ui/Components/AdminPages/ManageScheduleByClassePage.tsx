"use client";
import { useEffect, useState } from "react";

const ManageScheduleByClassePage = () => {
  const [filieres, setFilieres] = useState<string[]>([]);
  const [niveau, setNiveau] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [emploi, setEmploi] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/filieres")
      .then((res) => res.json())
      .then((data) => setFilieres(data));
  }, []);

  const handleLoadSchedule = async () => {
    if (!selectedFiliere || !niveau) return;

    try {
      const res = await fetch(`/api/admin/edt?filiere=${selectedFiliere}&niveau=${niveau}`);
      const data = await res.json();

      if (res.ok) {
        setEmploi(data);
      } else {
        setMessage(data.error || "Erreur lors du chargement");
        setEmploi([]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de récupération");
    }
  };

  const handleDelete = async (jour: string, heure: string) => {
    if (!confirm("Supprimer ce créneau ?")) return;

    try {
      const res = await fetch("/api/admin/attributions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filiere: selectedFiliere, niveau, jour, heure }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Créneau supprimé");
        handleLoadSchedule();
      } else {
        setMessage(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la suppression");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">📅 Emploi du temps par classe</h2>

      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
        >
          <option value="">Choisir niveau</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>

        <select
          className="p-2 border rounded"
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
        >
          <option value="">Choisir filière</option>
          {filieres.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>

        <button
          onClick={handleLoadSchedule}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Charger
        </button>
      </div>

      {message && <p className="text-red-500 mb-2">{message}</p>}

      {emploi.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Jour</th>
              <th className="border p-2">Heure</th>
              <th className="border p-2">Cours</th>
              <th className="border p-2">Professeur</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emploi.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{item.jour}</td>
                <td className="border p-2">{item.heure}</td>
                <td className="border p-2">{item.cours}</td>
                <td className="border p-2">{item.prof || "—"}</td>
                <td className="border p-2">
                  <button className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded">
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(item.jour, item.heure)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageScheduleByClassePage;