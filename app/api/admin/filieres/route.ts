import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

/**
 * ✅ GET: Récupérer toutes les filières distinctes
 */
export async function GET() {
  try {
    console.log(
      "🟢 GET /api/admin/filieres - Récupération des filières distinctes",
    );

    const filieres = await sql`
            SELECT DISTINCT filiere FROM eleves WHERE filiere IS NOT NULL ORDER BY filiere;
        `;

    return NextResponse.json(filieres.map((f) => f.filiere));
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/filieres :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des filières" },
      { status: 500 },
    );
  }
}
