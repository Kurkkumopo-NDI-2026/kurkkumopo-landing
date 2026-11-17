export const LANGS = ['fr', 'en', 'fi'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_NAMES: Record<Lang, string> = { fr: 'Français', en: 'English', fi: 'Suomi' }

const fr = {
  meta: {
    title: "Kurkkumopo · Nuit de l'Info 2026",
  },
  nav: {
    projects: 'Projets',
    team: 'Équipe',
    night: 'La nuit',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toLight: 'Passer en mode clair',
    toDark: 'Passer en mode sombre',
    language: 'Langue',
  },
  hero: {
    badge: "NUIT DE L'INFO 2026",
    title: 'Une nuit, quatre devs et',
    words: ['des projets', 'du café', 'des merges', 'des commits'],
    lead: "Le hub de l'équipe Kurkkumopo : tous les projets construits pendant la Nuit de l'Info 2026, au même endroit.",
    ctaProjects: 'Voir les projets →',
    ctaGithub: 'Voir sur GitHub',
    bubbles: ['git push', '+1 commit', 'merge ✓', 'vroum', 'café !'],
    kartAlt: "Kurkkumopo, mascotte de l'équipe",
  },
  road: ['CAFÉ', 'BUG #42', 'TRAVAUX', 'DEPLOY', 'CAFÉ x2'],
  stats: ['membres', 'nuit', 'projets', 'cafés (estimation)'],
  projects: {
    kicker: 'PROJETS',
    title: "Ce qu'on construit pendant la nuit.",
    sub: 'Codés entre le coucher et le lever du soleil. Survole un projet pour découvrir sa stack, ouvre-le pour le dépôt et la démo.',
    label: 'PROJET',
    soonTitle: 'Bientôt',
    soonDesc: 'Le prochain projet apparaîtra ici.',
  },
  team: {
    kicker: 'ÉQUIPE',
    title: 'Les quatre derrière les commits.',
    agent: 'AGENT',
    roles: [
      "Créateur de l'orga, git push --force en pleine confiance",
      "High cortisol : traite n'importe quelle issue",
      'Transforme la caféine en commit',
      'Alias Gabano, le tigre du merge',
    ],
  },
  cta: {
    title: 'Les commits arrivent.',
    accent: 'Le café aussi.',
    github: 'Suivre sur GitHub →',
    projects: 'Les projets',
  },
  footer: {
    tagline: "Hub de l'équipe Kurkkumopo, Nuit de l'Info 2026.",
    event: "NUIT DE L'INFO",
    made: 'Fait avec du café · zzZ',
  },
}

export type Messages = typeof fr

const en: Messages = {
  meta: {
    title: "Kurkkumopo · Nuit de l'Info 2026",
  },
  nav: {
    projects: 'Projects',
    team: 'Team',
    night: 'The night',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    language: 'Language',
  },
  hero: {
    badge: "NUIT DE L'INFO 2026",
    title: 'One night, four devs and',
    words: ['projects', 'coffee', 'merges', 'commits'],
    lead: "Team Kurkkumopo's hub: every project built during Nuit de l'Info 2026, in one place.",
    ctaProjects: 'See the projects →',
    ctaGithub: 'View on GitHub',
    bubbles: ['git push', '+1 commit', 'merge ✓', 'vroom', 'coffee!'],
    kartAlt: 'Kurkkumopo, the team mascot',
  },
  road: ['COFFEE', 'BUG #42', 'ROADWORK', 'DEPLOY', 'COFFEE x2'],
  stats: ['members', 'night', 'projects', 'coffees (estimated)'],
  projects: {
    kicker: 'PROJECTS',
    title: 'What we build overnight.',
    sub: 'Coded between sunset and sunrise. Hover a project to see its stack, open it for the repo and the demo.',
    label: 'PROJECT',
    soonTitle: 'Coming soon',
    soonDesc: 'The next project will show up here.',
  },
  team: {
    kicker: 'TEAM',
    title: 'The four behind the commits.',
    agent: 'AGENT',
    roles: [
      'Created the org, git push --force with full confidence',
      'High cortisol: handles any issue',
      'Turns caffeine into commits',
      'A.k.a. Gabano, the tiger of merges',
    ],
  },
  cta: {
    title: 'The commits are coming.',
    accent: 'So is the coffee.',
    github: 'Follow on GitHub →',
    projects: 'The projects',
  },
  footer: {
    tagline: "Team Kurkkumopo's hub, Nuit de l'Info 2026.",
    event: "NUIT DE L'INFO",
    made: 'Made with coffee · zzZ',
  },
}

const fi: Messages = {
  meta: {
    title: "Kurkkumopo · Nuit de l'Info 2026",
  },
  nav: {
    projects: 'Projektit',
    team: 'Tiimi',
    night: 'Yö',
    openMenu: 'Avaa valikko',
    closeMenu: 'Sulje valikko',
    toLight: 'Vaihda vaaleaan tilaan',
    toDark: 'Vaihda tummaan tilaan',
    language: 'Kieli',
  },
  hero: {
    badge: "NUIT DE L'INFO 2026",
    title: 'Yksi yö, neljä koodaria ja',
    words: ['projekteja', 'kahvia', 'mergejä', 'committeja'],
    lead: "Kurkkumopo-tiimin keskus: kaikki Nuit de l'Info 2026 -tapahtumassa rakennetut projektit yhdessä paikassa.",
    ctaProjects: 'Katso projektit →',
    ctaGithub: 'Katso GitHubissa',
    bubbles: ['git push', '+1 commit', 'merge ✓', 'brum brum', 'kahvia!'],
    kartAlt: 'Kurkkumopo, tiimin maskotti',
  },
  road: ['KAHVI', 'BUGI #42', 'TIETYÖ', 'DEPLOY', 'KAHVI x2'],
  stats: ['jäsentä', 'yö', 'projektia', 'kahvia (arvio)'],
  projects: {
    kicker: 'PROJEKTIT',
    title: 'Mitä rakennamme yön aikana.',
    sub: 'Koodattu auringonlaskun ja -nousun välillä. Vie hiiri projektin päälle nähdäksesi sen teknologiat, avaa se nähdäksesi repon ja demon.',
    label: 'PROJEKTI',
    soonTitle: 'Tulossa pian',
    soonDesc: 'Seuraava projekti ilmestyy tähän.',
  },
  team: {
    kicker: 'TIIMI',
    title: 'Neljä tekijää committien takana.',
    agent: 'AGENTTI',
    roles: [
      'Perusti organisaation, git push --force täydellä itsevarmuudella',
      'Korkea kortisoli: hoitaa minkä tahansa issuen',
      'Muuttaa kofeiinin commiteiksi',
      'Alias Gabano, mergejen tiikeri',
    ],
  },
  cta: {
    title: 'Commitit ovat tulossa.',
    accent: 'Niin on kahvikin.',
    github: 'Seuraa GitHubissa →',
    projects: 'Projektit',
  },
  footer: {
    tagline: "Kurkkumopo-tiimin keskus, Nuit de l'Info 2026.",
    event: "NUIT DE L'INFO",
    made: 'Tehty kahvilla · zzZ',
  },
}

export const MESSAGES: Record<Lang, Messages> = { fr, en, fi }
