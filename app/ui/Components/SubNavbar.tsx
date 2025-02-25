'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SubNavbar = () => {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error("Token invalide");
            }

            const decodedPayload = JSON.parse(atob(parts[1]));

            if (!decodedPayload.role) {
                throw new Error("Rôle non trouvé dans le token");
            }

            setRole(decodedPayload.role);
        } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router]);

    if (role === 'admins') return <AdminSubNavbar />;
    if (role === 'profs') return <ProfSubNavbar />;
    if (role === 'eleves') return <EleveSubNavbar />;

    return null;
};

const AdminSubNavbar = () => (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
        <ul className="flex space-x-4">
            <li><a href="/portal/admin/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/portal/admin/users" className="hover:underline">Manage Users</a></li>
        </ul>
    </nav>
);

const ProfSubNavbar = () => (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
        <ul className="flex space-x-4">
            <li><a href="/portal/teacher/courses" className="hover:underline">My Courses</a></li>
            <li><a href="/portal/teacher/schedule" className="hover:underline">Schedule</a></li>
        </ul>
    </nav>
);

const EleveSubNavbar = () => (
    <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
        <ul className="flex space-x-4">
            <li><a href="/portal/student/courses" className="hover:underline">My Courses</a></li>
            <li><a href="/portal/student/schedule" className="hover:underline">Schedule</a></li>
        </ul>
    </nav>
);

export default SubNavbar;
