"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Une erreur est survenue.");
        return;
      }

      localStorage.setItem("token", data.token);

      switch (data.role) {
        case "admins":
          router.push("/portal/admin");
          break;
        case "profs":
          router.push("/portal/teacher");
          break;
        case "eleves":
          router.push("/portal/student");
          break;
        default:
          setErrorMessage("Rôle inconnu.");
      }
    } catch (error) {
      setErrorMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Se connecter
      </button>
    </form>
  );
};

export default Login;
