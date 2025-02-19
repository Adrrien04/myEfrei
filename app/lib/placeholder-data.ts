// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
import { v4 as uuidv4 } from 'uuid';

const eleves = [
  {
    id: uuidv4().slice(0, 8),
    nom: 'Dupont',
    prenom: 'Jean',
    mail: 'jean.dupont@efrei.com',
    mdp: 'password123',
    niveau: 'L1',
    filliere: 'Informatique',
    emploi_du_temps: '',
  },
  {
    id: uuidv4().slice(0, 8),
    nom: 'Martin',
    prenom: 'Marie',
    mail: 'marie.martin@efrei.com',
    mdp: 'password456',
    niveau: 'L2',
    filliere: 'Biologie',
    emploi_du_temps: '',
  },
];

const profs = [
  {
    id: uuidv4().slice(0, 8),
    nom: 'Durand',
    prenom: 'Pierre',
    mail: 'pierre.durand@efrei.com',
    mdp: 'password789',
    matiere: 'Mathématiques',
  },
  {
    id: uuidv4().slice(0, 8),
    nom: 'Lefevre',
    prenom: 'Sophie',
    mail: 'sophie.lefevre@efrei.com',
    mdp: 'password101',
    matiere: 'Physique',
  },
];

const cours = [
  {
    id: uuidv4().slice(0, 8),
    nom: 'Mathématiques',
  },
  {
    id: uuidv4().slice(0, 8),
    nom: 'Physique',
  },
];

const admins = [
  {
    nom: 'Chandrakumar',
    prenom: 'Adrrien',
    mail: 'adrrien.chandrakumar@efrei.com',
    mdp: 'adminpass123',
  },
  {
    nom: 'Camara',
    prenom: 'Oumou',
    mail: 'oumou.camara@efrei.com',
    mdp: 'adminpass456',
  },
];
export { eleves, profs, cours, admins };
