import Login from '@/app/ui/Components/Login';

export default function LoginPage() {
  return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">Connexion</h1>
          <Login />
        </div>
      </main>
  );
}
