import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    console.log("🟢 GET /api/admin/users - Récupération des utilisateurs");

    const students =
      await sql`SELECT numeroetudiant AS id, nom, prenom, mail, niveau, 'Élève' AS role FROM eleves`;
    const profs =
      await sql`SELECT id, nom, prenom, mail, matiere, 'Professeur' AS role FROM profs`;
    const admins =
      await sql`SELECT id, nom, prenom, mail, 'Admin' AS role FROM admins`;

    const users = [...students, ...profs, ...admins];

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 },
    );
  }
}

// ID unique pour les professeurs (ex: "P123456")
function generateProfessorId(): string {
  return "P" + Math.floor(100000 + Math.random() * 900000).toString();
}

// ID unique pour les admins (ex: "A123456")
function generateAdminId(): string {
  return "A" + Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const {
      nom,
      prenom,
      mail,
      password,
      role,
      niveau,
      filiere,
      emploi_du_temps,
      matiere,
    } = await req.json();
    console.log("🟢 POST /api/admin/users - Données reçues:", {
      nom,
      prenom,
      mail,
      password,
      role,
      matiere,
    });

    if (!nom || !prenom || !mail || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let query;

    if (role === "Élève") {
      const studentId = Math.floor(
        10000000 + Math.random() * 90000000,
      ).toString(); // Génération de l'ID élève
      query = sql`
                INSERT INTO eleves (numeroetudiant, nom, prenom, mail, mdp, niveau, filiere, emploi_du_temps)
                VALUES (${studentId}, ${nom}, ${prenom}, ${mail}, ${hashedPassword}, ${niveau}, ${filiere}, ${emploi_du_temps})
                RETURNING numeroetudiant AS id, nom, prenom, mail, niveau, filiere, emploi_du_temps, 'Élève' AS role;
            `;
    } else if (role === "Professeur") {
      if (!matiere) {
        return NextResponse.json(
          { error: "Le champ 'matiere' est requis pour un professeur" },
          { status: 400 },
        );
      }

      const professorId = generateProfessorId();
      console.log("✅ ID Professeur généré :", professorId);

      query = sql`
                INSERT INTO profs (id, nom, prenom, mail, mdp, matiere)
                VALUES (${professorId}, ${nom}, ${prenom}, ${mail}, ${hashedPassword}, ${matiere})
                RETURNING id, nom, prenom, mail, matiere, 'Professeur' AS role;
            `;
    } else if (role === "Admin") {
      const adminId = generateAdminId();
      console.log("✅ ID Admin généré :", adminId);

      query = sql`
                INSERT INTO admins (id, nom, prenom, mail, mdp)
                VALUES (${adminId}, ${nom}, ${prenom}, ${mail}, ${hashedPassword})
                RETURNING id, nom, prenom, mail, 'Admin' AS role;
            `;
    } else {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    const [newUser] = await query;
    console.log("✅ Utilisateur ajouté avec succès :", newUser);
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/users:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'utilisateur" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, role } = await req.json();
    console.log("🟢 DELETE /api/admin/users - Données reçues:", { id, role });

    if (!id || !role) {
      console.log("⚠️ Données invalides");
      return NextResponse.json({ error: "ID et rôle requis" }, { status: 400 });
    }

    let query;
    if (role === "Élève") {
      query = sql`DELETE FROM eleves WHERE numeroetudiant = ${id}`;
    } else if (role === "Professeur") {
      query = sql`DELETE FROM profs WHERE id = ${id}`;
    } else if (role === "Admin") {
      query = sql`DELETE FROM admins WHERE id = ${id}`;
    } else {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    await query;
    console.log("✅ Utilisateur supprimé :", { id, role });
    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur DELETE /api/admin/users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 },
    );
  }
}
