"use client";
import { useState, useEffect } from "react";

const AssignCourse = () => {
    const [filieres, setFilieres] = useState<string[]>([]);
    const [niveaux, setNiveaux] = useState<string[]>(["L1", "L2", "L3", "M1", "M2"]);
    const [cours, setCours] = useState<{ id: string; nom: string }[]>([]);
    const [attributions, setAttributions] = useState<{ 
        id: string; 
        cours_nom: string; 
        numeroetudiant: string; 
        etudiant_nom: string; 
        etudiant_prenom: string; 
        filiere: string;
        niveau: string;
    }[]>([]);
    const [selectedFiliere, setSelectedFiliere] = useState("");
    const [selectedNiveau, setSelectedNiveau] = useState("");
    const [selectedCours, setSelectedCours] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchFilieres();
        fetchCours();
        fetchAttributions();
    }, []);

    const fetchFilieres = async () => {
        try {
            const response = await fetch("/api/admin/filieres");
            const data = await response.json();
            setFilieres(data);
        } catch (error) {
            console.error("Erreur récupération filières:", error);
        }
    };

    const fetchCours = async () => {
        try {
            const response = await fetch("/api/admin/cours");
            const data = await response.json();
            setCours(data);
        } catch (error) {
            console.error("Erreur récupération cours:", error);
        }
    };

    const fetchAttributions = async () => {
        try {
            const response = await fetch("/api/admin/attributions");
            const data = await response.json();
            setAttributions(data);
        } catch (error) {
            console.error("Erreur récupération attributions:", error);
        }
    };

    const handleAssign = async () => {
        if (!selectedFiliere || !selectedNiveau || !selectedCours) {
            setMessage("⚠️ Sélectionnez une filière, un niveau et un cours !");
            return;
        }

        try {
            const responseEtudiants = await fetch(`/api/admin/etudiants?filiere=${selectedFiliere}&niveau=${selectedNiveau}`);
            const etudiants = await responseEtudiants.json();

            console.log("📌 Étudiants récupérés :", etudiants);

            if (!Array.isArray(etudiants) || etudiants.length === 0) {
                setMessage("❌ Aucun étudiant trouvé pour cette filière et ce niveau.");
                return;
            }

            for (const etudiant of etudiants) {
                console.log("📤 Envoi de l'attribution :", { id_cours: selectedCours, id_etudiant: etudiant.numeroetudiant });

                await fetch("/api/admin/attributions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        id_cours: String(selectedCours), 
                        id_etudiant: etudiant.numeroetudiant || etudiant.id 
                    }),
                });
            }

            setMessage("✅ Attribution réussie !");
            setSelectedFiliere("");
            setSelectedNiveau("");
            setSelectedCours("");
            await fetchAttributions();
        } catch (error) {
            console.error("❌ Erreur lors de l'attribution :", error);
            setMessage("❌ Erreur lors de l'attribution.");
        }
    };

    const handleDeleteAttribution = async (id: string) => {
        if (!confirm("⚠️ Voulez-vous vraiment supprimer cette attribution ?")) return;

        try {
            const response = await fetch(`/api/admin/attributions?id=${id}`, { method: "DELETE" });

            if (response.ok) {
                setMessage("✅ Attribution supprimée !");
                await fetchAttributions();
            } else {
                setMessage("❌ Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur suppression attribution:", error);
            setMessage("❌ Erreur de connexion au serveur.");
        }

        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">📌 Gestion des Attributions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block font-semibold mb-1">🏫 Sélectionner une filière</label>
                    <select
                        value={selectedFiliere}
                        onChange={(e) => setSelectedFiliere(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Sélectionner une filière</option>
                        {filieres.map((filiere) => (
                            <option key={filiere} value={filiere}>
                                {filiere}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">🎓 Sélectionner un niveau</label>
                    <select
                        value={selectedNiveau}
                        onChange={(e) => setSelectedNiveau(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Sélectionner un niveau</option>
                        {niveaux.map((niveau) => (
                            <option key={niveau} value={niveau}>
                                {niveau}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">📚 Sélectionner un cours</label>
                    <select
                        value={selectedCours}
                        onChange={(e) => setSelectedCours(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Sélectionner un cours</option>
                        {cours.map((cours) => (
                            <option key={cours.id} value={cours.id}>
                                {cours.nom}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleAssign}
                className="w-full bg-blue-600 text-white font-semibold p-3 rounded mt-4 hover:bg-blue-700 transition"
            >
                ➕ Assigner le cours
            </button>

            {message && <p className="mt-4 text-red-500">{message}</p>}

            <h3 className="text-xl font-bold mt-6 mb-4 text-gray-700">📋 Attributions existantes</h3>
            {attributions.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="border p-2">Filière</th>
                            <th className="border p-2">Niveau</th>
                            <th className="border p-2">N° Étudiant</th>
                            <th className="border p-2">Nom Étudiant</th>
                            <th className="border p-2">Cours</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributions.map((att) => (
                            <tr key={att.id} className="border text-center">
                                <td className="border p-2">{att.filiere}</td>
                                <td className="border p-2">{att.niveau}</td>
                                <td className="border p-2">{att.numeroetudiant}</td>
                                <td className="border p-2">{att.etudiant_nom} {att.etudiant_prenom}</td>
                                <td className="border p-2">{att.cours_nom}</td>
                                <td className="border p-2">
                                    <button className="bg-red-500 text-white px-3 py-1 rounded">❌</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 mt-2 text-center">Aucune attribution pour le moment.</p>
            )}
        </div>
    );
};

export default AssignCourse;