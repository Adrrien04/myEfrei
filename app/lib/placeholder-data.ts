

function generateStudentNumber(length: number): string {
  const characters = '0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const eleves = [
  {
    numeroetudiant: generateStudentNumber(8),
    nom: 'Dupont',
    prenom: 'Jean',
    mail: 'jean.dupont@efrei.com',
    mdp: 'password123',
    niveau: 'L1',
    filliere: 'Informatique',
    emploi_du_temps: '',
  },
  {
    numeroetudiant: generateStudentNumber(8),
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
    nom: 'Durand',
    prenom: 'Pierre',
    mail: 'pierre.durand@efrei.com',
    mdp: 'password789',
    matiere: 'Mathématiques',
  },
  {
    nom: 'Lefevre',
    prenom: 'Sophie',
    mail: 'sophie.lefevre@efrei.com',
    mdp: 'password101',
    matiere: 'Physique',
  },
];

const cours = [
  {
    nom: 'Mathématiques',
  },
  {
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