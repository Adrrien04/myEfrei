"use client";
import { useState, useEffect } from "react";

const AdminDashboardPage = () => {
    const [stats, setStats] = useState<{ users: number; articles: number; events: number }>({
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord Admin</h1>
            
            {/* Cartes Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 shadow rounded-lg text-center">
                    <h2 className="text-lg font-semibold">👤 Utilisateurs</h2>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>
                <div className="bg-white p-6 shadow rounded-lg text-center">
                    <h2 className="text-lg font-semibold">📰 Articles</h2>
                    <p className="text-3xl font-bold">{stats.articles}</p>
                </div>
                <div className="bg-white p-6 shadow rounded-lg text-center">
                    <h2 className="text-lg font-semibold">📅 Événements</h2>
                    <p className="text-3xl font-bold">{stats.events}</p>
                </div>
            </div>

            {/* Actions Rapides */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <a href="/portal/admin/users" className="bg-blue-500 text-white text-center p-4 rounded-lg hover:bg-blue-600">
                    👥 Gérer les utilisateurs
                </a>
                <a href="/portal/admin/news/view" className="bg-green-500 text-white text-center p-4 rounded-lg hover:bg-green-600">
                    📰 Voir les articles
                </a>
                <a href="/portal/admin/news/write" className="bg-yellow-500 text-white text-center p-4 rounded-lg hover:bg-yellow-600">
                    ✍️ Rédiger un article
                </a>
                <a href="/portal/admin/cours" className="bg-purple-500 text-white text-center p-4 rounded-lg hover:bg-purple-600">
                    📚 Gérer les cours
                </a>
                <a href="/portal/admin/events" className="bg-red-500 text-white text-center p-4 rounded-lg hover:bg-red-600">
                    📅 Gérer les événements
                </a>
                <a href="/portal/admin/logs" className="bg-gray-500 text-white text-center p-4 rounded-lg hover:bg-gray-600">
                    🔔 Voir les logs
                </a>
            </div>
        </div>
    );
};

export default AdminDashboardPage;