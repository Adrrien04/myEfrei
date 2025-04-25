"use client";
import { useState, useEffect } from "react";
import UserForm from "./UserForm";

function generateShortId(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<
      {
        id: string;
        nom: string;
        prenom: string;
        mail: string;
        role: string;
        niveau?: string;
        filiere?: string;
      }[]
  >([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Tous");
  const [search, setSearch] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<{
    id: string;
    nom: string;
    prenom: string;
    mail: string;
    role: string;
    niveau?: string;
    filiere?: string;
  } | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<string>("Tous");
  const [selectedFiliere, setSelectedFiliere] = useState<string>("Tous");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError("Impossible de récupérer les utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;

    if (filter !== "Tous") {
      result = result.filter((user) => user.role === filter);
    }

    if (filter === "Élève") {
      if (selectedFiliere !== "Tous") {
        result = result.filter((user) => user.filiere === selectedFiliere);
      }

      if (selectedNiveau !== "Tous") {
        result = result.filter((user) => user.niveau === selectedNiveau);
      }
    }

    if (search) {
      result = result.filter(
          (user) =>
              user.nom.toLowerCase().includes(search.toLowerCase()) ||
              user.prenom.toLowerCase().includes(search.toLowerCase()) ||
              user.mail.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredUsers(result);
  }, [filter, search, users, selectedFiliere, selectedNiveau]);

  const handleFilter = (role: string) => {
    setFilter(role);
    setSelectedFiliere("Tous");
    setSelectedNiveau("Tous");
  };

  const handleEdit = (user: any) => {
    setEditUser(user);
    setIsEditing(true);
  };

  const handleEditSubmit = async (updatedUser: any) => {
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error("Failed to update user");
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setIsEditing(false);
      setEditUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const response = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleAddUser = async (newUser: any) => {
    const id = generateShortId();
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, id }),
      });

      if (!response.ok) throw new Error("Failed to add user");
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const niveaux = [...new Set(users.filter(u => u.role === "Élève").map(u => u.niveau).filter(Boolean))];
  const filieres = [...new Set(users.filter(u => u.role === "Élève").map(u => u.filiere).filter(Boolean))];

  return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Gérer les utilisateurs</h1>

        <button onClick={() => setIsAdding(true)} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">
          ➕ Ajouter un utilisateur
        </button>

        {isAdding && <UserForm onClose={() => setIsAdding(false)} onAdd={handleAddUser} />}
        {isEditing && editUser && (
            <UserForm
                user={editUser}
                onClose={() => {
                  setIsEditing(false);
                  setEditUser(null);
                }}
                onAdd={handleEditSubmit}
            />
        )}

        <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur..."
            className="w-full p-2 border rounded mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mb-4 flex flex-wrap gap-2">
          {["Tous", "Élève", "Professeur", "Admin"].map((role) => (
              <button
                  key={role}
                  onClick={() => handleFilter(role)}
                  className={`px-4 py-2 rounded border ${filter === role ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
              >
                {role}s
              </button>
          ))}

          {filter === "Élève" && (
              <>
                <select
                    value={selectedFiliere}
                    onChange={(e) => setSelectedFiliere(e.target.value)}
                    className="px-4 py-2 border rounded"
                >
                  <option value="Tous">Toutes les filières</option>
                  {filieres.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                  ))}
                </select>
                <select
                    value={selectedNiveau}
                    onChange={(e) => setSelectedNiveau(e.target.value)}
                    className="px-4 py-2 border rounded"
                >
                  <option value="Tous">Tous les niveaux</option>
                  {niveaux.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                  ))}
                </select>
              </>
          )}
        </div>

        {loading ? (
            <p>Chargement...</p>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nom</th>
                <th className="border p-2">Prénom</th>
                <th className="border p-2">Email</th>
                {filter === "Élève" && <th className="border p-2">Filière</th>}
                {filter === "Élève" && <th className="border p-2">Niveau</th>}
                <th className="border p-2">Rôle</th>
                <th className="border p-2">Actions</th>
              </tr>
              </thead>
              <tbody>
              {filteredUsers.map((user) => (
                  <tr key={user.id} className="border">
                    <td className="border p-2">{user.id}</td>
                    <td className="border p-2">{user.nom}</td>
                    <td className="border p-2">{user.prenom}</td>
                    <td className="border p-2">{user.mail}</td>
                    {filter === "Élève" && <td className="border p-2">{user.filiere || "N/C"}</td>}
                    {filter === "Élève" && <td className="border p-2">{user.niveau || "N/C"}</td>}
                    <td className="border p-2">{user.role}</td>
                    <td className="border p-2">
                      <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Modifier
                      </button>
                      <button
                          onClick={() => handleDelete(user.id, user.role)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default AdminUsersPage;
