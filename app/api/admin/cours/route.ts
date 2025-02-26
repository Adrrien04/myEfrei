import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });


export async function GET() {
    try {
        const cours = await sql`
            SELECT cours.id, cours.nom, profs.nom AS prof_nom, profs.prenom AS prof_prenom, cours.matiere 
            FROM cours
            LEFT JOIN profs ON cours.id_prof = profs.id
        `;
        return NextResponse.json(cours);
    } catch (error) {
        console.error("❌ Erreur GET /api/admin/cours :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des cours" }, { status: 500 });
    }
}


function generateCourseId(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
export async function POST(req: Request) {
    try {
        const { nom, id_prof, matiere } = await req.json();
        console.log("🟢 POST /api/admin/cours - Données reçues:", { nom, id_prof, matiere });

        if (!nom || !id_prof || !matiere) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        const courseId = generateCourseId();

        const [newCourse] = await sql`
            INSERT INTO cours (id, nom, id_prof, matiere)
            VALUES (${courseId}, ${nom}, ${id_prof}, ${matiere})
            RETURNING id, nom, id_prof, matiere;
        `;

        console.log("✅ Cours ajouté :", newCourse);
        return NextResponse.json(newCourse);
    } catch (error) {
        console.error("❌ Erreur POST /api/admin/cours :", error);
        return NextResponse.json({ error: "Erreur lors de l'ajout du cours" }, { status: 500 });
    }
}
export async function PUT(req: Request) {
    try {
        const { id, nom, id_prof, matiere } = await req.json();

        if (!id || !nom || !id_prof || !matiere) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        await sql`
            UPDATE cours 
            SET nom = ${nom}, id_prof = ${id_prof}, matiere = ${matiere} 
            WHERE id = ${id}
        `;

        return NextResponse.json({ message: "Cours mis à jour avec succès" });
    } catch (error) {
        console.error("❌ Erreur PUT /api/admin/cours:", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour du cours" }, { status: 500 });
    }
}



export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID requis pour la suppression" }, { status: 400 });
        }

        await sql`DELETE FROM cours WHERE id = ${id}`;

        return NextResponse.json({ message: "Cours supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE /api/admin/cours:", error);
        return NextResponse.json({ error: "Erreur lors de la suppression du cours" }, { status: 500 });
    }
}