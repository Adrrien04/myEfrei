import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const { id_cours, id_etudiant, jour, horaire } = await req.json();
    console.log("🟢 POST /api/admin/attributions - Données reçues:", {
      id_cours,
      id_etudiant,
      jour,
      horaire,
    });

    if (!id_cours || !id_etudiant || !jour || !horaire) {
      return NextResponse.json(
        {
          error: "Tous les champs sont requis (cours, étudiant, jour, horaire)",
        },
        { status: 400 },
      );
    }

    const [cours] = await sql.unsafe(`
            SELECT c.nom AS cours_nom, p.nom AS prof_nom, p.prenom AS prof_prenom
            FROM cours c
            JOIN profs p ON c.id_prof = p.id
            WHERE c.id = '${id_cours}'
        `);

    if (!cours) {
      return NextResponse.json(
        { error: "Cours ou professeur introuvable" },
        { status: 404 },
      );
    }

    const [student] = await sql.unsafe(`
            SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = '${id_etudiant}'
        `);

    const newCourseEntry = `${jour} | ${horaire} | ${cours.cours_nom} | Professeur : ${cours.prof_prenom} ${cours.prof_nom}`;
    const updatedSchedule = student?.emploi_du_temps
      ? `${student.emploi_du_temps}\n${newCourseEntry}`
      : newCourseEntry;

    await sql`
            UPDATE eleves SET emploi_du_temps = ${updatedSchedule} WHERE numeroetudiant = ${id_etudiant}
        `;

    console.log("✅ Attribution enregistrée et emploi du temps mis à jour !");
    return NextResponse.json({ message: "Attribution réussie !" });
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/attributions :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'attribution" },
      { status: 500 },
    );
  }
}
