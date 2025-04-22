import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

// ✅ Récupérer la liste des cours avec les noms des professeurs
export async function GET() {
  try {
    console.log("🟢 GET /api/admin/cours - Récupération des cours");

    const cours = await sql`
            SELECT cours.id, cours.nom, profs.nom AS prof_nom, profs.prenom AS prof_prenom, cours.matiere 
            FROM cours
            LEFT JOIN profs ON cours.id_prof = profs.id
        `;

    console.log("📌 Cours récupérés :", cours);
    return NextResponse.json(cours);
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cours" },
      { status: 500 },
    );
  }
}

// ✅ Générer un ID fixe de 8 caractères (ex: "C3F8X9Y2")
function generateCourseId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "C";
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// ✅ Ajouter un cours
export async function POST(req: NextRequest) {
  try {
    const { nom, id_prof, matiere } = await req.json();
    console.log("🟢 POST /api/admin/cours - Données reçues:", {
      nom,
      id_prof,
      matiere,
    });

    if (!nom || !id_prof || !matiere) {
      return NextResponse.json(
        { error: "Tous les champs (nom, professeur, matière) sont requis" },
        { status: 400 },
      );
    }

    const courseId = generateCourseId();
    console.log(
      `✅ ID du cours généré : ${courseId} (Longueur: ${courseId.length})`,
    );

    // ✅ Vérifier si le professeur existe
    const [prof] = await sql`SELECT id FROM profs WHERE id = ${id_prof}`;
    if (!prof) {
      return NextResponse.json(
        { error: "Professeur non trouvé" },
        { status: 404 },
      );
    }

    // ✅ Insérer le cours sans jour et horaire
    const [newCourse] = await sql`
            INSERT INTO cours (id, nom, id_prof, matiere)
            VALUES (${courseId}, ${nom}, ${id_prof}, ${matiere})
            RETURNING id, nom, id_prof, matiere;
        `;

    console.log("✅ Cours ajouté :", newCourse);
    return NextResponse.json(newCourse);
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/cours :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du cours" },
      { status: 500 },
    );
  }
}

// ✅ Modifier un cours
export async function PUT(req: NextRequest) {
  try {
    const { id, nom, id_prof, matiere } = await req.json();
    console.log("🟢 PUT /api/admin/cours - Données reçues :", {
      id,
      nom,
      id_prof,
      matiere,
    });

    if (!id || !nom || !id_prof || !matiere) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    // ✅ Vérifier si le cours existe avant modification
    const [existingCourse] = await sql`SELECT id FROM cours WHERE id = ${id}`;
    if (!existingCourse) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    // ✅ Vérifier si le professeur existe
    const [prof] = await sql`SELECT id FROM profs WHERE id = ${id_prof}`;
    if (!prof) {
      return NextResponse.json(
        { error: "Professeur non trouvé" },
        { status: 404 },
      );
    }

    // ✅ Mise à jour du cours
    await sql`
            UPDATE cours 
            SET nom = ${nom}, id_prof = ${id_prof}, matiere = ${matiere} 
            WHERE id = ${id}
        `;

    console.log("✅ Cours mis à jour :", { id, nom, id_prof, matiere });
    return NextResponse.json({ message: "Cours mis à jour avec succès" });
  } catch (error) {
    console.error("❌ Erreur PUT /api/admin/cours:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du cours" },
      { status: 500 },
    );
  }
}

// ✅ Supprimer un cours
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    console.log("🟢 DELETE /api/admin/cours - ID reçu :", id);

    if (!id) {
      return NextResponse.json(
        { error: "ID requis pour la suppression" },
        { status: 400 },
      );
    }

    // ✅ Vérifier si le cours existe avant suppression
    const [existingCourse] = await sql`SELECT id FROM cours WHERE id = ${id}`;
    if (!existingCourse) {
      return NextResponse.json({ error: "Cours non trouvé" }, { status: 404 });
    }

    // ✅ Suppression du cours
    await sql`DELETE FROM cours WHERE id = ${id}`;
    console.log("✅ Cours supprimé :", id);

    return NextResponse.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/admin/cours:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du cours" },
      { status: 500 },
    );
  }
}
