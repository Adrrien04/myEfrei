import { NextResponse } from "next/server";
import postgres from "postgres";

// Connexion à la base de données Supabase
const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

/**
 * ✅ GET: Récupérer les étudiants d'une filière et d'un niveau
 */
export async function GET(req: Request) {
    try {
        // 🔹 Récupération des paramètres de la requête
        const { searchParams } = new URL(req.url);
        let filiere = searchParams.get("filiere");
        const niveau = searchParams.get("niveau");

        console.log("🟢 GET /api/admin/etudiants - Requête reçue:");
        console.log("   📌 Filière:", filiere);
        console.log("   📌 Niveau:", niveau);

        if (!filiere || !niveau) {
            return NextResponse.json({ error: "La filière et le niveau sont requis." }, { status: 400 });
        }

        // 🔹 Correction des espaces et caractères spéciaux
        filiere = filiere.replace("%20", " ").replace("&", "AND");

        console.log("🔍 Recherche des étudiants avec filière:", filiere, "et niveau:", niveau);

        // 🔹 Exécution de la requête SQL
        const etudiants = await sql`
            SELECT id, numeroetudiant, nom, prenom, filiere, niveau 
            FROM eleves 
            WHERE filiere ILIKE ${'%' + filiere + '%'} 
            AND niveau = ${niveau}
        `;

        console.log("✅ Étudiants trouvés:", etudiants.length);

        return NextResponse.json(etudiants);
    } catch (error) {
        console.error("❌ Erreur GET /api/admin/etudiants :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des étudiants." }, { status: 500 });
    }
}