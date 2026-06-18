/* ===================================================================
   Bentoji Studio — portfolio data (single source of truth)
   Real projects sourced from Ben's "BN Selected works | 2026" Figma.
   Card thumbnails currently use generated gradient art (themed per
   project). To use the real screenshots, drop images into
   /assets/img/work/<slug>.jpg and add `thumb: '/assets/img/work/<slug>.jpg'`.
   Taglines marked [check] were placeholder/!!unclear in the Figma — confirm copy.
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
    slug: 'clearpoint',
    title: 'ClearPoint',
    year: '2025',
    category: 'Website',
    tagline: 'A technology consultancy website redesign focused on AI-powered, human-centred digital experiences.',
    location: 'Auckland, NZ · Tech & Innovation Consultancy',
    c1: '#ff5a4a', c2: '#7c2bff', c3: '#ff2e8b',
    facts: [
      { k: 'Discipline', v: 'Website redesign · UI/UX' },
      { k: 'Sector', v: 'Tech & Innovation Consultancy' },
      { k: 'Role', v: 'UI/UX Design Lead (agency-based)' }
    ],
    body: [
      { h: 'Client overview' },
      { p: "ClearPoint's strategic shift towards AI-driven, human-centred solutions created a gap between its evolving capabilities and its existing digital presence. A full website redesign was needed to realign the brand, improve clarity, and support future growth." },
      { p: 'The goal was not just to redesign the website, but to translate ClearPoint’s evolving business strategy into a clear and scalable digital experience.' },
      { h: 'The challenge' },
      { p: 'Communicating complex service offerings clearly, balancing technical credibility with business clarity, modernising the brand’s positioning, and creating a scalable structure to support ongoing content and service expansion.' },
      { h: 'Approach' },
      { p: 'Defined user personas and mapped key customer journeys, restructured the information architecture to simplify navigation, validated layout with wireframes, and designed a cohesive UI aligned with the brand and its positioning.' }
    ]
  },
  {
    slug: 'lannock',
    title: 'Lannock / Strata Finance',
    year: '2025',
    category: 'Customer Portal',
    tagline: 'A customer portal that simplifies complex strata & property finance journeys.',
    location: 'Auckland, NZ · Finance',
    c1: '#36c5d0', c2: '#4a8cff', c3: '#2b6cff',
    facts: [
      { k: 'Discipline', v: 'Product design · UX' },
      { k: 'Sector', v: 'Finance' },
      { k: 'Role', v: 'Product / UX Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A customer portal experience for a strata and property finance lender, designed to make complex finance products clear and manageable for everyday users. [Full case study to be added from Figma.]' }
    ]
  },
  {
    slug: 'tedxauckland',
    title: 'TEDxAuckland',
    year: '2024',
    category: 'Website',
    tagline: 'An event platform celebrating bold ideas from Aotearoa.',
    location: 'Auckland, NZ · Independent TED event',
    c1: '#ff3b3b', c2: '#ff6b4a', c3: '#ff2e6b',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Events / Media' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'An engaging event platform designed to showcase speakers, sessions, and ideas for an independent TED event celebrating bold thinking from Aotearoa. [Full case study to be added from Figma.]' }
    ]
  },
  {
    slug: 'autodesk-flow-capture',
    title: 'Autodesk Flow Capture',
    year: '2024',
    category: 'Website',
    tagline: 'Marketing experience for a cloud collaboration platform for film & television production (formerly Moxion).',
    location: 'NZ & Global · Film & TV Production',
    c1: '#36c5d0', c2: '#1f8cff', c3: '#0fd1a0',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Film & TV Production Software' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A cloud-based collaboration platform for film and television production (formerly Moxion, now Autodesk Flow Capture). [Full case study to be added from Figma.]' }
    ]
  },
  {
    slug: 'released',
    title: 'Released',
    year: '2024',
    category: 'Website',
    tagline: 'Website for a commercial property management software platform.',
    location: 'NZ & Global · Commercial Property Management Software',
    c1: '#7c5cff', c2: '#4a8cff', c3: '#b15cff',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Property Management Software' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A website for a commercial property management software platform. [Copy in the Figma was placeholder here — confirm the real description.]' }
    ]
  },
  {
    slug: 'kapili',
    title: 'Kapili Roofing & Painting',
    year: '2023',
    category: 'Website',
    tagline: 'A bold marketing site for a Hawaii-based roofing & solar company.',
    location: 'Hawaii, US · Roofing & Solar',
    c1: '#ffb648', c2: '#ff6b4a', c3: '#36c5d0',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Roofing & Solar' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A bold, conversion-focused marketing site for a Hawaii-based roofing and solar company. [Full case study to be added from Figma.]' }
    ]
  }
];
