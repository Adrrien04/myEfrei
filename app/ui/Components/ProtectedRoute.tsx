'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EfreiPantheonTotalLogo from "@/app/ui/efrei-pantheon-total-logo";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Aucun token trouvé, redirection vers login');
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/auth/check', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    console.log('Token valide');
                    setIsAuthenticated(true);
                } else {
                    console.log('Token invalide, redirection vers login');
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du token', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <EfreiPantheonTotalLogo />
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
