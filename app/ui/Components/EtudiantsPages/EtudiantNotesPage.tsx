"use client";
import { useEffect, useState } from "react";

interface Note {
    id: string;
    cours: string;
    matiere: string;
    note: number;
    commentaire?: string;
    professeur: string;
}

export default function EtudiantNotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [selectedCours, setSelectedCours] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setFeedbackMessage("❌ Utilisateur non connecté.");
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const studentId = payload.id;
                const res = await fetch(`/api/student/${studentId}/notes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("❌ Erreur récupération des notes :", errorText);
                    setFeedbackMessage("❌ Erreur lors de la récupération des notes.");
                    return;
                }

                const data = await res.json();
                setNotes(data);
            } catch (err) {
                console.error("❌ Erreur inattendue :", err);
                setFeedbackMessage("❌ Erreur inattendue lors de la récupération des notes.");
            }
        };

        fetchNotes();
    }, []);

    const handleCoursClick = (cours: string) => {
        if (selectedCours === cours) {
            setSelectedCours(null);
        } else {
            setSelectedCours(cours);
        }
    };

    const filteredNotes = selectedCours
        ? notes.filter((note) => note.cours === selectedCours)
        : notes;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">📚 Mes Notes</h2>

            {feedbackMessage && (
                <div
                    className={`mb-4 px-4 py-2 rounded text-sm ${
                        feedbackMessage.startsWith("✅")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {feedbackMessage}
                </div>
            )}

            {notes.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {Array.from(new Set(notes.map((note) => note.cours))).map((cours) => (
                            <div
                                key={cours}
                                className="cursor-pointer w-full border rounded-xl p-6 bg-gray-100 shadow hover:bg-gray-200"
                                onClick={() => handleCoursClick(cours)}
                            >
                                <h3 className="text-lg font-semibold">{cours}</h3>
                                {selectedCours === cours && (
                                    <div className="mt-2">
                                        <table className="min-w-full bg-white border rounded-xl shadow">
                                            <thead>
                                            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                                                <th className="p-3">Matière</th>
                                                <th className="p-3">Note</th>
                                                <th className="p-3">Commentaire</th>
                                                <th className="p-3">Professeur</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredNotes
                                                .filter((note) => note.cours === cours)
                                                .map((note) => (
                                                    <tr key={note.id} className="border-t">
                                                        <td className="p-3">{note.matiere}</td>
                                                        <td className="p-3">{note.note}</td>
                                                        <td className="p-3">{note.commentaire || "—"}</td>
                                                        <td className="p-3">{note.professeur}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Aucune note disponible pour le moment.</p>
            )}
        </div>
    );
}
