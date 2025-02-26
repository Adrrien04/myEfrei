import { NextResponse } from "next/server";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });

export async function GET() {
    try {
        console.log("🟢 GET /api/admin/users - Récupération des utilisateurs");

        const students = await sql`SELECT numeroetudiant AS id, nom, prenom, mail, niveau, 'Élève' AS role FROM eleves`;
        const teachers = await sql`SELECT id, nom, prenom, mail, 'Professeur' AS role FROM profs`;
        const admins = await sql`SELECT id, nom, prenom, mail, 'Admin' AS role FROM admins`;

        const users = [...students, ...teachers, ...admins];

        return NextResponse.json(users);
    } catch (error) {
        console.error("❌ Erreur GET /api/admin/users:", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
    }
}

function generateStudentNumber(length: number): string {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function POST(req: Request) {
    try {
        const { nom, prenom, mail, role, niveau, filiere, emploi_du_temps } = await req.json();
        console.log("🟢 POST /api/admin/users - Données reçues:", { nom, prenom, mail, role, niveau, filiere, emploi_du_temps });

        if (!nom || !prenom || !mail || !role) {
            console.log("⚠️ Données invalides");
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        if (role === "Élève" && (!niveau || !filiere)) {
            console.log("⚠️ Niveau ou filière manquants");
            return NextResponse.json({ error: "Le niveau et la filière sont requis pour les élèves" }, { status: 400 });
        }

        const numeroEtudiant = generateStudentNumber(8);

        
        const emploiDuTempsFinal = emploi_du_temps ?? "Non défini";

        const hashedPassword = await bcrypt.hash("defaultpassword", 10);

        let query;
        if (role === "Élève") {
            query = sql`
                INSERT INTO eleves (numeroetudiant, nom, prenom, mail, mdp, niveau, filiere, emploi_du_temps)
                VALUES (${numeroEtudiant}, ${nom}, ${prenom}, ${mail}, ${hashedPassword}, ${niveau}, ${filiere}, ${emploiDuTempsFinal})
                RETURNING numeroetudiant AS id, nom, prenom, mail, niveau, filiere, emploi_du_temps, 'Élève' AS role;
            `;
        } else if (role === "Professeur") {
            query = sql`
                INSERT INTO profs (id, nom, prenom, mail, mdp)
                VALUES (gen_random_uuid(), ${nom}, ${prenom}, ${mail}, ${hashedPassword})
                RETURNING id, nom, prenom, mail, 'Professeur' AS role;
            `;
        } else if (role === "Admin") {
            query = sql`
                INSERT INTO admins (id, nom, prenom, mail, mdp)
                VALUES (gen_random_uuid(), ${nom}, ${prenom}, ${mail}, ${hashedPassword})
                RETURNING id, nom, prenom, mail, 'Admin' AS role;
            `;
        } else {
            return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }

        const [newUser] = await query;
        console.log("✅ Utilisateur ajouté:", newUser);
        return NextResponse.json(newUser);
    } catch (error) {
        console.error("❌ Erreur POST /api/admin/users:", error);
        return NextResponse.json({ error: "Erreur lors de l'ajout de l'utilisateur" }, { status: 500 });
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
        }

        await query;
        console.log("✅ Utilisateur supprimé:", { id, role });
        return NextResponse.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE /api/admin/users:", error);
        return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, role, nom, prenom, mail, niveau, filiere, emploi_du_temps } = await req.json();
        console.log("🟢 PUT /api/admin/users - Données reçues:", { id, role, nom, prenom, mail, niveau, filiere, emploi_du_temps });

        if (!id || !role || !nom || !prenom || !mail) {
            console.log("⚠️ Données invalides");
            return NextResponse.json({ error: "ID, rôle, nom, prénom et mail requis" }, { status: 400 });
        }

        if (role === "Élève" && (!niveau || !filiere)) {
            console.log("⚠️ Niveau ou filière manquants");
            return NextResponse.json({ error: "Le niveau et la filière sont requis pour les élèves" }, { status: 400 });
        }

        const emploiDuTempsFinal = emploi_du_temps ?? "Non défini";

        let query;
        if (role === "Élève") {
            query = sql`
                UPDATE eleves
                SET nom = ${nom}, prenom = ${prenom}, mail = ${mail}, niveau = ${niveau}, filiere = ${filiere}, emploi_du_temps = ${emploiDuTempsFinal}
                WHERE numeroetudiant = ${id}
                    RETURNING numeroetudiant AS id, nom, prenom, mail, niveau, filiere, emploi_du_temps, 'Élève' AS role;
            `;
        } else if (role === "Professeur") {
            query = sql`
                UPDATE profs
                SET nom = ${nom}, prenom = ${prenom}, mail = ${mail}
                WHERE id = ${id}
                    RETURNING id, nom, prenom, mail, 'Professeur' AS role;
            `;
        } else if (role === "Admin") {
            query = sql`
                UPDATE admins
                SET nom = ${nom}, prenom = ${prenom}, mail = ${mail}
                WHERE id = ${id}
                    RETURNING id, nom, prenom, mail, 'Admin' AS role;
            `;
        } else {
            return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }

        const [updatedUser] = await query;
        if (!updatedUser) {
            console.log("⚠️ Aucune mise à jour effectuée");
            return NextResponse.json({ error: "Aucun utilisateur trouvé pour cet ID et rôle" }, { status: 404 });
        }

        console.log("✅ Utilisateur mis à jour:", updatedUser);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("❌ Erreur PUT /api/admin/users:", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 });
    }
}
