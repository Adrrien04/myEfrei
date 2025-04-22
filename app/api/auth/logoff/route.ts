import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Déconnexion réussie." },
      { status: 200 },
    );

    response.cookies.set("auth_token", "", { expires: new Date(0) });

    return response;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 },
    );
  }
}
