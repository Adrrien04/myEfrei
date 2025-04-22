"use client";
import { useState } from "react";

const UserForm = ({
  user,
  onClose,
  onAdd,
}: {
  user?: any;
  onClose: () => void;
  onAdd: (user: any) => void;
}) => {
  const [nom, setNom] = useState(user?.nom || "");
  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [mail, setMail] = useState(user?.mail || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "Élève");
  const [niveau, setNiveau] = useState(user?.niveau || "L1");
  const [filiere, setFiliere] = useState(user?.filiere || "Informatique");
  const [emploiDuTemps, setEmploiDuTemps] = useState(
    user?.emploi_du_temps || "",
  );
  const [matiere, setMatiere] = useState(user?.matiere || ""); // ✅ Ajout de la matière

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("🟢 Formulaire soumis avec:", {
      nom,
      prenom,
      mail,
      password,
      role,
      niveau,
      filiere,
      emploiDuTemps,
      matiere,
    });

    try {
      const response = await fetch("/api/admin/users", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?.id,
          nom,
          prenom,
          mail,
          password,
          role,
          niveau,
          filiere,
          emploi_du_temps: emploiDuTemps,
          matiere: role === "Professeur" ? matiere : undefined, // ✅ Ajout de la matière uniquement pour les professeurs
        }),
      });

      const data = await response.json();
      console.log("🔍 Réponse de l'API:", data);

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'ajout.");
        return;
      }

      onAdd(data);
      setSuccess(
        user
          ? "Utilisateur mis à jour avec succès !"
          : "Utilisateur ajouté avec succès !",
      );
      if (!user) {
        setNom("");
        setPrenom("");
        setMail("");
        setPassword("");
        setRole("Élève");
        setNiveau("L1");
        setFiliere("Informatique");
        setEmploiDuTemps("");
        setMatiere(""); // ✅ Réinitialisation de la matière
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {user ? "✏️ Modifier un utilisateur" : "➕ Ajouter un utilisateur"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Élève</option>
            <option>Professeur</option>
            <option>Admin</option>
          </select>

          {role === "Élève" && (
            <>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option>L1</option>
                <option>L2</option>
                <option>L3</option>
                <option>M1</option>
                <option>M2</option>
              </select>

              <select
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option>Informatique</option>
                <option>Électronique</option>
                <option>Mathématiques</option>
                <option>Physique</option>
                <option>Biologie</option>
                <option>Chimie</option>
                <option>Économie</option>
              </select>

              <input
                type="text"
                placeholder="Emploi du temps"
                value={emploiDuTemps}
                onChange={(e) => setEmploiDuTemps(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          {role === "Professeur" && (
            <input
              type="text"
              placeholder="Matière enseignée"
              value={matiere}
              onChange={(e) => setMatiere(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {user ? "Modifier" : "Ajouter"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
