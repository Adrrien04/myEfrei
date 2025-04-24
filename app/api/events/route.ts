import postgres from "postgres";


const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function createEventsTableIfNotExists() {
    await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL
    );
  `;

    const locationColumn = await sql`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'location';
  `;
    if (locationColumn.length === 0) {
        console.log("➡️ Adding missing 'location' column to 'events' table...");
        await sql`
      ALTER TABLE events ADD COLUMN location VARCHAR(255);
    `;
    }

    const timeColumn = await sql`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'time';
  `;
    if (timeColumn.length === 0) {
        console.log("➡️ Adding missing 'time' column to 'events' table...");
        await sql`
      ALTER TABLE events ADD COLUMN time TIME;
    `;
    }
}

export async function POST(req: Request) {
    try {
        await createEventsTableIfNotExists();

        const { title, date, description, location, time } = await req.json();

        if (!title || !date || !description) {
            return new Response(JSON.stringify({ error: "Title, date and description are required." }), { status: 400 });
        }

        await sql`
            INSERT INTO events (title, date, description, location, time)
            VALUES (${title}, ${date}, ${description}, ${location}, ${time});
        `;

        return new Response(JSON.stringify({ message: "Event published successfully." }), { status: 200 });

    } catch (error) {
        console.error(" Error in POST /api/events:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function GET() {
    try {
        await createEventsTableIfNotExists();

        const events = await sql`
      SELECT id, title, description, date, time, location FROM events;
    `;

        return new Response(JSON.stringify(events), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}
