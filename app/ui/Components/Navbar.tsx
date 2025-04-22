'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EfreiLogo from '@/app/ui/efrei-logo';

export default function Navbar() {
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<{ name: string; surname: string; role: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedPayload = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Payload:', decodedPayload);

                if (decodedPayload.role) {
                    setRole(decodedPayload.role);
                    setUser({ name: decodedPayload.name, surname: decodedPayload.surname, role: decodedPayload.role });
                }
            } catch (error) {
                console.error("Erreur lors du décodage du token:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/portal/common" legacyBehavior>
                        <div className="w-32 text-white md:w-40 cursor-pointer">
                            <EfreiLogo />
                        </div>
                    </Link>

                    {role && (
                        <span className="flex items-center text-white text-sm px-3 py-1 border border-orange-500 rounded-full">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                            {role === 'admins' ? 'Administration' : role === 'profs' ? 'Enseignant' : 'Étudiant'}
                        </span>
                    )}
                </div>

                <div className="flex space-x-4 items-center">
                    {user && (
                        <>
                            <Link href="/dashboard" legacyBehavior>
                                <a className="text-white text-lg font-medium hover:underline">{`${user.surname} ${user.name.toUpperCase()}`}</a>
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="text-white text-sm bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
                            >
                                Sign Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
