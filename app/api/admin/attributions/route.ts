import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: { rejectUnauthorized: false } });


export async function GET() {
    try {
        console.log("🟢 GET /api/admin/attributions - Récupération des attributions");

const attributions = await sql`
    SELECT a.id, a.id_cours, c.nom AS cours_nom,
    e.numeroetudiant, e.nom AS etudiant_nom, e.prenom AS etudiant_prenom, e.filiere
    FROM attributions a
    JOIN cours c ON a.id_cours = c.id
    JOIN eleves e ON a.id_etudiant = e.numeroetudiant
`;
        return NextResponse.json(attributions);
    } catch (error) {
        console.error("❌ Erreur GET /api/admin/attributions :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des attributions" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const { id_cours, id_etudiant } = await req.json();
        console.log("🟢 POST /api/admin/attributions - Données reçues:", { id_cours, id_etudiant });

        if (!id_cours || !id_etudiant) {
            console.log("⚠️ Données invalides");
            return NextResponse.json({ error: "L'ID du cours et de l'élève sont requis" }, { status: 400 });
        }

      
        const existing = await sql`
            SELECT * FROM attributions WHERE id_cours = ${id_cours} AND id_etudiant = ${id_etudiant}
        `;

        if (existing.length > 0) {
            return NextResponse.json({ error: "L'élève est déjà inscrit à ce cours" }, { status: 400 });
        }

        
        const [newAttribution] = await sql`
            INSERT INTO attributions (id_cours, id_etudiant, date_attribution)
            VALUES (${id_cours}, ${id_etudiant}, NOW())
            RETURNING id, id_cours, id_etudiant;
        `;

        console.log("✅ Attribution ajoutée:", newAttribution);
        return NextResponse.json(newAttribution);
    } catch (error) {
        console.error("❌ Erreur POST /api/admin/attributions :", error);
        return NextResponse.json({ error: "Erreur lors de l'ajout de l'attribution" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        console.log("🟢 DELETE /api/admin/attributions - ID reçu:", id);

        if (!id) {
            return NextResponse.json({ error: "L'ID de l'attribution est requis" }, { status: 400 });
        }

        await sql`DELETE FROM attributions WHERE id = ${id}`;

        console.log("✅ Attribution supprimée:", id);
        return NextResponse.json({ message: "Attribution supprimée avec succès" });
    } catch (error) {
        console.error("❌ Erreur DELETE /api/admin/attributions :", error);
        return NextResponse.json({ error: "Erreur lors de la suppression de l'attribution" }, { status: 500 });
    }
}