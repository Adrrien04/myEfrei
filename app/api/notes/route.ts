import { NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_eleve, id_cours, note, commentaire } = body;

    if (!id_eleve || !id_cours || note == null) {
      return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
    }

    await sql`
      INSERT INTO notes (id_eleve, id_cours, note, commentaire)
      VALUES (${id_eleve}, ${id_cours}, ${note}, ${commentaire})
    `;

    return new Response(JSON.stringify({ message: "Note enregistrée avec succès" }), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/notes :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
