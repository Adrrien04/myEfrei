'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const Login = () => {
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const email = (form.email as HTMLInputElement).value;
        const password = (form.password as HTMLInputElement).value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);

                switch (data.role) {
                    case 'admins':
                        router.push('/portal/admin');
                        break;
                    case 'profs':
                        router.push('/portal/teacher');
                        break;
                    case 'eleves':
                        router.push('/portal/student');
                        break;
                    default:
                        console.error('Unknown role');
                        break;
                }
            } else {
                console.error('Failed to login');
            }
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
