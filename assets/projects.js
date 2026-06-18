/* ===================================================================
   Bentoji Studio — portfolio data (single source of truth)
   To ADD a project: copy a block and edit. The homepage grid, the
   portfolio page, and the project detail page all read from here.
   - `link`   : if set, the card links straight to that page.
   - no link  : the card opens /work?p=<slug> (data-driven detail page).
   - `thumb`/`cover`: optional image paths. If omitted, an animated
     gradient (c1/c2/c3) is generated automatically.
   NOTE: SoundLax is real. Projects 2–5 are placeholders to edit.
   =================================================================== */
window.PROJECTS = [
  {
    slug: 'soundlax',
    title: 'SoundLax',
    year: '2026',
    category: 'Product & App Design',
    tagline: 'An ambient sound app for focus, rest, and sleep — designed to ask for less of your attention.',
    thumb: '/assets/img/hero-bg.jpg',
    link: '/soundlax-app',
    external: false
  },
  {
    slug: 'kowhai',
    title: 'Kōwhai',
    year: '2025',
    category: 'Brand & Identity',
    tagline: 'A warm, nature-led identity system for a boutique wellness brand. [Placeholder — edit in projects.js]',
    c1: '#ffb648', c2: '#ff6b4a', c3: '#ff5c8a',
    visit: '',
    facts: [
      { k: 'Discipline', v: 'Brand identity, art direction' },
      { k: 'Year', v: '2025' },
      { k: 'Role', v: 'Design & strategy' }
    ],
    body: [
      { p: 'This is placeholder copy. Replace it with the real project story in assets/projects.js. Kōwhai began with a simple question: how do you make a wellness brand feel warm without feeling soft?' },
      { h: 'The approach' },
      { p: 'We built a flexible identity around a single golden accent and a generous type system, then extended it across packaging, web, and social. Everything is designed to scale as the brand grows.' },
      { h: 'Outcome' },
      { p: 'A cohesive, recognisable system the team can run themselves. Swap this text for your actual results, metrics, or learnings.' }
    ]
  },
  {
    slug: 'driftwell',
    title: 'Driftwell',
    year: '2025',
    category: 'Product / UX',
    tagline: 'Rethinking a sleep-tracking experience around calm, not data overload. [Placeholder — edit in projects.js]',
    c1: '#36c5d0', c2: '#4a8cff', c3: '#7c5cff',
    facts: [
      { k: 'Discipline', v: 'Product design, UX' },
      { k: 'Year', v: '2025' },
      { k: 'Role', v: 'Lead designer' }
    ],
    body: [
      { p: 'Placeholder copy — replace with the real case study. Driftwell reframed a noisy dashboard into a quiet, glanceable ritual.' },
      { h: 'The approach' },
      { p: 'Information hierarchy, motion, and restraint did the heavy lifting. We removed three quarters of the original UI and kept only what helped people wind down.' }
    ]
  },
  {
    slug: 'anga',
    title: 'Anga',
    year: '2024',
    category: 'Web Design & Development',
    tagline: 'A fast, editorial marketing site for a climate-tech startup. [Placeholder — edit in projects.js]',
    c1: '#7c5cff', c2: '#ff5c8a', c3: '#4a8cff',
    facts: [
      { k: 'Discipline', v: 'Web design & build' },
      { k: 'Year', v: '2024' },
      { k: 'Role', v: 'Design & front-end' }
    ],
    body: [
      { p: 'Placeholder copy. Anga paired a bold editorial layout with a static, lightning-fast build — the same approach as this very site.' },
      { h: 'The approach' },
      { p: 'Asymmetric grids, generous type, and subtle motion. Built to load instantly and stay easy to maintain.' }
    ]
  },
  {
    slug: 'field-notes',
    title: 'Field Notes',
    year: '2024',
    category: 'Motion & Illustration',
    tagline: 'An abstract motion system and illustration set for a podcast network. [Placeholder — edit in projects.js]',
    c1: '#3ddc97', c2: '#36c5d0', c3: '#ffb648',
    facts: [
      { k: 'Discipline', v: 'Motion, illustration' },
      { k: 'Year', v: '2024' },
      { k: 'Role', v: 'Art direction' }
    ],
    body: [
      { p: 'Placeholder copy. A library of looping abstract animations and marks that gave a growing podcast network a single visual language.' }
    ]
  }
];
