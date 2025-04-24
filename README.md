# 📘 myEfrei

**myEfrei** est une application web fullstack développée avec [Next.js](https://nextjs.org/) et [TypeScript], pensée pour centraliser la gestion des services numériques de l'école **Efrei**.

## 🌐 Lien vers le site en ligne

🔗 [https://my-efrei.vercel.app](https://my-efrei.vercel.app)

## ✨ Fonctionnalités principales

- 🔐 Authentification sécurisée (JWT)
- 👩‍🎓 Portail étudiant : emploi du temps personnalisé
- 👨‍🏫 Portail professeur : emploi du temps filtré par prof
- 🧑‍💼 Portail administrateur :
  - Création, modification et suppression des cours
  - Assignation des cours aux professeurs
  - Gestion des actualités (articles), slides et événements

---

## 📑 Pages principales

| Page                          | Description                          |
|-------------------------------|--------------------------------------|
| `/`                           | Page d’accueil                       |
| `/login`                      | Connexion                            |
| `/dashboard`                  | Tableau de bord général              |
| `/portal/student/schedule`    | Emploi du temps étudiant             |
| `/portal/profs/schedule`      | Emploi du temps professeur           |
| `/portal/admin/cours`         | Gestion des cours (admin)           |
| `/portal/admin/news`          | Gestion des articles (admin)        |
| `/portal/admin/events`        | Gestion des événements (admin)      |
| `/portal/admin/slides`        | Gestion des présentations/slides    |

---

## ⚙️ Structure du projet

app/
├─ api/                   # Backend - Routes API
├─ portal/                # Frontend - Pages par rôle
├─ ui/                    # Composants React réutilisables
├─ lib/                   # Fonctions, types
├─ login/, dashboard/     # Pages globales

---

## 📦 Backend (API)

Le backend est intégré au projet grâce aux routes API de Next.js (`app/api/`).

### Exemples :
- `POST /api/articles` : ajouter un article
- `GET /api/student/schedule` : récupérer l’emploi du temps étudiant
- `POST /api/events` : créer un événement
- `POST /api/auth/check` : vérifier un token utilisateur

---

## 🖥️ Frontend

- Créé avec **React + TypeScript**
- Design stylisé avec **Tailwind CSS**
- Chaque page utilise des **composants** depuis `ui/Components`

---

## 🗄️ Base de données

- **PostgreSQL**
- Connexion via `process.env.POSTGRES_URL`
- Tables : `cours`, `articles`, `events`, `slides`, `users`, etc.

---

## 🚀 Lancement local

```bash
pnpm install
pnpm dev
```

---
⸻

🧑‍💻 Auteur

Développé par Oumou (https://github.com/fluffykoo) et Adrrien (https://github.com/Adrrien04) dans le cadre d’un projet web à l’Efrei.

⸻
