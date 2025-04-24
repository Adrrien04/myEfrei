import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const articleCount = await sql`SELECT COUNT(*) FROM articles`;
    const userCount = await sql`SELECT COUNT(*) FROM eleves`;
    const eventCount = await sql`SELECT COUNT(*) FROM events`;

    return NextResponse.json({
      users: parseInt(userCount[0]?.count) || 0,
      articles: parseInt(articleCount[0]?.count) || 0,
      events: parseInt(eventCount[0]?.count) || 0,
    });
  } catch (error) {
    console.error(" ERREUR SQL :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stats" },
      { status: 500 },
    );
  }
}
