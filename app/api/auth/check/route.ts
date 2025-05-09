import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import jwt from "jsonwebtoken";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Aucun token dans l'en-tête");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token récupéré :", token);

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as any;
    console.log("Token décodé :", decoded);

    let emploiDuTemps = null;
    if (decoded.role === "eleves") {
      const [student] = await sql`
                SELECT emploi_du_temps FROM eleves WHERE numeroetudiant = ${decoded.numeroetudiant}
            `;
      console.log("Résultat SQL - emploi du temps récupéré :", student);
      emploiDuTemps = student?.emploi_du_temps ?? "Aucun cours prévu";

      return NextResponse.json({
        authenticated: true,
        email: decoded.email,
        name: decoded.name,
        surname: decoded.surname,
        role: decoded.role,
        numeroetudiant: decoded.numeroetudiant || null,
        emploi_du_temps: emploiDuTemps,
      });
    }

    if (decoded.role === "profs") {
      const [prof] = await sql`
        SELECT id FROM profs WHERE mail = ${decoded.email}
      `;
      return NextResponse.json({
        authenticated: true,
        email: decoded.email,
        name: decoded.name,
        surname: decoded.surname,
        role: decoded.role,
        id: prof?.id || null,
      });
    }

    if (decoded.role === "admins") {
      return NextResponse.json({
        authenticated: true,
        email: decoded.email,
        name: decoded.name,
        surname: decoded.surname,
        role: decoded.role,
      });
    }

    return NextResponse.json(
      { authenticated: false, error: "Rôle non reconnu" },
      { status: 401 },
    );
  } catch (error) {
    console.log("Token invalide :", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
