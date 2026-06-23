/* ===================================================================
   Bentoji Studio - portfolio data (single source of truth)
   Real projects, copy, thumbnails and screenshots from Ben's
   "BN Selected works | 2026" Figma case studies.
   To ADD a project: copy a block and edit.
   - thumb   : card image
   - gallery : screenshots shown on the detail page (native <img>)
   - body    : {h} heading, {p} paragraph, {list:[...]} bullet list
   =================================================================== */
window.PROJECTS = [
  {
    slug: 'soundlax',
    title: 'SoundLax',
    year: '2026',
    category: 'Product & App Design',
    tagline: 'An ambient sound app for focus, rest, and sleep - designed to ask for less of your attention.',
    thumb: '/assets/img/hero-bg.jpg',
    link: '/soundlax-app',
    external: false
  },

  {
    slug: 'cohesive-construction',
    title: 'Cohesive Construction',
    year: '2026',
    category: 'Website',
    tagline: 'A website redesign for a commercial and industrial construction company, built to improve credibility, project presentation and enquiry pathways.',
    location: 'South Island, NZ · Commercial & Industrial Construction',
    link: '/work/cohesive-construction/',
    thumb: '/assets/img/work/cohesive-construction-01.jpg',
    cover: '/assets/img/work/cohesive-construction-01.jpg',
    visit: 'https://cohesive.net.nz',
    facts: [
      { k: 'Discipline', v: 'Website UX/UI · IA · Figma handover' },
      { k: 'Sector', v: 'Commercial & Industrial Construction' },
      { k: 'Role', v: 'UX/UI Designer (agency collaboration)' }
    ],
    body: [
      { h: 'Overview' },
      { p: 'Cohesive Construction needed a website that better reflected the quality and scale of their work.' },
      { p: 'The business specialises in commercial and industrial builds, with a focus on premium commercial developments and owner-occupier or investment industrial projects across New Zealand, primarily in the South Island.' },
      { p: 'The existing website no longer gave the team enough flexibility to manage content in-house, and it did not fully show the calibre of their projects, clients, services or team.' },
      { p: 'We worked on the UX and UI design in collaboration with an agency based in Christchurch, helping shape the website structure, page templates and visual direction.' },
      { h: 'What we did' },
      { list: ['Website UX and UI design', 'Sitemap and information architecture', 'User persona planning', 'Wireframes', 'High-fidelity UI design', 'Developer handover in Figma'] },
      { h: 'The challenge' },
      { p: 'For Cohesive, the website was not only about generating enquiries. Many visitors arrive after a referral, after seeing a project in person, or after receiving information through Wide Span Sheds.' },
      { p: 'Their main goal is to validate credibility.' },
      { p: 'They want to know if Cohesive is established, experienced, capable of delivering high-end work, and trusted by reputable clients. The site needed to support that decision-making process quickly, without overwhelming smaller owner-occupiers or underwhelming larger commercial investors.' },
      { h: 'The approach' },
      { p: 'We structured the website around a practical validation journey: understand who Cohesive is, see proof through completed projects, explore relevant capabilities, download useful information, and get in touch when ready.' },
      { p: 'This shaped the key page templates, including the homepage, capabilities overview, capability detail pages, project listing, project detail pages, resources and contact pathways.' },
      { p: 'The design gives more weight to real project imagery, clear service messaging, award recognition, client proof and practical calls to action.' },
      { image: { src: '/assets/img/work/cohesive-construction-02.jpg', alt: 'Cohesive Construction project listing and completed work section' } },
      { h: 'Key UX decisions' },
      { list: ['Completed work became central to the website, with project pages designed to show visual proof, project details, key metrics, awards and related work.', 'The capabilities section was structured to explain what Cohesive handles across the process, from design and consent through to pricing, project management, safety, risk and delivery.', 'The site needed to work for both owner-occupiers and investors, balancing step-by-step reassurance with proof of scale, ROI, documentation and project experience.', 'Because some visitors arrive through Wide Span Sheds, the site needed a clear pathway to explain the connection and reassure users that Cohesive is the trusted construction partner.', 'Reusable templates for projects, capabilities, locations and resources gave the team a stronger foundation for future updates.'] },
      { h: 'Visual direction' },
      { p: 'The visual direction needed to feel confident, practical and established.' },
      { p: 'We used strong project photography, clear page sections, bold navy and yellow brand moments, and a structured layout system to create a professional construction website without making it feel too corporate or sterile.' },
      { image: { src: '/assets/img/work/cohesive-construction-03.jpg', alt: 'Cohesive Construction testimonial and capabilities design sections' } },
      { image: { src: '/assets/img/work/cohesive-construction-04.jpg', alt: 'Cohesive Construction leadership team page design' } },
      { image: { src: '/assets/img/work/cohesive-construction-05.jpg', alt: 'Cohesive Construction regional offices listing design' } },
      { p: 'The design balances credibility with warmth, using real work and clear content hierarchy rather than relying on generic marketing language.' },
      { h: 'Outcome' },
      { p: ['The redesigned website is now live at ', { text: 'cohesive.net.nz', href: 'https://cohesive.net.nz' }, '.'] },
      { p: 'The new site gives Cohesive Construction a clearer, more flexible and more credible digital presence. It better supports commercial and industrial clients, showcases completed work more effectively, and gives visitors clearer pathways to explore capabilities, download resources or contact the team.' },
      { h: 'Reflection' },
      { p: 'This project was a good reminder that trust is the main job of many B2B websites.' },
      { p: 'For Cohesive, the design needed to do more than look modern. It needed to help serious decision-makers understand the business, see proof of delivery and feel confident enough to start a conversation.' }
    ]
  },

  {
    slug: 'clearpoint',
    title: 'ClearPoint',
    year: '2025',
    category: 'Website',
    tagline: 'A technology consultancy website redesign focused on AI-powered, human-centred digital experiences.',
    location: 'Auckland, NZ · Tech & Innovation Consultancy',
    thumb: '/assets/img/work/clearpoint.jpg',
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
    title: 'Re-Leased',
    year: '2025',
    category: 'Website',
    tagline: 'A platform for commercial landlords, property managers, and tenants - streamlining lease, maintenance, compliance, and accounting with automation and AI-powered workflows.',
    location: 'NZ & Global · Commercial Property Management Software',
    thumb: '/assets/img/work/re-leased.jpg',
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
    title: 'Lannock / Strata Finance',
    year: '2025',
    category: 'Customer Portal',
    tagline: 'A customer portal for a finance platform - simplifying complex loan workflows, document management, and multi-user access.',
    location: 'New Zealand · Finance',
    thumb: '/assets/img/work/lannock.jpg',
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
    title: 'TEDxAuckland',
    year: '2024',
    category: 'Website',
    tagline: 'A website presenting speakers, ideas, and event information in a clear, engaging format - celebrating bold ideas from Aotearoa.',
    location: 'Auckland, NZ · Independent TED event',
    thumb: '/assets/img/work/tedxauckland.jpg',
    gallery: ['/assets/img/work/tedxauckland-1.jpg', '/assets/img/work/tedxauckland-3.jpg', '/assets/img/work/tedxauckland-4.jpg', '/assets/img/work/tedxauckland-5.jpg', '/assets/img/work/tedxauckland-6.jpg'],
    facts: [
      { k: 'Discipline', v: 'Website · UI/UX' },
      { k: 'Sector', v: 'Events / Media' },
      { k: 'Role', v: 'UX/UI Designer (Freelance)' }
    ],
    body: [
      { h: 'Client overview' },
      { p: 'In the spirit of ideas worth spreading, TEDx is a program of local, self-organised events that bring people together to share a TED-like experience. TEDTalks video and live speakers combine to spark deep discussion and connection.' },
      { h: 'The needs' },
      { p: 'The organisation needed a refreshed online presence to better reflect the energy of its events, a solution for online ticket booking, and a way to highlight speaker content to engage a diverse local audience.' },
      { h: 'Key decisions' },
      { list: ['Prioritising scannability over density - clear sections with strong hierarchy, short blocks instead of long paragraphs, and reusable content modules', 'Easier navigation across content - speakers, schedule and tickets are easy to find', 'A stronger focus on speakers, letting users explore content quickly without leaving the page', 'Multi-entry discovery paths - browse by speaker, topic, or previous talks rather than one forced journey'] }
    ]
  },

  {
    slug: 'autodesk-flow-capture',
    title: 'Autodesk Flow Capture',
    year: '2024',
    category: 'Website',
    tagline: 'A ground-up marketing site redesign for a cloud collaboration platform for film & TV production (formerly Moxion).',
    location: 'NZ & Global · Film & TV Production',
    thumb: '/assets/img/work/autodesk-flow-capture.jpg',
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
    title: 'Kapili Roofing & Painting',
    year: '2023',
    category: 'Website',
    tagline: 'A website redesign repositioning solar roofing as a premium offering - improving clarity, trust, and conversion for high-value decisions.',
    location: 'Hawaii, US · Roofing & Solar',
    thumb: '/assets/img/work/kapili.jpg',
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
  }
];
