import { NextResponse, NextRequest } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
ssl: { rejectUnauthorized: false },
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const numeroEtudiant = params.id;
    

try {
  //récupérer l'id à partir du numéro étudiant
const [eleve] = await sql`
SELECT id FROM eleves WHERE numeroetudiant = ${numeroEtudiant}
`;

if (!eleve) {
return NextResponse.json({ error: "Élève non trouvé" }, { status: 404 });
}

const id_eleve = eleve.id;


const notes = await sql`

SELECT 
    n.note,
    n.commentaire,
    c.nom AS cours,
    c.matiere,
    p.nom AS professeur
FROM notes n
JOIN cours c ON n.id_cours = c.id
JOIN profs p ON c.id_prof = p.id
WHERE n.id_eleve = ${id_eleve}
`;


    return NextResponse.json(notes);
} catch (error) {
    console.error("Erreur récupération notes élève :", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des notes" }, { status: 500 });
}
}