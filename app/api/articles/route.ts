import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function createTableIfNotExists() {
    await sql`
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
    `;
}

export async function POST(req: Request) {
    try {
        const { title, content, image_url } = await req.json();
        if (!title || !content) {
            return new Response(JSON.stringify({ error: 'Title and content are required.' }), { status: 400 });
        }
        const safeImageUrl = image_url ?? null;
        await sql`
            INSERT INTO articles (title, content, image_url)
            VALUES (${title}, ${content}, ${safeImageUrl});
        `;

        return new Response(JSON.stringify({ message: 'Article published successfully.' }), { status: 200 });
    } catch (error) {
        console.error('❌ Error in POST /api/articles:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function GET() {
    try {
        await createTableIfNotExists();

        const articles = await sql`
            SELECT id, title, content, image_url FROM articles;
        `;

        return new Response(JSON.stringify(articles), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await createTableIfNotExists();

        const { id } = await req.json();

        await sql`
            DELETE FROM articles
            WHERE id = ${id};
        `;

        return new Response(JSON.stringify({ message: 'Article supprimé avec succès.' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await createTableIfNotExists();

        const { id, title, content, image_url  } = await req.json();

        console.log('Updating article:', { id, title, content, image_url });

        const result = await sql`
            UPDATE articles
            SET title = ${title}, content = ${content}, image_url = ${image_url}
            WHERE id = ${id};
        `;

        return new Response(JSON.stringify({ message: 'Article mis à jour avec succès.' }), { status: 200 });
    } catch (error) {
        console.error('Failed to update article:', error);
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}
