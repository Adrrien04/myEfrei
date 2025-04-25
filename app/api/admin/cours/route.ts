import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

// Génération d'un ID fixe de 8 caractères (ex: "C3F8X9Y2")
function generateCourseId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "C";
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Récupérer tous les cours
export async function GET() {
  try {
    const cours = await sql`
      SELECT cours.id, cours.nom, cours.matiere, profs.nom AS prof_nom, profs.prenom AS prof_prenom
      FROM cours
      LEFT JOIN profs ON cours.id_prof = profs.id
    `;
    return NextResponse.json(cours);
  } catch (error) {
    console.error(" GET /cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cours" },
      { status: 500 },
    );
  }
}

// Ajouter un cours
export async function POST(req: Request) {
  try {
    const { nom, id_prof, matiere } = await req.json();

    if (!nom || !id_prof || !matiere) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 },
      );
    }

    const courseId = generateCourseId();

    const [prof] = await sql`SELECT id FROM profs WHERE id = ${id_prof}`;
    if (!prof) {
      return NextResponse.json(
        { error: "Professeur introuvable" },
        { status: 404 },
      );
    }

    const [newCourse] = await sql.unsafe(`
      INSERT INTO cours (id, nom, id_prof, matiere)
      VALUES ('${courseId}', '${nom}', '${id_prof}', '${matiere}')
      RETURNING id, nom, id_prof, matiere;
    `);

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error(" POST /cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du cours" },
      { status: 500 },
    );
  }
}

// Modifier un cours
export async function PUT(req: Request) {
  try {
    const { id, nom, id_prof, matiere } = await req.json();

    if (!id || !nom || !id_prof || !matiere) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 },
      );
    }

    const [prof] = await sql`SELECT id FROM profs WHERE id = ${id_prof}`;
    if (!prof) {
      return NextResponse.json(
        { error: "Professeur introuvable" },
        { status: 404 },
      );
    }

    await sql`
      UPDATE cours SET nom = ${nom}, id_prof = ${id_prof}, matiere = ${matiere}
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Cours mis à jour" });
  } catch (error) {
    console.error(" PUT /cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du cours" },
      { status: 500 },
    );
  }
}

// Supprimer un cours
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    await sql`DELETE FROM cours WHERE id = ${id}`;
    return NextResponse.json({ message: "Cours supprimé" });
  } catch (error) {
    console.error(" DELETE /cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 },
    );
  }
}
