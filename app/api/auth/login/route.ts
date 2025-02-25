import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import jwt from 'jsonwebtoken';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const users = await sql`
            SELECT 'admins' AS role, mail, mdp FROM admins WHERE mail = ${email}
            UNION
            SELECT 'profs' AS role, mail, mdp FROM profs WHERE mail = ${email}
            UNION
            SELECT 'eleves' AS role, mail, mdp FROM eleves WHERE mail = ${email};
        `;

        if (users.length === 0) {
            return new Response(JSON.stringify({ error: 'Utilisateur non trouvé.' }), { status: 404 });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.mdp);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Mot de passe incorrect.' }), { status: 401 });
        }

        const token = jwt.sign(
            { email: user.mail, role: user.role },
            process.env.AUTH_SECRET!,
            { expiresIn: '1h' }
        );

        const response = new Response(
            JSON.stringify({ message: 'Connexion réussie.', role: user.role }),
            { status: 200 }
        );

        response.headers.set('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=3600`);

        return response;
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}
