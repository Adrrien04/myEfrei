"use client";
import { useState, useEffect } from "react";

const SchedulePageProf = () => {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = ["08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h"];
  const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non connecté (token manquant)");

        const response = await fetch("/api/auth/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await response.json();
        if (!response.ok || !userData.authenticated || userData.role !== "profs") {
          throw new Error("Accès réservé aux professeurs");
        }

        const scheduleResponse = await fetch(
          `/api/admin/profs/schedule?id=${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const scheduleData = await scheduleResponse.json();

        if (!scheduleResponse.ok || !Array.isArray(scheduleData.emploi_du_temps)) {
          throw new Error("Aucun emploi du temps trouvé");
        }

        const parsedSchedule: Record<string, Record<string, string>> = {};

       scheduleData.emploi_du_temps.forEach((entry: any) => {
          const { jour, heure, cours, groupe } = entry;
          if (!parsedSchedule[jour]) parsedSchedule[jour] = {};
          parsedSchedule[jour][heure] = `${cours}<br/><span class='text-sm text-gray-500'>Classe : ${groupe}</span>`;
        });

        setSchedule(parsedSchedule);
      } catch (error: any) {
        console.error("❌ Erreur emploi du temps prof :", error);
        setError("Erreur lors de la récupération de l'emploi du temps.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center">📅 Emploi du temps professeur</h1>
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
            <tr key={index}>
              <td className="border p-2 font-bold">{heure}</td>
              {jours.map((jour) => (
                <td key={jour} className="border p-2 text-center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: schedule[jour]?.[heure] || "",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePageProf;
