import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function createTableIfNotExists() {
    await sql`
        CREATE TABLE IF NOT EXISTS slides (
            id SERIAL PRIMARY KEY,
            image_url VARCHAR(255) NOT NULL,
            title VARCHAR(255),
            text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
}

export async function POST(req: Request) {
    try {
        const { image_url, title, text } = await req.json();
        if (!image_url) {
            return new Response(JSON.stringify({ error: 'Image URL is required.' }), { status: 400 });
        }
        await sql`
            INSERT INTO slides (image_url, title, text)
            VALUES (${image_url}, ${title ?? null}, ${text ?? null});
        `;

        return new Response(JSON.stringify({ message: 'Slide created successfully.' }), { status: 200 });
    } catch (error) {
        console.error('❌ Error in POST /api/slides:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function GET() {
    try {
        await createTableIfNotExists();

        const slides = await sql`
            SELECT id, image_url, title, text FROM slides;
        `;

        return new Response(JSON.stringify(slides), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await createTableIfNotExists();

        const { id } = await req.json();

        await sql`
            DELETE FROM slides
            WHERE id = ${id};
        `;

        return new Response(JSON.stringify({ message: 'Slide deleted successfully.' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await createTableIfNotExists();

        const { id, image_url, title, text } = await req.json();

        console.log('Updating slide:', { id, image_url, title, text });

        const result = await sql`
            UPDATE slides
            SET image_url = ${image_url}, title = ${title ?? null}, text = ${text ?? null}
            WHERE id = ${id};
        `;

        return new Response(JSON.stringify({ message: 'Slide updated successfully.' }), { status: 200 });
    } catch (error) {
        console.error('Failed to update slide:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}
