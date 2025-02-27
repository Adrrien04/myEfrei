"use client";
import { useState, useEffect } from "react";

const SchedulePage = () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const heures = ["08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h"];
    const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("/api/auth/check");
                const userData = await response.json();

                if (!response.ok || !userData.authenticated) {
                    throw new Error("Utilisateur non connecté");
                }

                const numeroEtudiant = userData.numeroetudiant;
                if (!numeroEtudiant) {
                    throw new Error("Numéro d'étudiant non trouvé");
                }

                const scheduleResponse = await fetch(`/api/student/schedule?numeroetudiant=${numeroEtudiant}`);
                const scheduleData = await scheduleResponse.json();

                if (!scheduleResponse.ok || !scheduleData.emploi_du_temps) {
                    throw new Error("Aucun emploi du temps trouvé");
                }

                console.log("📌 Emploi du temps récupéré :", scheduleData.emploi_du_temps);

                const parsedSchedule: Record<string, Record<string, string>> = {};

                scheduleData.emploi_du_temps.split("\n").forEach((entry: string) => {
                    const [jour, heure, cours] = entry.split(" | ");
                    if (!parsedSchedule[jour]) {
                        parsedSchedule[jour] = {};
                    }
                    parsedSchedule[jour][heure] = cours;
                });

                setSchedule(parsedSchedule);
            } catch (error) {
                console.error("❌ Erreur récupération emploi du temps :", error);
                setError("Erreur lors de la récupération de l'emploi du temps.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    if (loading) return <p>🔄 Chargement...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center">📅 Mon Emploi du Temps</h1>

            <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Heures</th>
                        {jours.map((jour) => (
                            <th key={jour} className="border p-2">{jour}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {heures.map((heure, index) => (
                        <tr key={index} className="border">
                            <td className="border p-2 font-bold">{heure}</td>
                            {jours.map((jour, jIndex) => (
                                <td key={jIndex} className="border p-2 text-center">
                                    {schedule[jour]?.[heure] || "⏳ (Vide)"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="text-gray-600">
                {Object.keys(schedule).length > 0 
                    ? "📌 Emploi du temps reçu"
                    : "Aucun cours prévu cette semaine"}
            </p>
        </div>
    );
};

export default SchedulePage;