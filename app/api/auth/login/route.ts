import bcrypt from "bcryptjs";
import postgres from "postgres";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const users = await sql`
            SELECT 'admins' AS role, mail, mdp, nom AS name, prenom AS surname, NULL AS numeroetudiant FROM admins WHERE mail = ${email}
            UNION
            SELECT 'profs' AS role, mail, mdp, nom AS name, prenom AS surname, NULL AS numeroetudiant FROM profs WHERE mail = ${email}
            UNION
            SELECT 'eleves' AS role, mail, mdp, nom AS name, prenom AS surname, numeroetudiant FROM eleves WHERE mail = ${email};
        `;

        if (users.length === 0) {
            return new Response(JSON.stringify({ error: "Utilisateur non trouvé." }), { status: 404 });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.mdp);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: "Mot de passe incorrect." }), { status: 401 });
        }

        const tokenPayload: Record<string, any> = {
                email: user.mail,
                name: user.name,
                surname: user.surname,
                role: user.role,
        };

        if (user.role === "eleves") {
            tokenPayload.numeroetudiant = user.numeroetudiant; // Ajout du numeroetudiant
        }

        const token = jwt.sign(tokenPayload, process.env.AUTH_SECRET!, { expiresIn: "1h" });

        const response = new Response(
            JSON.stringify({
                message: "Connexion réussie.",
                role: user.role,
                token,
                numeroetudiant: user.numeroetudiant || null,
            }),
            { status: 200 }
        );

        
        response.headers.set("Set-Cookie", `numeroetudiant=${user.numeroetudiant || ""}; HttpOnly; Path=/; Max-Age=3600`);

return response;
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
    }
}