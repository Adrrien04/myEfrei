import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    console.log("🟢 GET /api/admin/profs - Récupération des professeurs");

    const profs = await sql`
            SELECT id, nom, prenom, matiere FROM profs;
        `;

    return NextResponse.json(profs);
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/profs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des professeurs" },
      { status: 500 },
    );
  }
}
