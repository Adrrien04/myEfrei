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
        const { nom, id_prof, matiere, jour, horaire } = await req.json();
        console.log("🟢 POST /api/admin/cours - Données reçues:", { nom, id_prof, matiere, jour, horaire });

        // ✅ Vérification des champs obligatoires
        if (!nom || !id_prof || !matiere || !jour || !horaire) {
            return NextResponse.json({ error: "Tous les champs sont requis (nom, id_prof, matiere, jour, horaire)" }, { status: 400 });
        }

        // ✅ Vérification si le professeur existe
        const [profExists] = await sql`
            SELECT id FROM profs WHERE id = ${id_prof}
        `;
        if (!profExists) {
            return NextResponse.json({ error: "Professeur introuvable" }, { status: 404 });
        }

        // ✅ Génération de l'ID du cours
        const courseId = generateCourseId();

        // ✅ Insertion du cours avec jour et horaire
        const [newCourse] = await sql`
            INSERT INTO cours (id, nom, id_prof, matiere, jour, horaire)
            VALUES (${courseId}, ${nom}, ${id_prof}, ${matiere}, ${jour}, ${horaire})
            RETURNING id, nom, id_prof, matiere, jour, horaire;
        `;

        console.log("✅ Cours ajouté avec succès :", newCourse);
        return NextResponse.json(newCourse);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du cours :", error);
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