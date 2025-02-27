import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

function getTokenFromCookie(req: NextRequest) {
    const cookie = req.headers.get("cookie");
    console.log("🍪 Cookies reçus :", cookie);

    if (!cookie) return null;

    const match = cookie.match(/auth_token=([^;]+)/);
    console.log("🔍 Token extrait des cookies :", match ? match[1] : "Aucun");

    return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
    try {
        const token = getTokenFromCookie(req);
        if (!token) {
            console.log("❌ Aucun token trouvé dans les cookies, utilisateur non connecté.");
            return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
        }

        
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
            console.log("✅ Token décodé :", decoded);
        } catch (error) {
            console.log("❌ Token invalide :", error);
            return NextResponse.json({ error: "Token invalide" }, { status: 401 });
        }

        if (!decoded.email || !decoded.numeroetudiant) {
            console.log("❌ Données manquantes dans le token.");
            return NextResponse.json({ error: "Données utilisateur manquantes" }, { status: 401 });
        }

        console.log("🟢 Récupération de l'emploi du temps pour :", decoded.email, decoded.numeroetudiant);

        const [student] = await sql`
            SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${decoded.numeroetudiant}
        `;

        if (!student) {
            console.log("❌ Étudiant non trouvé pour l'email :", decoded.email);
            return NextResponse.json({ error: "Étudiant non trouvé" }, { status: 404 });
        }

        console.log("📌 Emploi du temps récupéré :", student.emploi_du_temps);

        return NextResponse.json({ emploi_du_temps: student.emploi_du_temps || "Aucun cours prévu" });
    } catch (error) {
        console.error("❌ Erreur GET /api/student/schedule :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération de l'emploi du temps" }, { status: 500 });
    }
}