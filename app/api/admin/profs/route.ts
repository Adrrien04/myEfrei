import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    console.log(
      "🟢 GET /api/admin/profs - Récupération des profs avec leurs cours",
    );

    const profs = await sql`
      SELECT
        p.id AS prof_id,
        p.nom AS prof_nom,
        p.prenom AS prof_prenom,
        p.matiere AS prof_matiere,
        c.id AS cours_id,
        c.nom AS cours_nom
      FROM profs p
             LEFT JOIN cours c ON c.id_prof = p.id
      ORDER BY p.nom
    `;

    const profsMap = new Map();

    for (const row of profs) {
      if (!profsMap.has(row.prof_id)) {
        profsMap.set(row.prof_id, {
          id: row.prof_id,
          nom: row.prof_nom,
          prenom: row.prof_prenom,
          matiere: row.prof_matiere,
          cours: [],
        });
      }

      if (row.cours_id) {
        profsMap.get(row.prof_id).cours.push({
          id: row.cours_id,
          nom: row.cours_nom,
        });
      }
    }

    const profsList = Array.from(profsMap.values());

    return NextResponse.json(profsList);
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/profs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professeurs" },
      { status: 500 },
    );
  }
}
