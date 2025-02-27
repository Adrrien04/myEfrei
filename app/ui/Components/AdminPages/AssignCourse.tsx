"use client";
import { useState, useEffect } from "react";

const AssignCourse = () => {
    const [filieres, setFilieres] = useState<string[]>([]);
    const [niveaux, setNiveaux] = useState<string[]>(["L1", "L2", "L3", "M1", "M2"]);
    const [cours, setCours] = useState<{ id: string; nom: string }[]>([]);
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [selectedCours, setSelectedCours] = useState("");
    const [selectedJour, setSelectedJour] = useState("");
    const [selectedHoraire, setSelectedHoraire] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    const horaires = ["08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h"];

    useEffect(() => {
        fetchFilieres();
        fetchCours();
    }, []);

    const fetchFilieres = async () => {
        const response = await fetch("/api/admin/filieres");
        const data = await response.json();
        setFilieres(data);
    };

    const fetchCours = async () => {
        const response = await fetch("/api/admin/cours");
        const data = await response.json();
        setCours(data);
    };

    const handleAssign = async () => {
        if (!selectedFiliere || !selectedNiveau || !selectedCours || !selectedJour || !selectedHoraire) {
            setMessage("⚠️ Sélectionnez tous les champs !");
            return;
        }

        try {
            const responseEtudiants = await fetch(`/api/admin/etudiants?filiere=${selectedFiliere}&niveau=${selectedNiveau}`);
            const etudiants = await responseEtudiants.json();

            if (!Array.isArray(etudiants) || etudiants.length === 0) {
                setMessage("❌ Aucun étudiant trouvé pour cette filière et ce niveau.");
                return;
            }

            for (const etudiant of etudiants) {
                await fetch("/api/admin/attributions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_cours: selectedCours,
                        id_etudiant: etudiant.numeroetudiant,
                        jour: selectedJour,
                        horaire: selectedHoraire
                    }),
                });
            }

            setMessage("✅ Attribution réussie !");
            setSelectedFiliere("");
            setSelectedNiveau("");
            setSelectedCours("");
            setSelectedJour("");
            setSelectedHoraire("");
        } catch (error) {
            console.error("❌ Erreur lors de l'attribution :", error);
            setMessage("❌ Erreur lors de l'attribution.");
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">📌 Gestion des Attributions</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <label className="block font-semibold mb-1">🏫 Filière</label>
                    <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Sélectionner</option>
                        {filieres.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">🎓 Niveau</label>
                    <select value={selectedNiveau} onChange={(e) => setSelectedNiveau(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Sélectionner</option>
                        {niveaux.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">📚 Cours</label>
                    <select value={selectedCours} onChange={(e) => setSelectedCours(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Sélectionner</option>
                        {cours.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">📅 Jour</label>
                    <select value={selectedJour} onChange={(e) => setSelectedJour(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Sélectionner</option>
                        {jours.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">⏰ Horaire</label>
                    <select value={selectedHoraire} onChange={(e) => setSelectedHoraire(e.target.value)} className="w-full p-2 border rounded">
                        <option value="">Sélectionner</option>
                        {horaires.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>

            <button onClick={handleAssign} className="w-full bg-blue-600 text-white font-semibold p-3 rounded mt-4 hover:bg-blue-700 transition">
                ➕ Assigner le cours
            </button>

            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default AssignCourse;