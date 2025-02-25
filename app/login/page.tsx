import Login from '@/app/ui/Components/Login';
import Image from 'next/image';
import backgroundImage from 'public/background.9a2185ec.png';
import logoEfrei from 'public/logo-efrei.png';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-end" style={{ backgroundImage: `url(${backgroundImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-lg rounded-xl bg-white p-10 shadow-lg m-20">
                <div className="flex justify-center mb-6">
                    <Image src={logoEfrei} alt="Efrei Logo" width={200} height={100} />
                </div>
                <h1 className="mb-6 text-center text-3xl font-bold">Connexion</h1>
                <Login />
            </div>
        </main>
    );
}
