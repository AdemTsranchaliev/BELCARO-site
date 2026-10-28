/**
 * Sitemap + per-route HTML so crawlers get a unique title, description,
 * canonical URL and JSON-LD before Angular boots.
 *
 *   node scripts/seo-build.js sitemap
 *   node scripts/seo-build.js prerender
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://belcaro.bg';
const ROOT = path.join(__dirname, '..');
const PRODUCTS_PATH = path.join(ROOT, 'src/assets/data/products.json');
const DIST = path.join(ROOT, 'dist/belcaro-site');

const LABELS = {
  sofas: 'Дивани',
  armchair: 'Фотьойли',
  chairs: 'Столове',
  beds: 'Спални',
  tables: 'Маси',
};

const HOME = {
  title: 'Belcaro — луксозна мека мебел и интериор в София',
  description:
    'Belcaro произвежда луксозна мека мебел в София: дивани, фотьойли, спални и маси по поръчка. Шоурум в Казичене.',
};

const PAGES = {
  '/catalog': {
    title: 'Каталог — дивани, фотьойли, спални и маси',
    description:
      'Каталог Belcaro: дивани, фотьойли, столове, спални и маси. Ръчна изработка и шоурум в Казичене, София.',
    crumb: 'Каталог',
    heading: 'Каталог',
  },
  '/about': {
    title: 'За Belcaro — мебели от 1995',
    description:
      'Belcaro произвежда луксозна мека мебел от 1995 г. Ателие в София, подбрани материи и мебели по мярка на интериора.',
    type: 'AboutPage',
    crumb: 'За нас',
    heading: 'Ние сме Belcaro',
  },
  '/contact': {
    title: 'Контакти и шоурум в София',
    description:
      'Шоурум Belcaro в Казичене, ул. Царски парк 4, и магазин на бул. Ботевградско шосе 268. Тел. 0899 908 588.',
    type: 'ContactPage',
    crumb: 'Контакти',
    heading: 'Контакти',
  },
  '/projects': {
    title: 'Проекти и интериори',
    description:
      'Реализирани интериори с мека мебел Belcaro — частни домове и обществени пространства.',
    crumb: 'Проекти',
    heading: 'Проекти',
  },
};

function labelOf(category) {
  const key = String(category || '').trim().toLowerCase();
  return LABELS[key] || category || '';
}

function clamp(text, max = 158) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const last = cut.lastIndexOf(' ');
  return `${(last > 80 ? cut.slice(0, last) : cut).replace(/[.,;:\s]+$/, '')}…`;
}

function formatTitle(pageTitle) {
  if (pageTitle.toLowerCase().includes('belcaro')) return pageTitle;
  return `${pageTitle} | Belcaro`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function xml(value) {
  return escapeHtml(value);
}

function absolute(urlPath) {
  if (!urlPath || urlPath === '/') return `${SITE}/`;
  return `${SITE}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`;
}

function productDescription(product) {
  const kind = String(labelOf(product.Category) || 'мека мебел').toLocaleLowerCase('bg');
  const body = String(product.Description || '').replace(/\s+/g, ' ').trim();
  const text = body
    ? `${product.Name} — ${kind} Belcaro. ${body} Шоурум в Казичене.`
    : `${product.Name} — ${kind}. Ръчна изработка Belcaro, шоурум в Казичене, София.`;
  return clamp(text);
}

function productImages(product) {
  const count = Math.max(Number(product.ImageCount) || 1, 1);
  const base = String(product.Image || product.Id || '').toLowerCase();
  return Array.from({ length: count }, (_, index) =>
    absolute(`/assets/images/products/${base}.${index + 1}.webp`)
  );
}

function loadProducts() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));
  const seen = new Set();
  return products.filter((product) => {
    const id = String(product.Id || '').trim();
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function breadcrumbLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

function writeSitemap(products) {
  const lastmod = fs.statSync(PRODUCTS_PATH).mtime.toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE}/`, priority: '1.0' },
    { loc: `${SITE}/catalog`, priority: '0.9' },
    ...Object.keys(LABELS).map((slug) => ({
      loc: `${SITE}/catalog/${slug}`,
      priority: '0.8',
    })),
    { loc: `${SITE}/about`, priority: '0.6' },
    { loc: `${SITE}/contact`, priority: '0.6' },
    { loc: `${SITE}/projects`, priority: '0.6' },
    ...products.map((product) => ({
      loc: `${SITE}/details/${encodeURIComponent(product.Id)}`,
      priority: '0.7',
      images: productImages(product).map((loc) => ({ loc, title: product.Name })),
    })),
  ];

  const body = urls
    .map((url) => {
      const images = (url.images || [])
        .map(
          (image) =>
            `    <image:image>\n      <image:loc>${xml(image.loc)}</image:loc>\n      <image:title>${xml(image.title)}</image:title>\n    </image:image>`
        )
        .join('\n');
      return [
        '  <url>',
        `    <loc>${xml(url.loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <priority>${url.priority}</priority>`,
        images,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xmlDoc = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

  const targets = [path.join(ROOT, 'src/sitemap.xml')];
  if (fs.existsSync(DIST)) {
    targets.push(path.join(DIST, 'sitemap.xml'));
  }
  targets.forEach((target) => fs.writeFileSync(target, xmlDoc));
  console.log(`sitemap: ${urls.length} urls`);
}

function upsertTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  }
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertMetaName(html, name, content) {
  const tag = `<meta name="${name}" content="${escapeHtml(content)}">`;
  const re = new RegExp(`<meta\\s+name="${name}"[^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertMetaProperty(html, property, content) {
  const tag = `<meta property="${property}" content="${escapeHtml(content)}">`;
  const re = new RegExp(`<meta\\s+property="${property}"[^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}">`;
  const re = /<link\s+rel="canonical"[^>]*>/i;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function upsertJsonLd(html, id, data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  const tag = `<script type="application/ld+json" id="${id}">${json}</script>`;
  const re = new RegExp(`<script[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/script>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `${tag}\n</head>`);
}

function removeJsonLd(html, id) {
  const re = new RegExp(`\\s*<script[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/script>`, 'i');
  return html.replace(re, '');
}

function renderHead(shell, page) {
  const title = formatTitle(page.title);
  const description = clamp(page.description);
  const canonical = absolute(page.path);
  const image = page.image || absolute('/assets/images/slider/furniture_slide3.jpg');
  const imageAlt = page.imageAlt || 'Belcaro';
  let html = shell;
  html = upsertTitle(html, title);
  html = upsertMetaName(html, 'description', description);
  html = upsertMetaName(
    html,
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );
  html = upsertCanonical(html, canonical);
  html = upsertMetaProperty(html, 'og:type', page.ogType || 'website');
  html = upsertMetaProperty(html, 'og:title', title);
  html = upsertMetaProperty(html, 'og:description', description);
  html = upsertMetaProperty(html, 'og:url', canonical);
  html = upsertMetaProperty(html, 'og:image', image);
  html = upsertMetaProperty(html, 'og:image:secure_url', image);
  html = upsertMetaProperty(html, 'og:image:alt', imageAlt);
  html = upsertMetaName(html, 'twitter:card', 'summary_large_image');
  html = upsertMetaName(html, 'twitter:title', title);
  html = upsertMetaName(html, 'twitter:description', description);
  html = upsertMetaName(html, 'twitter:image', image);
  html = upsertMetaName(html, 'twitter:image:alt', imageAlt);
  html = upsertJsonLd(html, 'seo-page-jsonld', page.jsonLd);
  if (page.breadcrumbs) {
    html = upsertJsonLd(html, 'seo-breadcrumb-jsonld', breadcrumbLd(page.breadcrumbs));
  } else {
    html = removeJsonLd(html, 'seo-breadcrumb-jsonld');
  }

  const fallback = `<noscript><main>${page.fallback}</main></noscript>`;
  if (html.includes('<noscript><main>')) {
    html = html.replace(/<noscript><main>[\s\S]*?<\/main><\/noscript>/, fallback);
  } else {
    html = html.replace('</body>', `${fallback}\n</body>`);
  }
  return html;
}

function listFallback(items) {
  return `<ul>${items
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a></li>`)
    .join('')}</ul>`;
}

function buildPages(products) {
  const categories = Object.keys(LABELS).map((slug) => ({
    href: `/catalog/${slug}`,
    name: LABELS[slug],
  }));

  const homeFallback = `<h1>Мебели за проекта.</h1><p>${escapeHtml(HOME.description)}</p>${listFallback([
    { href: '/catalog', name: 'Каталог' },
    ...categories,
    { href: '/about', name: 'За нас' },
    { href: '/contact', name: 'Контакти' },
    { href: '/projects', name: 'Проекти' },
  ])}`;

  const pages = [
    {
      path: '/',
      title: HOME.title,
      description: HOME.description,
      imageAlt: 'Дневна с мека мебел Belcaro',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: HOME.title,
        description: HOME.description,
        url: `${SITE}/`,
        inLanguage: 'bg',
        isPartOf: { '@id': `${SITE}/#website` },
      },
      fallback: homeFallback,
    },
  ];

  Object.entries(PAGES).forEach(([urlPath, page]) => {
    const listed =
      urlPath === '/catalog'
        ? products
        : [];
    pages.push({
      path: urlPath,
      title: page.title,
      description: page.description,
      breadcrumbs: [
        { name: 'Начало', path: '/' },
        { name: page.crumb, path: urlPath },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': page.type || (urlPath === '/catalog' ? 'CollectionPage' : 'WebPage'),
        name: formatTitle(page.title),
        description: clamp(page.description),
        url: absolute(urlPath),
        inLanguage: 'bg',
        isPartOf: { '@id': `${SITE}/#website` },
        ...(urlPath === '/catalog'
          ? {
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: listed.length,
                itemListElement: listed.map((product, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: product.Name,
                  url: absolute(`/details/${encodeURIComponent(product.Id)}`),
                })),
              },
            }
          : {}),
      },
      fallback: `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p>${
        urlPath === '/catalog'
          ? listFallback(products.map((product) => ({
              href: `/details/${encodeURIComponent(product.Id)}`,
              name: product.Name,
            })))
          : ''
      }`,
    });
  });

  Object.entries(LABELS).forEach(([slug, name]) => {
    const urlPath = `/catalog/${slug}`;
    const listed = products.filter(
      (product) => String(product.Category || '').trim().toLowerCase() === slug
    );
    const title = `${name} по поръчка`;
    const description = `${name} от Belcaro: ръчно изработени модели за дом и проект. Шоурум в Казичене, София.`;
    pages.push({
      path: urlPath,
      title,
      description,
      imageAlt: `${name} Belcaro`,
      breadcrumbs: [
        { name: 'Начало', path: '/' },
        { name: 'Каталог', path: '/catalog' },
        { name, path: urlPath },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: formatTitle(title),
        description: clamp(description),
        url: absolute(urlPath),
        inLanguage: 'bg',
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: listed.length,
          itemListElement: listed.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.Name,
            url: absolute(`/details/${encodeURIComponent(product.Id)}`),
          })),
        },
      },
      fallback: `<h1>${escapeHtml(name)}</h1><p>${escapeHtml(description)}</p><p><a href="/catalog">Каталог</a></p>${listFallback(
        listed.map((product) => ({
          href: `/details/${encodeURIComponent(product.Id)}`,
          name: product.Name,
        }))
      )}`,
    });
  });

  products.forEach((product) => {
    const slug = String(product.Category || '').trim().toLowerCase();
    const name = labelOf(product.Category);
    const urlPath = `/details/${encodeURIComponent(product.Id)}`;
    const description = productDescription(product);
    const images = productImages(product);
    const crumbs = [
      { name: 'Начало', path: '/' },
      { name: 'Каталог', path: '/catalog' },
    ];
    if (LABELS[slug]) crumbs.push({ name, path: `/catalog/${slug}` });
    crumbs.push({ name: product.Name, path: urlPath });

    const productLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.Name,
      description,
      image: images,
      sku: String(product.Id),
      brand: { '@type': 'Brand', name: 'Belcaro' },
      category: name,
      url: absolute(urlPath),
      countryOfOrigin: 'BG',
    };
    if (product.Price && Number(product.Price) > 0) {
      productLd.offers = {
        '@type': 'Offer',
        priceCurrency: 'BGN',
        price: Number(product.Price),
        availability: 'https://schema.org/InStock',
        url: absolute(urlPath),
        seller: { '@id': `${SITE}/#organization` },
      };
    }

    pages.push({
      path: urlPath,
      title: name ? `${product.Name} — ${name}` : product.Name,
      description,
      image: images[0],
      imageAlt: product.Name,
      ogType: 'product',
      breadcrumbs: crumbs,
      jsonLd: productLd,
      fallback: `<h1>${escapeHtml(product.Name)}</h1><p>${escapeHtml(description)}</p>${
        LABELS[slug] ? `<p><a href="/catalog/${slug}">${escapeHtml(name)}</a></p>` : ''
      }<p><a href="/contact">Шоурум в Казичене</a></p>${
        images[0] ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(product.Name)}">` : ''
      }`,
    });
  });

  return pages;
}

function prerender(products) {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('dist/belcaro-site/index.html is missing. Run the Angular build first.');
    process.exit(1);
  }
  const shell = fs.readFileSync(indexPath, 'utf8').replace(
    /<noscript><main>[\s\S]*?<\/main><\/noscript>/,
    ''
  );
  const pages = buildPages(products);
  pages.forEach((page) => {
    const html = renderHead(shell, page);
    const target =
      page.path === '/'
        ? indexPath
        : path.join(DIST, page.path.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  });
  console.log(`prerender: ${pages.length} pages`);
}

const mode = process.argv[2] || 'sitemap';
const products = loadProducts();

if (mode === 'sitemap') {
  writeSitemap(products);
} else if (mode === 'prerender') {
  writeSitemap(products);
  prerender(products);
} else {
  console.error('Use: node scripts/seo-build.js sitemap|prerender');
  process.exit(1);
}
