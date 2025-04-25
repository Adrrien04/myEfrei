import { NextResponse, NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest) {
try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const uuid = pathSegments[pathSegments.length - 2]; 

    const notes = await sql`
    SELECT 
        n.note,
        n.commentaire,
        c.nom AS cours
    FROM notes n
    JOIN cours c ON n.id_cours = c.id
    WHERE n.id_eleve = ${uuid}
    `;

    return NextResponse.json(notes);
} catch (error) {
    console.error("Erreur récupération notes élève :", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des notes" }, { status: 500 });
}
}