import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

function getTokenFromCookie(request: NextRequest) {
    const cookie = request.headers.get("cookie");
    if (!cookie) return null;

    const match = cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
    const token = getTokenFromCookie(req);
    console.log("🔍 Token récupéré :", token);

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
        console.log("✅ Token décodé :", decoded);

        let emploiDuTemps = null;

        // Récupérer l'emploi du temps **seulement si c'est un élève**
      if (decoded.role === "eleve") {
    const [student] = await sql`
        SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${decoded.numeroetudiant}
    `;

    console.log("📌 Résultat SQL - emploi du temps récupéré :", student);

    emploiDuTemps = student?.emploi_du_temps ?? "Aucun cours prévu";
}

        return NextResponse.json({
            authenticated: true,
            email: decoded.email,
            name: decoded.name,
            surname: decoded.surname,
            role: decoded.role,
            numeroetudiant: decoded.numeroetudiant || null,
            emploi_du_temps: emploiDuTemps, // Ajout de l'emploi du temps !
        });
        
    } catch (error) {
        console.log("❌ Token invalide :", error);
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}