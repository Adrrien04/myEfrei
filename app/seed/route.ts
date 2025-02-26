import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { eleves, profs, cours, admins } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function generateStudentNumber(length: number): string {
    const characters = '0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function seedEleves() {
    await sql`
        CREATE TABLE IF NOT EXISTS eleves (
            numeroetudiant VARCHAR(8) PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            mail TEXT NOT NULL UNIQUE,
            mdp TEXT NOT NULL,
            niveau VARCHAR(255) NOT NULL,
            filliere VARCHAR(255) NOT NULL,
            emploi_du_temps TEXT NOT NULL
        );
    `;

    const insertedEleves = await Promise.all(
        eleves.map(async (eleve) => {
            const hashedPassword = await bcrypt.hash(eleve.mdp, 10);
            return sql`
                INSERT INTO eleves (numeroetudiant, nom, prenom, mail, mdp, niveau, filliere, emploi_du_temps)
                VALUES (
                    ${eleve.numeroetudiant ?? generateStudentNumber(8)},
                    ${eleve.nom ?? ''},
                    ${eleve.prenom ?? ''},
                    ${eleve.mail ?? ''},
                    ${hashedPassword},
                    ${eleve.niveau ?? ''},
                    ${eleve.filliere ?? ''},
                    ${eleve.emploi_du_temps ?? ''}
                )
                ON CONFLICT (numeroetudiant) DO NOTHING;
            `;
        }),
    );

    return insertedEleves;
}

async function seedProfs() {
    await sql`
        CREATE TABLE IF NOT EXISTS profs (
            id VARCHAR(8) PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            mail TEXT NOT NULL UNIQUE,
            mdp TEXT NOT NULL,
            matiere VARCHAR(255) NOT NULL
        );
    `;

    const insertedProfs = await Promise.all(
        profs.map(async (prof) => {
            const hashedPassword = await bcrypt.hash(prof.mdp, 10);
            return sql`
                INSERT INTO profs (id, nom, prenom, mail, mdp, matiere)
                VALUES (
                           ${generateStudentNumber(8)},
                           ${prof.nom ?? ''},
                           ${prof.prenom ?? ''},
                           ${prof.mail ?? ''},
                           ${hashedPassword},
                           ${prof.matiere ?? ''}
                       )
                    ON CONFLICT (id) DO NOTHING;
            `;
        }),
    );

    return insertedProfs;
}
async function seedCours() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS cours (
                id VARCHAR(8) PRIMARY KEY,
                nom VARCHAR(255) NOT NULL
            );
        `;
        console.log('Table cours created successfully');
    } catch (error) {
        console.error('Error creating table cours:', error);
    }

    const insertedCours = await Promise.all(
        cours.map(
            (cour) => sql`
                INSERT INTO cours (id, nom)
                VALUES (
                    ${generateStudentNumber(8)},
                    ${cour.nom ?? ''}
                )
                ON CONFLICT (id) DO NOTHING;
            `,
        ),
    );

    return insertedCours;
}

async function seedAdmins() {
    await sql`
        CREATE TABLE IF NOT EXISTS admins (
            id VARCHAR(8) PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            mail TEXT NOT NULL UNIQUE,
            mdp TEXT NOT NULL
        );
    `;

    const insertedAdmins = await Promise.all(
        admins.map(async (admin) => {
            const hashedPassword = await bcrypt.hash(admin.mdp, 10);
            return sql`
                INSERT INTO admins (id, nom, prenom, mail, mdp)
                VALUES (
                    ${generateStudentNumber(8)},
                    ${admin.nom ?? ''},
                    ${admin.prenom ?? ''},
                    ${admin.mail ?? ''},
                    ${hashedPassword}
                )
                ON CONFLICT (id) DO NOTHING;
            `;
        }),
    );

    return insertedAdmins;
}

export async function GET() {
    try {
        await sql.begin(async (sql) => {
            await seedEleves();
            await seedProfs();
            await seedCours();
            await seedAdmins();
        });

        return new Response(JSON.stringify({ message: 'Database seeded successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}