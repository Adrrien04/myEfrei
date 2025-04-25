import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { id_prof, id_eleve, id_cours, note } = await req.json();

    if (!id_prof || !id_eleve || !id_cours || note === undefined) {
      return NextResponse.json(
        { error: "Tous les champs (prof, élève, cours, note) sont requis" },
        { status: 400 },
      );
    }

    const [cours] = await sql`
      SELECT * FROM cours WHERE id = ${id_cours} AND id_prof = ${id_prof}
    `;

    if (!cours) {
      return NextResponse.json(
        { error: "Le professeur n'enseigne pas ce cours" },
        { status: 403 },
      );
    }

    const [existingNote] = await sql`
      SELECT * FROM notes WHERE id_prof = ${id_prof} AND id_eleve = ${id_eleve} AND id_cours = ${id_cours}
    `;

    if (existingNote) {
      await sql`
        UPDATE notes SET note = ${note}
        WHERE id_prof = ${id_prof} AND id_eleve = ${id_eleve} AND id_cours = ${id_cours}
      `;
    } else {
      await sql`
        INSERT INTO notes (id_prof, id_eleve, id_cours, note)
        VALUES (${id_prof}, ${id_eleve}, ${id_cours}, ${note})
      `;
    }

    return NextResponse.json({ message: "Note enregistrée avec succès" });
  } catch (error) {
    console.error("Erreur POST /api/profs/notes :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la note" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id_prof = searchParams.get("id_prof");
    const id_cours = searchParams.get("id_cours");

    if (!id_prof || !id_cours) {
      return NextResponse.json(
        { error: "id_prof et id_cours sont requis" },
        { status: 400 },
      );
    }

    const cours = await sql`
      SELECT * FROM cours WHERE id = ${id_cours} AND id_prof = ${id_prof}
    `;

    if (cours.length === 0) {
      return NextResponse.json(
        { error: "Ce cours n'est pas enseigné par ce professeur" },
        { status: 403 },
      );
    }

    const eleves = await sql`
      SELECT e.numeroetudiant AS id, e.nom, e.prenom, n.note
      FROM eleves e
      LEFT JOIN notes n
      ON e.numeroetudiant = n.id_eleve AND n.id_prof = ${id_prof} AND n.id_cours = ${id_cours}
    `;

    return NextResponse.json(eleves);
  } catch (error) {
    console.error("Erreur GET /api/profs/notes :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des élèves" },
      { status: 500 },
    );
  }
}
