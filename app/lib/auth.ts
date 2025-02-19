import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import jwt from 'jsonwebtoken';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

interface User {
    email: string;
    password: string;
}

async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await sql<User[]>`
      SELECT email, password FROM users WHERE email = ${email} LIMIT 1;
    `;
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Erreur base de données :", error);
        return null;
    }
}

export async function login(credentials: { email: string, password: string }) {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error("Email et mot de passe requis.");
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error("Utilisateur non trouvé.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Mot de passe incorrect.");
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { token };
}
