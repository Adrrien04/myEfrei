import { NextRequest } from "next/server";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not defined.");
}

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function GET(req: NextRequest, context: { params: { classe: string } }) {
  const { classe } = context.params;

  const [niveau, ...filiereParts] = decodeURIComponent(classe).split(" ");
  const filiere = filiereParts.join(" ");

  try {
    const eleves = await sql`
      SELECT id, nom, prenom, niveau, filiere
      FROM eleves
      WHERE niveau = ${niveau} AND filiere = ${filiere}
    `;
    return new Response(JSON.stringify(eleves), { status: 200 });
  } catch (error) {
    console.error("Erreur dans la requête SQL :", error);
    return new Response("Erreur interne au serveur", { status: 500 });
  }
}
