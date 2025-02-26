"use client";
import { useState, useEffect } from "react";

const AdminCoursPage = () => {
    const [cours, setCours] = useState<{ id: string; nom: string; prof_nom: string; prof_prenom: string; matiere: string }[]>([]);
    const [professeurs, setProfesseurs] = useState<{ id: string; nom: string; prenom: string; matiere: string }[]>([]);
    const [nomCours, setNomCours] = useState("");
    const [idProf, setIdProf] = useState("");
    const [matiere, setMatiere] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchCours();
        fetchProfesseurs();
    }, []);

    // ✅ Récupérer les cours existants
    const fetchCours = async () => {
        const response = await fetch("/api/admin/cours");
        const data = await response.json();
        setCours(data);
    };

    // ✅ Récupérer les professeurs disponibles
    const fetchProfesseurs = async () => {
        const response = await fetch("/api/admin/profs");
        const data = await response.json();
        setProfesseurs(data);
    };

    // ✅ Ajouter un nouveau cours
    const handleAddCours = async () => {
        if (!nomCours || !idProf || !matiere) {
            setMessage("⚠️ Veuillez remplir tous les champs");
            return;
        }

        const response = await fetch("/api/admin/cours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: nomCours, id_prof: idProf, matiere }),
        });

        if (response.ok) {
            setMessage("✅ Cours ajouté !");
            setNomCours("");
            setIdProf("");
            setMatiere("");
            fetchCours();
        } else {
            setMessage("❌ Erreur lors de l'ajout");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📚 Gestion des cours</h1>

            
            <input
                type="text"
                placeholder="Nom du cours"
                value={nomCours}
                onChange={(e) => setNomCours(e.target.value)}
                className="p-2 border rounded mb-2"
            />

            <select value={idProf} onChange={(e) => setIdProf(e.target.value)} className="p-2 border rounded mb-2">
                <option value="">Sélectionner un professeur</option>
                {professeurs.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                        {prof.nom} {prof.prenom} - {prof.matiere}
                    </option>
                ))}
            </select>

            
            <input
                type="text"
                placeholder="Matière"
                value={matiere}
                onChange={(e) => setMatiere(e.target.value)}
                className="p-2 border rounded mb-2"
            />

            <button onClick={handleAddCours} className="bg-green-600 text-white p-2 rounded ml-2">➕ Ajouter</button>

            
            <h2 className="text-xl font-bold mt-6">📌 Cours existants</h2>
            <ul className="mt-2">
                {cours.map((c) => (
                    <li key={c.id} className="p-2 border-b">
                        {c.nom} - {c.matiere} (Prof: {c.prof_nom} {c.prof_prenom})
                    </li>
                ))}
            </ul>

            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default AdminCoursPage;