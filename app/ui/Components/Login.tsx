"use client";
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('L\'email et le mot de passe sont requis.');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();


            if (res.ok) {
                document.cookie = `token=${data.token}; path=/;`;
                console.log('Connexion réussie');
            } else {
                setError(data.error || 'Erreur lors de la connexion.');
                console.error(data.error || 'Erreur lors de la connexion.');
            }
        } catch (error) {
            setError('Une erreur est survenue lors de la connexion.');
            console.error('Une erreur est survenue:', error);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            <button onClick={handleLogin}>Se connecter</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
