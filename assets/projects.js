/* ===================================================================
   Bentoji Studio — portfolio data (single source of truth)
   Real projects + copy sourced from Ben's "BN Selected works | 2026" Figma.
   Card thumbnails currently use generated gradient art (themed per project).
   To use the real screenshots: drop images into /assets/img/work/<slug>.jpg
   and add  thumb: '/assets/img/work/<slug>.jpg'  to that project.
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
    thumb: '/assets/img/work/clearpoint.jpg',
    caseImage: '/assets/img/work/clearpoint-case.jpg',
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
    slug: 're-leased',
    title: 'Re-Leased',
    year: '2025',
    category: 'Website',
    tagline: 'A website for Re-Leased — a platform for commercial landlords, property managers, and tenants, streamlining lease, maintenance, compliance, and accounting with automation and AI-powered workflows.',
    location: 'NZ & Global · Commercial Property Management Software',
    thumb: '/assets/img/work/re-leased.jpg',
    caseImage: '/assets/img/work/re-leased-case.jpg',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Property Management Software' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A website for Re-Leased — a powerful platform for commercial landlords, property managers, and tenants, streamlining lease, maintenance, compliance, and accounting via automation and AI-powered workflows.' }
    ]
  },
  {
    slug: 'lannock',
    title: 'Lannock / Strata Finance',
    year: '2025',
    category: 'Customer Portal',
    tagline: 'A customer portal for a finance platform — simplifying complex loan workflows, document management, and multi-user access.',
    location: 'Auckland, NZ · Finance',
    thumb: '/assets/img/work/lannock.jpg',
    facts: [
      { k: 'Discipline', v: 'Product design · UX' },
      { k: 'Sector', v: 'Finance' },
      { k: 'Role', v: 'Product / UX Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A customer portal for a finance platform, designed to simplify complex loan workflows, document management, and multi-user access.' },
      { h: 'The problem' },
      { p: 'Strata managers need to manage multiple buildings, submit loan proposals, and handle large volumes of financial documents. Communication was fragmented across email, phone calls, and an outdated system; users lacked visibility into application status and next steps; and coordination between stakeholders was inconsistent and error-prone. Document-heavy workflows created confusion around actions and responsibilities, and financial-compliance constraints added complexity to every interaction.' },
      { h: 'What changed' },
      { p: 'A clear, intuitive UI now supports multiple user types (owners, managers, tenants). Complex financial and application processes became easier to manage, navigate, and understand, with clearer step-by-step flows and improved content hierarchy. Internal teams benefited from consistent data capture and reduced admin overhead, and document-heavy interactions were streamlined into guided journeys — improving usability for non-technical users.' }
    ]
  },
  {
    slug: 'tedxauckland',
    title: 'TEDxAuckland',
    year: '2024',
    category: 'Website',
    tagline: 'A website for TEDxAuckland presenting speakers, ideas, and event information in a clear, engaging format.',
    location: 'Auckland, NZ · Independent TED event',
    thumb: '/assets/img/work/tedxauckland.jpg',
    caseImage: '/assets/img/work/tedxauckland-case.jpg',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Events / Media' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A website designed for TEDxAuckland to present speakers, ideas, and event information in a clear, engaging format — celebrating bold ideas from Aotearoa.' }
    ]
  },
  {
    slug: 'autodesk-flow-capture',
    title: 'Autodesk Flow Capture',
    year: '2024',
    category: 'Website',
    tagline: 'A redesign for a cloud-based collaboration platform, making complex film & TV production workflows clearer in real-time environments (formerly Moxion).',
    location: 'NZ & Global · Film & TV Production',
    thumb: '/assets/img/work/autodesk-flow-capture.jpg',
    caseImage: '/assets/img/work/autodesk-flow-capture-case.jpg',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Film & TV Production Software' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A redesign for a cloud-based collaboration platform (formerly Moxion, now Autodesk Flow Capture), focused on making complex production workflows clearer and easier to navigate in real-time environments.' }
    ]
  },
  {
    slug: 'kapili',
    title: 'Kapili Roofing & Painting',
    year: '2023',
    category: 'Website',
    tagline: 'A website redesign repositioning solar roofing as a premium offering — improving clarity, trust, and conversion for high-value decisions.',
    location: 'Hawaii, US · Roofing & Solar',
    thumb: '/assets/img/work/kapili.jpg',
    caseImage: '/assets/img/work/kapili-case.jpg',
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Roofing & Solar' },
      { k: 'Role', v: 'Designer' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'A website redesign focused on repositioning solar roofing as a premium offering, improving clarity, trust, and conversion for high-value decisions.' }
    ]
  }
];
