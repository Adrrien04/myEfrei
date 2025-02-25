'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Si aucun token n'est trouvé, rediriger vers la page de connexion
                console.log('No token found, redirecting to login');
                router.push('/login');
                return;
            }

            try {
                // Vérification du token auprès de l'API
                const response = await fetch('/api/auth/check', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    // Si le token est valide, mettre l'état de l'authentification à true
                    console.log('Token is valid');
                    setIsAuthenticated(true);
                } else {
                    // Si le token est invalide, rediriger vers la page de connexion
                    console.log('Token is invalid, redirecting to login');
                    router.push('/login');
                }
            } catch (error) {
                console.error('Failed to verify token', error);
                // Si la vérification échoue, rediriger vers la page de connexion
                router.push('/login');
            } finally {
                // Charger l'état final (qu'il y ait ou non une erreur)
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        // Si l'état est en train de se charger, afficher un message de chargement
        return <div>Loading...</div>;
    }

    // Si l'utilisateur n'est pas authentifié, ne rien afficher
    if (!isAuthenticated) {
        return null;
    }

    // Si l'utilisateur est authentifié, afficher le contenu protégé
    return <>{children}</>;
};

export default ProtectedRoute;
