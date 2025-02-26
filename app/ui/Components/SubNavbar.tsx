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
const AdminSubNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white p-4 text-gray-700 shadow-md flex justify-center">
            <ul className="flex space-x-4">
                <li><a href="/portal/admin/dashboard" className="hover:underline">Dashboard</a></li>
                <li><a href="/portal/admin/users" className="hover:underline">Manage Users</a></li>
                <li className="relative">
                    <button onClick={toggleDropdown} className="hover:underline">Manage News</button>
                    {isDropdownOpen && (
                        <ul className="absolute bg-white border rounded-lg mt-2 shadow-lg">
                            <li><a href="/portal/admin/news/view" className="block px-4 py-2 hover:bg-gray-100">View and Edit News</a></li>
                            <li><a href="/portal/admin/news/write" className="block px-4 py-2 hover:bg-gray-100">Write News</a></li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};


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
