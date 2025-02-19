import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { eleves, profs, cours, admins } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedEleves() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS eleves (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
        INSERT INTO eleves (id, nom, prenom, mail, mdp, niveau, filliere, emploi_du_temps)
        VALUES (${eleve.id}, ${eleve.nom}, ${eleve.prenom}, ${eleve.mail}, ${hashedPassword}, ${eleve.niveau}, ${eleve.filliere}, ${eleve.emploi_du_temps})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedEleves;
}

async function seedProfs() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS profs (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
        VALUES (${prof.id}, ${prof.nom}, ${prof.prenom}, ${prof.mail}, ${hashedPassword}, ${prof.matiere})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedProfs;
}

async function seedCours() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS cours (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      nom VARCHAR(255) NOT NULL
    );
  `;

  const insertedCours = await Promise.all(
    cours.map(
      (cour) => sql`
        INSERT INTO cours (id, nom)
        VALUES (${cour.id}, ${cour.nom})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedCours;
}

async function seedAdmins() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
        VALUES (uuid_generate_v4(), ${admin.nom}, ${admin.prenom}, ${admin.mail}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedAdmins;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedEleves(),
      seedProfs(),
      seedCours(),
      seedAdmins(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}