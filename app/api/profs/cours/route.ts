import { NextRequest } from "next/server";
import postgres from "postgres";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];

  let profId: string;
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
    profId = decoded.id;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }

  const cours = await sql`
    SELECT id, nom, matiere, classe
    FROM cours
    WHERE id_prof = ${profId}
  `;

  return new Response(JSON.stringify(cours), { status: 200 });
}
