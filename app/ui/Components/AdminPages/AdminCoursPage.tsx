"use client";
import { useState, useEffect } from "react";

const AdminCoursPage = () => {
    const [cours, setCours] = useState<{ id: string; nom: string; prof_nom: string; prof_prenom: string; matiere: string }[]>([]);
    const [professeurs, setProfesseurs] = useState<{ id: string; nom: string; prenom: string; matiere: string }[]>([]);
    const [nomCours, setNomCours] = useState("");
    const [idProf, setIdProf] = useState("");
    const [matiere, setMatiere] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCours();
        fetchProfesseurs();
    }, []);

    const fetchCours = async () => {
        const response = await fetch("/api/admin/cours");
        const data = await response.json();
        setCours(data);
    };

    const fetchProfesseurs = async () => {
        const response = await fetch("/api/admin/profs");
        const data = await response.json();
        setProfesseurs(data);
    };

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
            setShowModal(false);
            fetchCours();
        } else {
            setMessage("❌ Erreur lors de l'ajout");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">📚 Gestion des Cours</h1>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                
                <div className="bg-white p-6 shadow-lg rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">➕ Ajouter un Cours</h2>
                    <button onClick={() => setShowModal(true)} className="bg-green-600 text-white w-full p-2 rounded">
                        Ajouter un cours
                    </button>
                </div>

                
                <div className="bg-white p-6 shadow-lg rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">👨‍🏫 Professeurs Disponibles</h2>
                    <ul className="list-disc list-inside">
                        {professeurs.length > 0 ? (
                            professeurs.map((prof) => (
                                <li key={prof.id}>
                                    {prof.nom} {prof.prenom} - <span className="text-blue-600">{prof.matiere}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">Aucun professeur disponible</p>
                        )}
                    </ul>
                </div>

                
                <div className="bg-white p-6 shadow-lg rounded-lg border col-span-2">
                    <h2 className="text-xl font-bold mb-4">📌 Cours existants</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Nom</th>
                                <th className="border p-2">Matière</th>
                                <th className="border p-2">Professeur</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cours.length > 0 ? (
                                cours.map((c) => (
                                    <tr key={c.id} className="border">
                                        <td className="border p-2">{c.nom}</td>
                                        <td className="border p-2">{c.matiere}</td>
                                        <td className="border p-2">{c.prof_nom} {c.prof_prenom}</td>
                                        <td className="border p-2">
                                            <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded">Modifier</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">Aucun cours disponible</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">🆕 Ajouter un cours</h2>
                        <input type="text" placeholder="Nom du cours" value={nomCours} onChange={(e) => setNomCours(e.target.value)}
                            className="w-full p-2 border rounded mb-2" />
                        <select value={idProf} onChange={(e) => setIdProf(e.target.value)}
                            className="w-full p-2 border rounded mb-2">
                            <option value="">Sélectionner un professeur</option>
                            {professeurs.map((prof) => (
                                <option key={prof.id} value={prof.id}>
                                    {prof.nom} {prof.prenom} - {prof.matiere}
                                </option>
                            ))}
                        </select>
                        <input type="text" placeholder="Matière" value={matiere} onChange={(e) => setMatiere(e.target.value)}
                            className="w-full p-2 border rounded mb-2" />
                        <div className="flex justify-between">
                            <button onClick={handleAddCours} className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter</button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Annuler</button>
                        </div>
                        {message && <p className="mt-4 text-red-500">{message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoursPage;