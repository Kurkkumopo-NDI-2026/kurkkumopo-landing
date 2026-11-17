import pixel from './assets/kurkkumopo-pixel.png'

export const GITHUB_ORG = 'https://github.com/Kurkkumopo-NDI-2026'

export interface Member {
  num: string
  name: string
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
  ['Axel Frache', 'axelfrache'],
  ['Evan Paillard', 'Evan-Paillard'],
  ['Joris Vilardell', 'jorisvilardell'],
  ['Damien Mathieu', 'damien-mathieu1'],
].map(([name, h], i) => ({
  ...palettes[i],
  num: '0' + (i + 1),
  name,
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
  /** carte « Bientôt » : titre et description viennent des traductions */
  placeholder?: boolean
}

// Ajouter un projet (terminé) : { title, desc, stack, url, banner: importedImage }
export const ALL_PROJECTS: ProjectInput[] = []

export const PROJECTS: Project[] = ALL_PROJECTS.length
  ? ALL_PROJECTS.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, '0'), size: 'cover', render: 'auto' }))
  : ['01', '02', '03'].map((num) => ({
      num,
      title: '',
      desc: '',
      stack: '—',
      url: '#projets',
      banner: pixel,
      size: 'auto 70%',
      render: 'pixelated',
      placeholder: true,
    }))

const n = String(ALL_PROJECTS.length).padStart(2, '0')

// libellés dans les traductions (t.stats), dans le même ordre
export const STATS = ['04', '01', n, '99']
