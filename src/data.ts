import pixel from './assets/kurkkumopo-pixel.png'

export const GITHUB_ORG = 'https://github.com/Kurkkumopo-NDI-2026'

export const WORDS = ['des projets', 'du café', 'des merges', 'des commits']
export const BUBBLES = ['git push', '+1 commit', 'merge ✓', 'vroum', 'café !']

export interface Member {
  num: string
  name: string
  role: string
  handle: string
  url: string
  avatar: string
  bg: string
  acc: string
  ink: string
}

const palettes = [
  { bg: '#f5b81c', acc: '#8a1c12', ink: '#070c18' },
  { bg: '#e23b2e', acc: '#ffe08a', ink: '#1a0604' },
  { bg: '#52c45a', acc: '#0b3a14', ink: '#06180a' },
  { bg: '#ff8a1e', acc: '#4a1600', ink: '#1a0a00' },
]

export const TEAM: Member[] = [
  ['Axel Frache', 'axelfrache', "Créateur de l'orga, git push --force en pleine confiance"],
  ['Evan Paillard', 'Evan-Paillard', "High cortisol : traite n'importe quelle issue"],
  ['Joris Vilardell', 'jorisvilardell', 'Transforme la caféine en commit'],
  ['Damien Mathieu', 'damien-mathieu1', 'Alias Gabano, le tigre du merge'],
].map(([name, h, role], i) => ({
  ...palettes[i],
  num: '0' + (i + 1),
  name,
  role,
  handle: '@' + h,
  url: 'https://github.com/' + h,
  avatar: 'https://github.com/' + h + '.png?size=400',
}))

export interface ProjectInput {
  title: string
  desc: string
  stack: string
  url: string
  banner: string
}

export interface Project extends ProjectInput {
  num: string
  size: string
  render: 'auto' | 'pixelated'
}

// Ajouter un projet (terminé) : { title, desc, stack, url, banner: importedImage }
export const ALL_PROJECTS: ProjectInput[] = []

export const PROJECTS: Project[] = ALL_PROJECTS.length
  ? ALL_PROJECTS.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0'), size: 'cover', render: 'auto' }))
  : ['01', '02', '03'].map((num) => ({
      num,
      title: 'Bientôt',
      desc: 'Le prochain projet apparaîtra ici.',
      stack: '—',
      url: '#projets',
      banner: pixel,
      size: 'auto 70%',
      render: 'pixelated',
    }))

const n = String(ALL_PROJECTS.length).padStart(2, '0')

export const STATS = [
  { value: '04', label: 'membres' },
  { value: '01', label: 'nuit' },
  { value: n, label: 'projets' },
  { value: '99', label: 'cafés (estimation)' },
]
