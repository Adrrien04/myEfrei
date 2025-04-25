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
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/classes/${encodeURIComponent(classe)}/eleves`);
      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Erreur lors de la récupération des élèves :", error);
        return;
      }
      const data = await res.json();
      setEleves(data);
    } catch (err) {
      console.error("❌ Erreur inattendue lors de la récupération des élèves :", err);
    }
  };

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">📚 Mes cours</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cours.flatMap((c) => 
            c.classe.split(",").map((classe) => ({
              ...c,
              classe: classe.trim()
            }))
          ).map((c) => (
            <div
              key={`${c.id}-${c.classe}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer bg-white"
              onClick={() => handleCoursClick(c.classe)}
            >
              <h3 className="text-lg font-semibold">{c.nom}</h3>
              <p className="text-gray-600">{c.matiere}</p>
              <p className="text-sm text-gray-500">Classe : {c.classe}</p>
            </div>
          ))}
        </div>

        {selectedClasse && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                ✏️ Élèves de la classe {selectedClasse}
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl shadow">
                  <thead>
                  <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Niveau</th>
                    <th className="p-3">Filière</th>
                    <th className="p-3">Note</th>
                    <th className="p-3">Commentaire</th>
                    <th className="p-3">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {eleves.map((e) => (
                      <tr key={e.id} className="border-t">
                        <td className="p-3">
                          {e.prenom} {e.nom}
                        </td>
                        <td className="p-3">{e.niveau}</td>
                        <td className="p-3">{e.filiere}</td>
                        <td className="p-3">
                          <input
                              type="number"
                              min={0}
                              max={20}
                              step={0.1}
                              className="border rounded px-2 py-1 w-20"
                              placeholder="Note"
                              onChange={(ev) =>
                                  setEleves((prev) =>
                                      prev.map((el) =>
                                          el.id === e.id ? { ...el, note: parseFloat(ev.target.value) } : el
                                      )
                                  )
                              }
                          />
                        </td>
                        <td className="p-3">
                      <textarea
                          rows={1}
                          className="border rounded px-2 py-1 w-full"
                          placeholder="Commentaire"
                          onChange={(ev) =>
                              setEleves((prev) =>
                                  prev.map((el) =>
                                      el.id === e.id ? { ...el, commentaire: ev.target.value } : el
                                  )
                              )
                          }
                      />
                        </td>
                        <td className="p-3">
                          <button
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              onClick={async () => {
                                const { id, note, commentaire } = e;
                                const selectedCours = cours.find((c) => c.classe === selectedClasse);

                                if (note == null || isNaN(note)) {
                                  setFeedbackMessage("❌ Veuillez entrer une note valide.");
                                  return;
                                }

                                if (!selectedCours) {
                                  setFeedbackMessage("❌ Cours introuvable pour cette classe.");
                                  return;
                                }

                                const payload = {
                                  id_eleve: id,
                                  id_cours: selectedCours.id,
                                  note,
                                  commentaire: commentaire || "",
                                };

                                const res = await fetch("/api/notes", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(payload),
                                });

                                const result = await res.json();
                                if (res.ok) {
                                  setFeedbackMessage("✅ Attribution réussie !");
                                } else {
                                  setFeedbackMessage("❌ Erreur : " + result.error);
                                }
                              }}
                          >
                            Enregistrer
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              {feedbackMessage && (
                  <div
                      className={`mt-4 px-4 py-2 rounded text-sm ${
                          feedbackMessage.startsWith("✅")
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                  >
                    {feedbackMessage}
                  </div>
              )}
            </>
        )}
      </div>
  );
}
