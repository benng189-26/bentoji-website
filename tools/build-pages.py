#!/usr/bin/env python3
"""
Builds the static pages that share the homepage look (nav, footer, head).
Run from the repo root:  python3 tools/build-pages.py
Edit the copy in this file, then run it again. The homepage (index.html),
the case study shells and the SoundLax landing page are not built here.
"""
import os

V = {'site': 47, 'home': 5, 'pages': 3, 'case': 6, 'projects': 19, 'portfolio': 1, 'sitejs': 35, 'casejs': 6}
EMAIL = 'ben.ng189@gmail.com'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
NAV = [('Work', '/portfolio'), ('Pricing', '/pricing'), ('SoundLax', '/soundlax-app'), ('Writing', '/writing'), ('Contact', '/contact')]


def head(title, desc, canonical, extra_css=()):
    css = ''.join('<link rel="stylesheet" href="/assets/%s.css?v=%d" />\n' % (c, V[c]) for c in ('site', 'home', 'pages') + tuple(extra_css))
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<link rel="canonical" href="https://bentoji.co.nz{canonical}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:image" content="https://bentoji.co.nz/assets/img/app-icon.png" />
<link rel="icon" href="/assets/img/app-icon.png" sizes="any" />
<script>document.documentElement.classList.add('js');</script>
<link rel="preload" href="/assets/type/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/type/darker-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin />
{css}<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
</head>
'''


def nav(current):
    links = ''.join('      <a href="%s"%s>%s</a>\n' % (h, ' aria-current="page"' if h == current else '', t) for t, h in NAV)
    mob = ''.join('  <a href="%s">%s</a>\n' % (h, t) for t, h in NAV)
    return f'''<header class="site-nav">
  <div class="container nav-inner">
    <a class="brand" href="/" aria-label="Bentoji home"><img src="/assets/img/bentoji-logo.svg" alt="Bentoji" /></a>
    <nav class="nav-links" aria-label="Primary">
{links}      <a class="btn btn-ghost nav-cta" href="/contact">Let's talk</a>
    </nav>
    <button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu">
{mob}  <a class="btn btn-light" href="/contact">Let's talk</a>
</div>
'''


CLOSE = f'''<section class="h-section h-grey h-close">
  <div class="container">
    <h2 class="h-head h-title">Got something in mind?</h2>
    <p class="h-lead">Tell me what you're working on. The first call is free, and you'll get a straight answer on time and cost.</p>
    <div class="h-actions">
      <a class="h-btn h-btn-dark" href="/contact">Book a free call</a>
    </div>
    <p class="h-small">or email <a href="mailto:{EMAIL}">{EMAIL}</a></p>
  </div>
</section>
'''

FOOTER = f'''<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="Bentoji home"><img src="/assets/img/bentoji-logo.svg" alt="Bentoji" /></a>
        <p data-cms="footer.blurb">Bentoji is the design practice of Ben Nguyen, a designer in Auckland working on websites, apps and brands.</p>
      </div>
      <div class="footer-col">
        <h5>Explore</h5>
        <a href="/portfolio">Work</a>
        <a href="/pricing">Pricing</a>
        <a href="/soundlax-app">SoundLax app</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="footer-col">
        <h5>Connect</h5>
        <a href="mailto:{EMAIL}">{EMAIL}</a>
        <a href="/contact">Book a free call</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Bentoji. All rights reserved.</span>
      <span>Made in Aotearoa New Zealand</span>
    </div>
  </div>
</footer>
'''


def scripts(*names):
    m = {'projects': '/assets/projects.js?v=%d' % V['projects'], 'site': '/assets/site.js?v=%d' % V['sitejs'],
         'portfolio': '/assets/portfolio.js?v=%d' % V['portfolio'], 'case': '/assets/case.js?v=%d' % V['casejs']}
    return ''.join('<script src="%s"></script>\n' % m[n] for n in names)


def hero(pill, title, lead, extra='', back=None):
    b = f'<a class="p-back" href="{back[1]}">{BACK}{back[0]}</a><br>\n    ' if back else ''
    return f'''<section class="h-dark p-hero">
  <div class="container">
    {b}<p class="h-pill">{pill}</p>
    <h1 class="h-head">{title}</h1>
    <p class="h-lead">{lead}</p>
    {extra}
  </div>
</section>
'''


def todo(t):
    return f'<span class="p-todo">{t}</span>'


def page(path, title, desc, current, body, js=('site',), body_attr='', extra_css=()):
    html = head(title, desc, '/' + path.replace('index.html', '').rstrip('/'), extra_css) + \
        f'<body class="home"{body_attr}>\n\n' + nav(current) + '\n<main>\n' + body + '</main>\n\n' + FOOTER + '\n' + scripts(*js) + '</body>\n</html>\n'
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    open(path, 'w').write(html)
    print('built', path)


def plan_cards(btn_class='h-btn-primary'):
    plans = [
        ('Design Light', 'For occasional help, a few tasks each month.', 'NZ$750', 'Up to 5 hours a month',
         ['One active request at a time', 'Website updates and graphics', 'Basic brand support', 'Simple layouts and documents', 'One month of rollover on unused hours'],
         'Good for small businesses, consultants and local services.', False),
        ('Design Care', 'Regular support across website, marketing, brand and content.', 'NZ$1,500', 'Up to 10 hours a month',
         ['One active request at a time', 'Website, marketing, UX/UI and presentations', 'Design QA and feedback', 'Priority over hourly work', 'One month of rollover on unused hours'],
         'Good for growing businesses, startups and small marketing teams.', True),
        ('Design Partner', 'Ongoing work across several areas of your business.', 'NZ$2,800', 'Up to 20 hours a month',
         ['Two active requests at a time', 'Website, product, brand and campaigns', 'A monthly planning call', 'Design input and priority support', 'One month of rollover on unused hours'],
         'Good for agencies, funded startups and active marketing teams.', False),
    ]
    out = '<div class="p-plans">\n'
    for name, desc, price, hours, feats, good, featured in plans:
        lis = ''.join(f'<li>{f}</li>' for f in feats)
        tag = '<span class="p-plan-tag">Most popular</span>' if featured else ''
        out += f'''  <div class="p-plan{' is-featured' if featured else ''}">{tag}
    <h3>{name}</h3>
    <p class="p-plan-desc">{desc}</p>
    <p class="p-price">{price}<small>/ month</small></p>
    <p class="p-price-note">{hours}</p>
    <ul>{lis}</ul>
    <p class="p-price-note">{good}</p>
    <a class="h-btn {btn_class}" href="/contact?service=monthly">Ask about {name}</a>
  </div>
'''
    return out + '</div>\n'


# ---------------------------------------------------------------- Work
page('portfolio/index.html',
     'Work | Bentoji, Ben Nguyen',
     'Websites, landing pages, ads, print, brand and apps designed by Ben Nguyen in Auckland. Filter by the type of work you need.',
     '/portfolio',
     hero('Work', 'Websites, ads, print and apps',
          'Client projects, concept pieces and my own products. Use the filters to see one type of work at a time.') +
     '''<section class="h-section h-dark" style="padding-top:0">
  <div class="container">
    <div data-work-index></div>
  </div>
</section>
''' + CLOSE,
     js=('projects', 'site', 'portfolio'))

# ---------------------------------------------------------------- Pricing
small_jobs = [
    ('Landing page', 'One page designed for desktop and mobile, ready for your developer or website builder.'),
    ('Ad set', 'One campaign in up to five standard sizes for social and display ads.'),
    ('Brochure or flyer', 'A print-ready file with bleed, for a tri-fold, A5 or A4 layout.'),
    ('Book cover', 'A front cover for an ebook, or a full paperback wrap with spine and back cover for Amazon KDP.'),
    ('Social post pack', 'Six posts and three stories in your brand, with editable templates.'),
    ('Logo and brand starter', 'A logo, colours and type, ready to use in print and on screen.'),
]
rows = ''.join(f'''  <div class="p-row"><h3>{n}</h3><p>{d}</p><span class="p-row-price">From NZ$ {todo('set price')}</span></div>
''' for n, d in small_jobs)
projects = [
    ('Small business website', 'A complete website, from the homepage through to services and contact. Three to six pages, designed for mobile first and set up in your CMS or handed to your developer.'),
    ('Website redesign', 'A new structure and design for an existing site, starting with what your visitors need to find and what is getting in their way.'),
    ('Product design sprint', 'Focused UX and UI work on one part of an app or customer portal: user flows, wireframes and final screens, ready for development.'),
    ('Brand identity', 'A logo, colour and type system and a starter set of brand assets, for a new business or one that has outgrown its current look.'),
]
prow = ''.join(f'''  <div class="p-row"><h3>{n}</h3><p>{d}</p><span class="p-row-price">Quoted after a call</span></div>
''' for n, d in projects)
page('pricing/index.html',
     'Pricing | Bentoji, Ben Nguyen',
     'Fixed prices for small design jobs, monthly design plans from NZ$750, and projects quoted after a free call.',
     '/pricing',
     hero('Pricing', 'Ways to work together',
          'A fixed price for small jobs, a designer every month, or a project quoted after a free call.',
          '<nav class="p-jump" aria-label="On this page"><a href="#small-jobs">Small jobs</a><a href="#monthly">Monthly design</a><a href="#projects">Projects</a><a href="#hourly">Hourly</a></nav>') +
     f'''<section class="h-section h-grey" id="small-jobs">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">01</span> Small jobs</p>
    <h2 class="h-head p-section-title">Fixed price, quick turnaround</h2>
    <p class="p-intro">For one piece of work with a clear brief. You will know the price before I start, so there are no surprises.</p>
    <div class="p-rows">
{rows}    </div>
    <div class="h-actions"><a class="h-btn h-btn-primary" href="/contact?service=small-job">Ask about a small job</a><a class="h-btn h-btn-ghost" href="/portfolio">See examples</a></div>
  </div>
</section>

<section class="h-section h-dark" id="monthly">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">02</span> Monthly design</p>
    <h2 class="h-head p-section-title">A designer every month</h2>
    <p class="p-intro">For businesses that need regular design help but not a full-time hire. Send requests as they come up, and I work through them one at a time. You can cancel at any time.</p>
{plan_cards()}    <div class="h-actions"><a class="h-link" href="/pricing/monthly">How monthly design works {ARROW}</a></div>
  </div>
</section>

<section class="h-section h-grey" id="projects">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">03</span> Projects</p>
    <h2 class="h-head p-section-title">Bigger work, quoted after a call</h2>
    <p class="p-intro">Every project is scoped on its own, because no two briefs are the same. We start with a free call, and I send a clear proposal with the timeline, what is included and the price.</p>
    <div class="p-rows">
{prow}    </div>
    <div class="h-actions"><a class="h-btn h-btn-primary" href="/contact?service=project">Book a free call</a></div>
  </div>
</section>

<section class="h-section h-dark" id="hourly">
  <div class="container p-split">
    <div>
      <p class="h-pill"><span class="c-pill-num">04</span> Hourly</p>
      <h2 class="h-head p-section-title">Pay as you go</h2>
      <p class="p-intro">For one-off tasks, design reviews, quick consultations or overflow work, where a project or monthly plan is not the right fit. I always share a rough estimate before starting and invoice on the hours tracked.</p>
    </div>
    <div class="p-plan">
      <h3>Hourly</h3>
      <p class="p-price">NZ$95<small>/ hour</small></p>
      <p class="p-price-note">Estimate shared before any work starts.</p>
      <a class="h-btn h-btn-primary" href="/contact?service=hourly">Get in touch</a>
    </div>
  </div>
</section>
''' + CLOSE)

# ---------------------------------------------------------------- Monthly
uses = [
    ('Website updates', ['New sections or page layouts', 'Homepage hero redesigns', 'Design QA and feedback', 'Notes for your developer']),
    ('Marketing graphics', ['Social and LinkedIn graphics', 'Campaign and ad creative', 'Email headers and banners', 'Event and announcement visuals']),
    ('Presentations', ['Slide polish and layout', 'Pitch deck sections', 'Charts and diagrams', 'Slide templates']),
    ('Brand support', ['Applying your brand to new material', 'Templates and asset preparation', 'Logo lockups and icon sets', 'Consistent layouts across documents']),
    ('UX and UI', ['One app screen or component', 'Form and flow improvements', 'Figma notes for developers', 'Design QA on live pages']),
    ('Documents and print', ['Flyers and PDF layouts', 'Price sheets and menus', 'Service guides and case studies', 'Client-facing templates']),
]
use_html = '<div class="p-list-grid">\n' + ''.join(
    f'  <div class="p-list"><h3>{t}</h3><ul>{"".join("<li>%s</li>" % i for i in items)}</ul></div>\n' for t, items in uses) + '</div>\n'
not_inc = ['A full website or brand redesign', 'A full app or product design from scratch', 'In-depth UX research', 'Large pitch decks from scratch',
           'Custom development', 'Advanced animation or video', 'Print management', 'Hosting, domains or software licences', 'Same-day work, unless agreed']
ni_html = '<div class="p-list"><ul>' + ''.join(f'<li>{i}</li>' for i in not_inc) + '</ul></div>'
steps = [('Choose a plan', 'Pick the plan that matches how much design work you usually have.'),
         ('Send a request', 'Send it by email, Notion, Trello or a form, with what you need, any content or references, and a deadline if there is one.'),
         ('I get to work', 'I work on one request at a time. When it is done or waiting on your feedback, I move to the next one in your queue.'),
         ('Review and refine', 'Reasonable revisions are included within your monthly hours.'),
         ('Keep going', 'Unused hours roll over for one month. Cancel before the next billing cycle if you need to stop.')]
steps_html = '<div class="p-steps">\n' + ''.join(f'  <div class="p-step"><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></div>\n' for i, (t, d) in enumerate(steps)) + '</div>\n'
faq = [
    ('Is this unlimited design?', 'No. Each plan has a set number of hours. You can send requests whenever you need to, and I work through them one at a time within your monthly hours. This keeps the work focused and fair.'),
    ('What does "one active request at a time" mean?', 'I focus on one task at a time. If you send several requests, we agree on the priority and I work through them in order. When the first task is done or waiting on your feedback, I move to the next.'),
    ('Can unused hours roll over?', 'Yes. Unused hours roll over for one month while your plan is active. They do not build up beyond that, and they expire if the plan is cancelled.'),
    ('Can I cancel at any time?', 'Yes. Cancel before the next billing cycle and you will not be charged again. There are no long contracts.'),
    ('What if a task is bigger than my plan?', 'I will tell you before starting. A larger task can use more of your monthly hours, be split across months, or be quoted as a separate project.'),
    ('What makes a good request?', 'What you need, why you need it, where it will be used, any content or images, brand files, the format or size, and a deadline if there is one. The clearer the brief, the faster I can deliver.'),
    ('Can you work alongside our team?', 'Yes. Monthly design works well alongside founders, marketers, developers and agencies. I can prepare files, give feedback, mark up issues and create assets that fit your existing workflow.'),
    ('How do we get started?', 'Send a short message about your business and the kind of design help you need each month. I will recommend a plan, or suggest a better option if a plan is not the right fit.'),
]
faq_html = '<div class="p-faq">\n' + ''.join(f'  <details><summary>{q}</summary><p>{a}</p></details>\n' for q, a in faq) + '</div>\n'
page('pricing/monthly/index.html',
     'Monthly design | Bentoji, Ben Nguyen',
     'A designer every month for NZ small businesses and teams. Plans from NZ$750 a month, one request at a time, cancel at any time.',
     '/pricing',
     hero('Monthly design', 'A designer every month',
          'For businesses that need regular design help, but not enough to hire someone full time.',
          f'<div class="h-actions"><a class="h-btn h-btn-primary" href="/contact?service=monthly">Book a free call</a><a class="h-btn h-btn-ghost" href="#plans">See the plans</a></div>',
          back=('Pricing', '/pricing')) +
     f'''<section class="h-section h-grey">
  <div class="container p-split">
    <div>
      <p class="h-pill"><span class="c-pill-num">01</span> Who it's for</p>
      <h2 class="h-head p-section-title">Regular design work, without a full-time hire</h2>
      <p class="p-intro">Monthly design is for businesses and teams with a steady stream of design work, but not enough to justify a designer on staff. You send requests as they come up, and I work through them one at a time. There are no project kick-offs or long scoping documents.</p>
    </div>
    <div>
      <p class="p-quote">"We need a designer for this, but it's not big enough to start a full project."</p>
      <p class="p-intro" style="margin-top:16px">If you say this often, this plan is for you.</p>
    </div>
  </div>
</section>

<section class="h-section h-dark">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">02</span> What it covers</p>
    <h2 class="h-head p-section-title">Small and medium tasks with a clear brief</h2>
{use_html}  </div>
</section>

<section class="h-section h-grey">
  <div class="container p-split">
    <div>
      <p class="h-pill"><span class="c-pill-num">03</span> Not included</p>
      <h2 class="h-head p-section-title">Better quoted as a project</h2>
      <p class="p-intro">Monthly design does not replace a full project. These are scoped separately.</p>
    </div>
    {ni_html}
  </div>
</section>

<section class="h-section h-dark">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">04</span> How it works</p>
    <h2 class="h-head p-section-title">Five steps, then it runs on its own</h2>
{steps_html}  </div>
</section>

<section class="h-section h-grey" id="plans">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">05</span> Plans</p>
    <h2 class="h-head p-section-title">Three plans, cancel at any time</h2>
    <p class="p-intro">Every plan includes one month of rollover on unused hours.</p>
{plan_cards()}  </div>
</section>

<section class="h-section h-dark">
  <div class="container">
    <p class="h-pill"><span class="c-pill-num">06</span> Questions</p>
    <h2 class="h-head p-section-title">Common questions</h2>
{faq_html}  </div>
</section>
''' + CLOSE)

# ---------------------------------------------------------------- Contact
page('contact/index.html',
     'Contact | Bentoji, Ben Nguyen',
     'Get in touch with Ben Nguyen about a small design job, monthly design support or a project. The first call is free.',
     '/contact',
     hero('Contact', '<span data-cms="hero.title">Let\'s talk</span>',
          '<span data-cms="hero.lead">Tell me a little about what you need and when you need it. I read every message and usually reply within one or two working days.</span>') +
     f'''<section class="h-section h-grey">
  <div class="container p-split">
    <form class="p-form" data-web3form novalidate>
      <input type="hidden" name="access_key" value="4af5bed8-bb14-4317-a9e7-d52b2387b2c3" />
      <input type="hidden" name="subject" value="New enquiry from bentoji.co.nz" />
      <input type="hidden" name="from_name" value="Bentoji.co.nz contact form" />
      <input type="hidden" name="cc" value="{EMAIL}" />
      <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" />
      <div class="form-row">
        <div><label for="name">Name <span class="req">*</span></label><input id="name" name="name" type="text" placeholder="Your name" required /></div>
        <div><label for="email">Email <span class="req">*</span></label><input id="email" name="email" type="email" placeholder="you@email.com" required /></div>
      </div>
      <div class="form-row">
        <div><label for="company">Company or project</label><input id="company" name="company" type="text" placeholder="Optional" /></div>
        <div><label for="service">What do you need?</label>
          <select id="service" name="service">
            <option value="">Choose one</option>
            <option value="small-job">A small job (landing page, ads, brochure, cover)</option>
            <option value="monthly">Monthly design</option>
            <option value="project">A project (website, app, brand)</option>
            <option value="hourly">Hourly help</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>
      </div>
      <div><label for="message">Message <span class="req">*</span></label><textarea id="message" name="message" rows="6" placeholder="What would you like to make, and when do you need it?" required></textarea></div>
      <button type="submit" class="h-btn h-btn-primary">Send message</button>
      <p class="form-note" aria-live="polite"></p>
    </form>
    <dl class="p-details">
      <div><dt>Email</dt><dd><a href="mailto:{EMAIL}" data-cms="details.email">{EMAIL}</a></dd></div>
      <div><dt>Based in</dt><dd data-cms="details.studio">Auckland, New Zealand, working with clients in New Zealand and Australia</dd></div>
      <div><dt>What I take on</dt><dd data-cms="details.takeOn">Websites and landing pages, ads and social, print and brochures, book covers, brand identity, apps and portals.</dd></div>
      <div><dt>Response time</dt><dd data-cms="details.response">Usually within one or two working days.</dd></div>
    </dl>
  </div>
</section>
<script>
  (function () {{
    var s = new URLSearchParams(location.search).get('service');
    var el = document.getElementById('service');
    if (s && el && el.querySelector('option[value="' + s + '"]')) el.value = s;
  }})();
</script>
''',
     body_attr=' data-content="/content/contact.json"')

# ---------------------------------------------------------------- Writing
page('writing/index.html',
     'Writing | Bentoji, Ben Nguyen',
     'Notes on design, building my own apps and working with small businesses. Coming soon.',
     '/writing',
     hero('Writing', 'Notes, soon',
          'I am putting together short pieces on design, building my own apps and working with small businesses. In the meantime, the work is the best place to look.',
          f'<div class="h-actions"><a class="h-btn h-btn-primary" href="/portfolio">See the work</a><a class="h-btn h-btn-ghost" href="/contact">Get in touch</a></div>'))

# ---------------------------------------------------------------- Older project pages (rendered by case.js from projects.js)
for path, title in [('work/index.html', 'Project | Bentoji, Ben Nguyen'),
                    ('work/cohesive-construction/index.html', 'Cohesive Construction website | Bentoji, Ben Nguyen'),
                    ('work/kmart/index.html', 'Kmart brand and website concept | Bentoji, Ben Nguyen')]:
    html = head(title, 'A design project by Ben Nguyen, Auckland.', '/' + path.replace('index.html', '').rstrip('/'), ('case',)) + \
        '<body class="home case">\n\n' + nav('/portfolio') + \
        '\n<main data-case-project>\n  <section class="h-dark c-hero"><div class="container"><p class="h-lead">Loading…</p></div></section>\n</main>\n\n' + \
        CLOSE + '\n' + FOOTER + '\n' + scripts('projects', 'site', 'case') + '</body>\n</html>\n'
    open(path, 'w').write(html)
    print('built', path)

# ---------------------------------------------------------------- Access gate
gate = head('Bentoji', 'Private preview.', '/access') + '''<body class="home">
<main class="p-gate">
  <div class="p-gate-box">
    <a class="brand" href="/access/" aria-label="Bentoji"><img src="/assets/img/bentoji-logo.svg" alt="Bentoji" /></a>
    <h1>Private preview</h1>
    <p>This site is still being finished. Enter the password to continue.</p>
    <form id="gf" autocomplete="off">
      <input class="gate-input" type="password" id="pw" placeholder="Password" autocomplete="current-password" aria-label="Password" />
      <button class="h-btn h-btn-primary" type="submit">Continue</button>
      <p class="p-gate-err" id="err">That password didn't work. Try again.</p>
    </form>
  </div>
</main>
<script>
  document.getElementById('gf').addEventListener('submit', function (e) {
    e.preventDefault();
    var pw = document.getElementById('pw').value;
    if (pw === 'bentoji26') {
      sessionStorage.setItem('bentoji_ok', '1');
      var ret = sessionStorage.getItem('bentoji_ret') || '/';
      sessionStorage.removeItem('bentoji_ret');
      location.replace(ret);
    } else {
      document.getElementById('err').style.display = 'block';
      document.getElementById('pw').value = '';
      document.getElementById('pw').focus();
    }
  });
  if (sessionStorage.getItem('bentoji_ok')) {
    location.replace(sessionStorage.getItem('bentoji_ret') || '/');
  }
</script>
</body>
</html>
'''
open('access/index.html', 'w').write(gate)
print('built access/index.html')
