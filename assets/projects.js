/* ===================================================================
   Bentoji Studio - portfolio data (single source of truth)
   Real projects, copy, thumbnails and screenshots from Ben's
   "BN Selected works | 2026" Figma case studies.
   To ADD a project: copy a block and edit.
   - thumb   : card image
   - featured: true shows the project on the homepage (in file order, max 4)
   - hidden  : true hides it everywhere
   - types   : which Work filters it appears under (see WORK_TYPES below)
   - gallery : screenshots shown on the detail page (native <img>)
   - body    : {h} heading, {p} paragraph, {list:[...]} bullet list
   =================================================================== */
window.PROJECTS = [
  {
    slug: 'soundlax',
    types: ['product', 'brand'],
    featured: true,
    link: '/work/soundlax/',
    title: 'SoundLax',
    year: '2026',
    category: 'App design',
    tagline: 'An ambient sound app for focus, rest, and sleep. Designed to ask less of your attention.',
    location: 'New Zealand · Productivity & Wellbeing',
    thumb: '/assets/img/work/soundlax/hero.webp',
    thumbClass: 'thumb-contain',
    facts: [
      { k: 'Discipline', v: 'Product design, UX research, UI design, brand identity' },
      { k: 'Type', v: 'iOS app' },
      { k: 'Role', v: 'Sole designer and product owner' },
      { k: 'Status', v: 'Live on the App Store' }
    ]
  },

  {
    slug: 'cohesive-construction',
    types: ['web'],
    featured: true,
    title: 'Cohesive Construction',
    year: '2025',
    category: 'Website design',
    tagline: 'A website for a commercial and industrial builder, designed around how people check a company before they get in touch.',
    location: 'South Island, NZ · Commercial & Industrial Construction',
    link: '/work/cohesive-construction/',
    thumb: '/assets/img/work/cohesive/hero.webp',
    visit: 'https://cohesive.net.nz',
    facts: [
      { k: 'Discipline', v: 'Website UX/UI · IA · Figma handover' },
      { k: 'Sector', v: 'Commercial & Industrial Construction' },
      { k: 'Role', v: 'UX/UI Designer (agency collaboration)' }
    ]
  },

  {
    slug: 'clearpoint',
    types: ['web'],
    hidden: true,
    title: 'ClearPoint',
    year: '2025',
    category: 'Website',
    tagline: 'A technology consultancy website redesign focused on AI-powered, human-centred digital experiences.',
    location: 'Auckland, NZ · Tech & Innovation Consultancy',
    thumb: '/assets/img/work/clearpoint.jpg',
    cover: '/assets/img/work/clearpoint.jpg',
    coverClass: 'cover-full',
    gallery: ['/assets/img/work/clearpoint-3.jpg', '/assets/img/work/clearpoint-5.jpg', '/assets/img/work/clearpoint-9.jpg', '/assets/img/work/clearpoint-10.jpg', '/assets/img/work/clearpoint-11.jpg'],
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
      { list: ['Communicating complex service offerings in a clear and structured way', 'Balancing technical credibility with business clarity', 'Aligning the brand with a more modern, future-focused positioning', 'Improving navigation and content hierarchy for diverse user groups', 'Creating a scalable structure to support ongoing content and service expansion'] },
      { h: 'Approach' },
      { list: ['Defined user personas and mapped key customer journeys', 'Restructured the information architecture to simplify navigation', 'Used wireframes to validate layout and content flow', 'Designed a cohesive UI aligned with the brand and positioning', 'Built a reusable design system to ensure consistency and scalability'] }
    ]
  },

  {
    slug: 're-leased',
    types: ['web'],
    hidden: true,
    title: 'Re-Leased',
    year: '2025',
    category: 'Website',
    tagline: 'A platform for commercial landlords, property managers, and tenants - streamlining lease, maintenance, compliance, and accounting with automation and AI-powered workflows.',
    location: 'NZ & Global · Commercial Property Management Software',
    thumb: '/assets/img/work/re-leased.jpg',
    cover: '/assets/img/work/re-leased.jpg',
    coverClass: 'cover-full',
    gallery: ['/assets/img/work/re-leased-2.jpg', '/assets/img/work/re-leased-8.jpg', '/assets/img/work/re-leased-9.jpg', '/assets/img/work/re-leased-11.jpg', '/assets/img/work/re-leased-12.jpg'],
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Property Management Software' },
      { k: 'Role', v: 'Lead Designer (agency-based)' }
    ],
    body: [
      { h: 'Client overview' },
      { p: 'Re-Leased offers a powerful platform for commercial landlords, property managers, and tenants, streamlining lease, maintenance, compliance, and accounting via automation and AI-powered workflows.' },
      { h: 'Key deliverables' },
      { list: ['Customer journey mapping', 'Information architecture (IA) & sitemap', 'Wireframes & UI design for key pages', 'Comprehensive design / style guide'] }
    ]
  },

  {
    slug: 'lannock',
    types: ['product'],
    hidden: true,
    title: 'Lannock / Strata Finance',
    year: '2025',
    category: 'Customer Portal',
    tagline: 'A customer portal for a finance platform - simplifying complex loan workflows, document management, and multi-user access.',
    location: 'New Zealand · Finance',
    thumb: '/assets/img/work/lannock.jpg',
    cover: '/assets/img/work/lannock.jpg',
    coverClass: 'cover-full',
    gallery: ['/assets/img/work/lannock-2.jpg', '/assets/img/work/lannock-3.jpg', '/assets/img/work/lannock-4.jpg', '/assets/img/work/lannock-5.jpg', '/assets/img/work/lannock-6.jpg', '/assets/img/work/lannock-7.jpg'],
    facts: [
      { k: 'Discipline', v: 'Product design · IA & workflows' },
      { k: 'Sector', v: 'Finance' },
      { k: 'Role', v: 'UX/UI Design Lead' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A web-based customer portal for Lannock, enabling strata managers to manage buildings, submit loan proposals, and review financial documentation within a centralised system.' },
      { p: 'The platform supports complex financial workflows, where funding is provided at the strata-plan (building) level, requiring coordination across stakeholders and strict documentation processes.' },
      { h: 'The system needed to support' },
      { list: ['Multi-building management', 'Loan proposal creation and status tracking', 'Document submission and validation', 'Financial review and approval workflows'] },
      { h: 'The problem' },
      { p: 'Strata managers had to manage multiple buildings, submit loan proposals, and handle large volumes of financial documents. Communication was fragmented across email, phone calls and an outdated system; users lacked visibility into application status; coordination between stakeholders was inconsistent and error-prone; document-heavy workflows created confusion around actions and responsibilities; and financial-compliance constraints added complexity to every interaction.' },
      { h: 'Key solutions' },
      { list: ['Structured workflows into clear, repeatable stages: Application → Conditions → Validation → Decision', 'A status and label system designed for visibility - surfacing what needs attention, what is complete, and what is blocked', 'Information organised into clear sections with reused layout patterns, prioritising key actions over supporting detail', 'Designed for repetition and scale - supporting repeated use across many buildings, applications, and users without adding complexity'] },
      { h: 'What changed' },
      { list: ['A clear, intuitive IA supporting multiple user types (owners, managers, tenants)', 'Complex financial and application processes became easier to manage, navigate and understand', 'Internal teams benefited from more consistent data capture and reduced administrative overhead', 'Document-heavy interactions were streamlined into guided journeys, improving usability for non-technical users'] }
    ]
  },

  {
    slug: 'tedxauckland',
    types: ['web'],
    link: '/work/tedxauckland/',
    title: 'TEDxAuckland',
        category: 'Website',
    tagline: 'A volunteer redesign of the TEDxAuckland event website, built around the speakers.',
    location: 'Auckland, NZ · Independent TED event',
    thumb: '/assets/img/work/tedxauckland/hero.webp',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Events / Media' },
      { k: 'Role', v: 'Volunteer, design lead' }
    ]
  },

  {
    slug: 'autodesk-flow-capture',
    types: ['web'],
    featured: true,
    title: 'Autodesk Flow Capture',
    year: '2024',
    category: 'Website',
    tagline: 'A ground-up marketing site redesign for a cloud collaboration platform for film & TV production (formerly Moxion).',
    location: 'NZ & Global · Film & TV Production',
    thumb: '/assets/img/work/autodesk-flow-capture.jpg',
    cover: '/assets/img/work/autodesk-flow-capture.jpg',
    coverClass: 'cover-full',
    gallery: ['/assets/img/work/autodesk-flow-capture-3.jpg', '/assets/img/work/autodesk-flow-capture-5.jpg', '/assets/img/work/autodesk-flow-capture-6.jpg', '/assets/img/work/autodesk-flow-capture-8.jpg', '/assets/img/work/autodesk-flow-capture-9.jpg'],
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Film & TV Production Software' },
      { k: 'Role', v: 'Lead Designer (agency-based)' }
    ],
    body: [
      { h: 'Client overview' },
      { p: 'Moxion is a secure cloud-based platform trusted by major film and TV studios for real-time on-set collaboration. At the time of this project, Moxion was scaling rapidly and needed a complete overhaul of its marketing website to match its cutting-edge technology and stand out in an increasingly competitive production-tech landscape.' },
      { h: 'The needs' },
      { p: 'The existing website was no longer aligned with the brand’s evolution or user expectations. The mission was to redesign the site from the ground up to reflect Moxion’s leadership in innovation, security, and studio-grade workflows.' },
      { h: 'What changed' },
      { list: ['A modern, responsive website aligned with Moxion’s brand and product strengths', 'Complex technical features simplified into intuitive, easy-to-navigate flows for both operational and non-technical users', 'A flexible design foundation to support future marketing campaigns and content localisation'] }
    ]
  },

  {
    slug: 'kapili',
    types: ['web'],
    hidden: true,
    title: 'Kapili Roofing & Painting',
    year: '2023',
    category: 'Website',
    tagline: 'A website redesign repositioning solar roofing as a premium offering - improving clarity, trust, and conversion for high-value decisions.',
    location: 'Hawaii, US · Roofing & Solar',
    thumb: '/assets/img/work/kapili.jpg',
    cover: '/assets/img/work/kapili.jpg',
    coverClass: 'cover-full',
    gallery: ['/assets/img/work/kapili-2.jpg', '/assets/img/work/kapili-4.jpg', '/assets/img/work/kapili-9.jpg', '/assets/img/work/kapili-11.jpg', '/assets/img/work/kapili-13.jpg'],
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Roofing & Solar' },
      { k: 'Role', v: 'UI/UX Design Lead (agency-based)' }
    ],
    body: [
      { h: 'Client overview' },
      { p: 'Kapili Roofing & Painting provides roofing, painting, and solar solutions, helping homeowners invest in durable, storm-resistant upgrades suited for Hawaii’s climate.' },
      { p: 'Kapili required a website redesign to better position its solar roofing solution as a premium, future-focused offering - communicating the benefits more clearly, building trust, and supporting users in higher-consideration decisions.' },
      { h: 'The challenge' },
      { list: ['Reposition solar roofing as a premium, modern upgrade', 'Help customers understand a relatively complex product (roofing + solar) clearly', 'Improve project showcase and technical education', 'Reduce friction in the quote and enquiry process'] },
      { h: 'Solutions' },
      { list: ['Elevated visual direction to reflect high-end, future-ready solutions', 'Structured content to guide users from exploration → validation → enquiry', 'Introduced interactive tools (a pricing Calculator) to simplify quoting', 'Built an advanced gallery - images and video to showcase real projects', 'CMS + CRM integration - an end-to-end system for content, lead tracking, and follow-up'] }
    ]
  },

  {
    slug: 'kmart',
    types: ['brand', 'web', 'print', 'ads'],
    link: '/work/kmart/',
    featured: true,
    title: 'Kmart rebrand concept',
    category: 'Brand concept',
    tagline: 'A rebrand concept built around one idea: making low prices feel like a choice.',
    location: 'Auckland, NZ · Retail / eCommerce',
    thumb: '/assets/img/work/kmart/hero.webp',
    facts: [
      { k: 'Type', v: 'Concept project' },
      { k: 'Focus', v: 'Brand identity, website redesign, mobile UI, campaign design' },
      { k: 'Role', v: 'Visual design, UI design, brand direction' },
      { k: 'Industry', v: 'Retail / eCommerce' }
    ]
  },
  {
    slug: 'beehouse',
    types: ['web'],
    link: '/work/beehouse/',
    title: 'Beehouse',
    year: '2019',
    category: 'Website redesign',
    tagline: 'A website redesign for a real estate company in Vietnam, built to let its projects make the first impression.',
    thumb: '/assets/img/work/beehouse/hero.webp'
  },
  {
    slug: 'robarica',
    types: ['brand', 'print', 'ads'],
    link: '/work/robarica/',
    title: 'Robarica Coffee',
    category: 'Packaging design',
    tagline: 'Packaging and marketing images for a Vietnamese robusta coffee, sold mainly on Amazon in the US.',
    thumb: '/assets/img/work/robarica/hero.webp'
  },
  {
    slug: 'toi-o-tamaki',
    types: ['brand', 'print'],
    link: '/work/toi-o-tamaki/',
    title: 'Toi o Tāmaki typeface',
    category: 'Typeface design',
    tagline: 'A display typeface drawn from the columns, arches and kauri canopy of Auckland\'s Arts Precinct.',
    thumb: '/assets/img/work/toi-o-tamaki/hero.webp'
  }

];


/* ===================================================================
   Work types (the filters on /portfolio and the tiles on the homepage)
   =================================================================== */
window.WORK_TYPES = [
  { id: 'web',     label: 'Websites and landing pages' },
  { id: 'ads',     label: 'Ads and social' },
  { id: 'print',   label: 'Print and brochures' },
  { id: 'books',   label: 'Book covers' },
  { id: 'brand',   label: 'Brand identity' },
  { id: 'product', label: 'Apps and portals' }
];

/* ===================================================================
   Single pieces: smaller work shown as one image (or a few) in a
   lightbox, without a full case study page.
   - id, title, type (one of WORK_TYPES), label ('Client work',
     'Concept', 'Own product'), year
   - images  : first one is the card image, all show in the lightbox
   - caption : one or two sentences
   - fit     : 'contain' for covers and posters that must not be cropped
   - pos     : card crop position, e.g. 'center top'
   - link    : optional live link shown in the lightbox
   - prepare : marks a slot still to fill. Until the first image file
               exists, the card shows what to make. Export the file to
               that exact path and it turns into a normal card.
   SHOW_DRAFTS: set to false before launch to hide all unfilled slots.
   =================================================================== */
window.SHOW_DRAFTS = true;

/* SHOWCASE: while set, the homepage and the Work page show only these
   case studies, in this order, with no type tiles or filters (Oct 2026,
   portfolio for job applications). Set to null to bring back the full
   Work page with filters, pieces and homepage tiles. */
/* All six, two per row. Cohesive and Beehouse (both building websites) are kept
   apart: different rows, different columns. */
window.SHOWCASE = ['soundlax', 'cohesive-construction', 'robarica', 'kmart', 'beehouse', 'toi-o-tamaki'];
/* SHOWCASE_ALL: the unlisted page /portfolio/all (not in the nav), for
   roles where the visual work matters more. Same case studies plus
   Beehouse and Toi o Tāmaki, visual work first. */
window.SHOWCASE_ALL = ['robarica', 'kmart', 'beehouse', 'toi-o-tamaki', 'soundlax', 'cohesive-construction'];

window.PIECES = [
  {
    id: 'kmart-billboard', type: 'ads', label: 'Concept',
    title: 'Kmart outdoor poster',
    images: ['/assets/img/work/pieces/kmart-billboard.webp'],
    caption: 'An outdoor poster from my Kmart rebrand concept. The campaign line, “See more, own less”, builds on the idea of buying everyday things on a budget and spending the savings on experiences.'
  },
  {
    id: 'soundlax-app-store', type: 'ads', label: 'Own product', year: '2026',
    title: 'SoundLax App Store screenshots',
    images: ['/assets/img/work/pieces/soundlax-app-store.webp', '/assets/img/work/pieces/soundlax-app-store-collage.webp'],
    caption: 'App Store screenshots for my own app. Each one leads with a single reason to download rather than a list of features.',
    link: { text: 'See the App Store page', href: 'https://apps.apple.com/us/app/soundlax-focus-relax-sleep/id6764812942' }
  },
  {
    id: 'kmart-posters', type: 'ads', label: 'Concept',
    title: 'Kmart campaign posters', fit: 'contain',
    images: ['/assets/img/work/pieces/kmart-posters.webp'],
    caption: 'Two campaign posters from the same Kmart concept, written for the same “own less” idea.'
  },
  {
    id: 'soundlax-landing', type: 'web', label: 'Own product', year: '2026',
    title: 'SoundLax landing page', pos: 'center top',
    images: ['/assets/img/work/pieces/soundlax-landing.webp'],
    caption: 'The landing page for SoundLax, designed and built to send people to the App Store.',
    link: { text: 'Visit the page', href: '/soundlax-app' }
  },
  {
    id: 'kmart-identity', type: 'brand', label: 'Concept',
    title: 'Kmart logo and stationery', pos: 'center top',
    images: ['/assets/img/work/pieces/kmart-identity.webp'],
    caption: 'A simplified Kmart logo and the stationery set that goes with it, from my rebrand concept.'
  },
  {
    id: 'soundlax-brand', type: 'brand', label: 'Own product', year: '2026',
    title: 'SoundLax visual identity', pos: 'center top',
    images: ['/assets/img/work/pieces/soundlax-brand.webp'],
    caption: 'The SoundLax brand: vintage bird illustrations paired with bold colour, grain and a clean interface.',
    link: { text: 'Read the case study', href: '/work/soundlax/' }
  },

  /* ---------- slots to fill (shown only while SHOW_DRAFTS is true) ---------- */
  { id: 'book-cover-1', type: 'books', label: 'Concept', title: 'Book cover: thriller', fit: 'contain',
    images: ['/assets/img/work/pieces/book-cover-thriller.jpg'],
    prepare: 'A front cover for a thriller, 1600 × 2560 JPG (the KDP 1:1.6 ratio).' },
  { id: 'book-cover-2', type: 'books', label: 'Concept', title: 'Book cover: romance', fit: 'contain',
    images: ['/assets/img/work/pieces/book-cover-romance.jpg'],
    prepare: 'A front cover for a romance novel, 1600 × 2560 JPG.' },
  { id: 'book-cover-3', type: 'books', label: 'Concept', title: 'Book cover: non-fiction', fit: 'contain',
    images: ['/assets/img/work/pieces/book-cover-nonfiction.jpg'],
    prepare: 'A non-fiction cover, plus a second image of the full paperback wrap with spine and back cover.' },
  { id: 'brochure', type: 'print', label: 'Concept', title: 'Tri-fold brochure',
    images: ['/assets/img/work/pieces/brochure.jpg'],
    prepare: 'A tri-fold brochure for the concept local brand, shown as a print mockup. 1800 × 1350 JPG.' },
  { id: 'suzuki-content-offer', type: 'print', label: 'Client work', title: 'Suzuki NZ content offer PDF',
    images: ['/assets/img/work/pieces/suzuki-content-offer.jpg'],
    prepare: 'Pages from the Suzuki NZ content offer PDF (Avidly). Check you have permission to show it first.' },
  { id: 'ad-set', type: 'ads', label: 'Concept', title: 'Display ad set',
    images: ['/assets/img/work/pieces/ad-set.jpg'],
    prepare: 'One campaign in standard sizes (1080 × 1080, 1080 × 1920, 300 × 250, 728 × 90), laid out on one 1800 × 1350 board.' },
  { id: 'social-pack', type: 'ads', label: 'Concept', title: 'Social post pack',
    images: ['/assets/img/work/pieces/social-pack.jpg'],
    prepare: 'Six posts and three stories for the concept local brand, on one 1800 × 1350 board.' },
  { id: 'titan-it-landing', type: 'web', label: 'Client work', title: 'Titan IT landing pages',
    images: ['/assets/img/work/pieces/titan-it-landing.jpg'],
    prepare: 'The Titan IT landing pages from 2025, full-length page exports. 1800 wide JPG.' },
  { id: 'eftpos-landing', type: 'web', label: 'Client work', title: 'EFTPOS NZ landing page',
    images: ['/assets/img/work/pieces/eftpos-landing.jpg'],
    prepare: 'The EFTPOS NZ device launch landing page (Avidly). Check permission first.' },
  { id: 'local-brand-kit', type: 'brand', label: 'Concept', title: 'Local brand kit',
    images: ['/assets/img/work/pieces/local-brand-kit.jpg'],
    prepare: 'Logo, colours and type for the concept local brand (for example a Devonport bakery), on one 1800 × 1350 board.' }
];
