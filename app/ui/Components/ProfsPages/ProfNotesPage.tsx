"use client";
import { useEffect, useState } from "react";

interface Cours {
  id: string;
  nom: string;
  matiere: string;
  classe: string;
}

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  niveau: string;
  filiere: string;
  note?: number;
  commentaire?: string;
}

export default function ProfNotesPage() {
  const [cours, setCours] = useState<Cours[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    const fetchCours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ Token manquant");
        return;
      }

      try {
        const res = await fetch("/api/profs/cours", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Erreur récupération cours :", errorText);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setCours(data);
        } else {
          console.error("❌ Données de cours non valides :", data);
        }
      } catch (err) {
        console.error("❌ Erreur inattendue :", err);
      }
    };

    fetchCours();
  }, []);

  const handleCoursClick = async (classe: string) => {
    setSelectedClasse(classe);
    try {
      const res = await fetch(`/api/classes/${encodeURIComponent(classe)}/eleves`);
      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Erreur lors de la récupération des élèves :", error);
        return;
      }
      const data = await res.json();
      console.log("✅ Élèves récupérés :", data);
      setEleves(data);
    } catch (err) {
      console.error("❌ Erreur inattendue lors de la récupération des élèves :", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mes cours</h2>
      <ul className="mb-6">
        {cours.map((c) => (
          <li key={c.id}>
            <button
              className="text-blue-600 underline hover:text-blue-800"
              onClick={() => handleCoursClick(c.classe)}
            >
              {c.nom} ({c.matiere}) - {c.classe}
            </button>
          </li>
        ))}
      </ul>

      {selectedClasse && (
        <>
          <h3 className="text-lg font-medium mb-2">Élèves de {selectedClasse}</h3>
          <ul className="space-y-1">
            {eleves.map((e) => (
              <li key={e.id} className="flex items-center gap-2">
                <span className="w-64">
                  {e.prenom} {e.nom} - {e.niveau} {e.filiere}
                </span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  placeholder="Note sur 20"
                  onChange={(ev) =>
                    setEleves((prev) =>
                      prev.map((el) =>
                        el.id === e.id ? { ...el, note: parseFloat(ev.target.value) } : el
                      )
                    )
                  }
                  className="border px-2 py-1 w-24"
                />
                <textarea
                  placeholder="Commentaire"
                  onChange={(ev) =>
                    setEleves((prev) =>
                      prev.map((el) =>
                        el.id === e.id ? { ...el, commentaire: ev.target.value } : el
                      )
                    )
                  }
                  className="border px-2 py-1 w-64"
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    const { id, note, commentaire } = e;

                    const selectedCours = cours.find((c) => c.classe === selectedClasse);

                    if (note == null || isNaN(note)) {
                      alert("Veuillez entrer une note valide.");
                      return;
                    }

                    if (!selectedCours) {
                      alert("❌ Cours introuvable pour cette classe.");
                      return;
                    }

                    const payload = {
                      id_eleve: id,
                      id_cours: selectedCours.id,
                      note,
                      commentaire: commentaire || "",
                    };

                    console.log("🟨 Envoi :", payload);

                    const res = await fetch("/api/notes", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(payload),
                    });

                    const result = await res.json();
                    if (res.ok) {
                      alert("✅ Note enregistrée !");
                    } else {
                      alert("❌ Erreur : " + result.error);
                    }
                  }}
                >
                  Enregistrer
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
