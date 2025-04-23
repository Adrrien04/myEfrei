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
        { status: 400 }
      );
    }

    const [cours] = await sql`
      SELECT c.nom AS cours_nom, p.nom AS prof_nom, p.prenom AS prof_prenom
      FROM cours c
      JOIN profs p ON c.id_prof = p.id
      WHERE c.id = ${id_cours}
    `;

    if (!cours) {
      return NextResponse.json(
        { error: "Cours ou professeur introuvable" },
        { status: 404 }
      );
    }

    const [student] = await sql`
      SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${id_etudiant}
    `;

    const emploiDuTemps = student?.emploi_du_temps ?? [];
    const newEntry = {
      jour,
      heure: horaire,
      cours: cours.cours_nom,
      prof: `${cours.prof_prenom} ${cours.prof_nom}`,
    };

    const updatedSchedule = [...emploiDuTemps, newEntry];

    await sql`
      UPDATE eleves SET emploi_du_temps = ${updatedSchedule} WHERE numeroetudiant = ${id_etudiant}
    `;

    console.log("✅ Attribution enregistrée et emploi du temps mis à jour !");
    return NextResponse.json({ message: "Attribution réussie !" });
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/attributions :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'attribution" },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    const { id_etudiant, jour, heure, newJour, newHeure } = await req.json();

    if (!id_etudiant || !jour || !heure || !newJour || !newHeure) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const [student] = await sql`
      SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${id_etudiant}
    `;

    const emploi = student?.emploi_du_temps ?? [];

    const updated = emploi.map((item: any) => {
      if (item.jour === jour && item.heure === heure) {
        return { ...item, jour: newJour, heure: newHeure };
      }
      return item;
    });

    await sql`
      UPDATE eleves SET emploi_du_temps = ${updated} WHERE numeroetudiant = ${id_etudiant}
    `;

    return NextResponse.json({ message: "Cours déplacé avec succès" });
  } catch (error) {
    console.error("❌ Erreur PUT /api/admin/attributions :", error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id_etudiant, jour, heure } = await req.json();

    if (!id_etudiant || !jour || !heure) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const [student] = await sql`
      SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${id_etudiant}
    `;

    const emploi = student?.emploi_du_temps ?? [];

    const updated = emploi.filter(
      (item: any) => item.jour !== jour || item.heure !== heure
    );

    await sql`
      UPDATE eleves SET emploi_du_temps = ${updated} WHERE numeroetudiant = ${id_etudiant}
    `;

    return NextResponse.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/admin/attributions :", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}