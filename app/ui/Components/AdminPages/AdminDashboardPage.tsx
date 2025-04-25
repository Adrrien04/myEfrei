"use client";
import { useState, useEffect } from "react";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<{
    users: number;
    articles: number;
    events: number;
  }>({
    users: 0,
    articles: 0,
    events: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="relative bg-[#1F3666] text-white p-8 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold">📊 Tableau de bord Admin</h1>
          <p className="mt-2">
            Bienvenue sur votre espace de gestion. Accédez aux statistiques et
            gérez les utilisateurs, articles et événements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 shadow rounded-lg text-center border border-blue-300">
            <h2 className="text-lg font-semibold">👤 Utilisateurs</h2>
            <p className="text-4xl font-bold text-blue-600">{stats.users}</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg text-center border border-green-300">
            <h2 className="text-lg font-semibold">📰 Articles</h2>
            <p className="text-4xl font-bold text-green-600">{stats.articles}</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg text-center border border-red-300">
            <h2 className="text-lg font-semibold">📅 Événements</h2>
            <p className="text-4xl font-bold text-red-600">{stats.events}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">⚡ Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <a
              href="/portal/admin/users"
              className="bg-blue-500 text-white text-center p-4 rounded-lg hover:bg-blue-600 transition"
          >
            👥 Gérer les utilisateurs
          </a>
          <a
              href="/portal/admin/news/view"
              className="bg-green-500 text-white text-center p-4 rounded-lg hover:bg-green-600 transition"
          >
            📰 Voir les articles
          </a>
          <a
              href="/portal/admin/news/write"
              className="bg-yellow-500 text-white text-center p-4 rounded-lg hover:bg-yellow-600 transition"
          >
            ✍️ Rédiger un article
          </a>
          <a
              href="/portal/admin/cours"
              className="bg-purple-500 text-white text-center p-4 rounded-lg hover:bg-purple-600 transition"
          >
            📚 Gérer les cours
          </a>
          <a
              href="/portal/admin/events/view"
              className="bg-red-500 text-white text-center p-4 rounded-lg hover:bg-red-600 transition"
          >
            📅 Gérer les événements
          </a>
          <a
              href="/portal/admin/slides/view"
              className="bg-gray-500 text-white text-center p-4 rounded-lg hover:bg-gray-600 transition"
          >
            🖼️ Gérer les slides
          </a>
        </div>

        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">📢 Infos & Assistance</h2>
          <p className="text-gray-700">
            Besoin d'aide ? Consultez la{" "}
            <a href="https://github.com/fluffykoo/myEfrei" className="text-blue-600 underline">
              FAQ
            </a>{" "}
            ou contactez les développeurs.
          </p>
        </div>
      </div>
  );
};

export default AdminDashboardPage;
