const resources = window.KANDI_RESOURCES || [];

const searchInput = document.querySelector("#searchInput");
const typeFilter = document.querySelector("#typeFilter");
const levelFilter = document.querySelector("#levelFilter");
const cardGrid = document.querySelector("#cardGrid");
const resultCount = document.querySelector("#resultCount");
const scrapedStamp = document.querySelector("#scrapedStamp");
const cardTemplate = document.querySelector("#cardTemplate");

scrapedStamp.textContent = `Scrape snapshot: ${new Date().toLocaleDateString()}`;

const fallbackThumb =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20800%20450%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20x2%3D%271%27%20y1%3D%270%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%25%27%20stop-color%3D%27%23ffe2bd%27/%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23b7ecfb%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width%3D%27800%27%20height%3D%27450%27%20fill%3D%27url(%23g)%27/%3E%3Ccircle%20cx%3D%27160%27%20cy%3D%27165%27%20r%3D%2748%27%20fill%3D%27%23ef476f%27/%3E%3Ccircle%20cx%3D%27265%27%20cy%3D%27230%27%20r%3D%2748%27%20fill%3D%27%2306d6a0%27/%3E%3Ccircle%20cx%3D%27370%27%20cy%3D%27165%27%20r%3D%2748%27%20fill%3D%27%23ffd166%27/%3E%3Ccircle%20cx%3D%27475%27%20cy%3D%27230%27%20r%3D%2748%27%20fill%3D%27%23118ab2%27/%3E%3Ccircle%20cx%3D%27580%27%20cy%3D%27165%27%20r%3D%2748%27%20fill%3D%27%230735b6%27/%3E%3Ctext%20x%3D%2740%27%20y%3D%27400%27%20fill%3D%27%231e1f24%27%20font-family%3D%27Arial%2C%20sans-serif%27%20font-size%3D%2746%27%20font-weight%3D%27700%27%3EKandi%20Resource%3C/text%3E%3C/svg%3E";

const titleCase = (value) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const hashText = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const hsl = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;

const escapeXml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const detectTheme = (title) => {
  const t = title.toLowerCase();
  if (t.includes("hello kitty") || t.includes("kitty")) return "kitty";
  if (t.includes("heart")) return "heart";
  if (t.includes("flower")) return "flower";
  if (t.includes("star")) return "star";
  if (t.includes("mask")) return "mask";
  if (t.includes("ladybug")) return "ladybug";
  if (t.includes("jellyfish")) return "jellyfish";
  if (t.includes("rainbow")) return "rainbow";
  if (t.includes("mandala")) return "mandala";
  if (t.includes("checkered")) return "checkered";
  if (t.includes("ladder")) return "ladder";
  if (t.includes("x-base") || t.includes("x base")) return "xbase";
  if (t.includes("rotator")) return "rotator";
  if (t.includes("bracelet")) return "bracelet";
  return "cuff";
};

const motifSvg = (theme, seed) => {
  if (theme === "heart") {
    return `<path d="M400 250 C330 160 220 185 220 280 C220 360 290 400 400 430 C510 400 580 360 580 280 C580 185 470 160 400 250 Z" fill="#ef476f"/>`;
  }
  if (theme === "flower") {
    return `<g>${[0, 72, 144, 216, 288]
      .map(
        (a) =>
          `<ellipse cx="400" cy="230" rx="70" ry="40" fill="#ff6b6b" transform="rotate(${a} 400 230)"/>`
      )
      .join("")}<circle cx="400" cy="230" r="42" fill="#ffd166"/></g>`;
  }
  if (theme === "star") {
    return `<polygon points="400,120 440,205 535,215 465,275 485,370 400,320 315,370 335,275 265,215 360,205" fill="#ffd166" stroke="#f4a261" stroke-width="10"/>`;
  }
  if (theme === "mask") {
    return `<g><rect x="250" y="150" width="300" height="180" rx="70" fill="#6c5ce7"/><ellipse cx="335" cy="230" rx="38" ry="24" fill="#fff"/><ellipse cx="465" cy="230" rx="38" ry="24" fill="#fff"/><circle cx="335" cy="230" r="12" fill="#222"/><circle cx="465" cy="230" r="12" fill="#222"/></g>`;
  }
  if (theme === "ladybug") {
    return `<g><ellipse cx="400" cy="250" rx="120" ry="95" fill="#e63946"/><ellipse cx="400" cy="250" rx="10" ry="95" fill="#222"/><circle cx="400" cy="165" r="40" fill="#222"/><circle cx="355" cy="240" r="12" fill="#222"/><circle cx="445" cy="240" r="12" fill="#222"/><circle cx="355" cy="285" r="12" fill="#222"/><circle cx="445" cy="285" r="12" fill="#222"/></g>`;
  }
  if (theme === "jellyfish") {
    return `<g><path d="M290 250 C290 170 350 130 400 130 C450 130 510 170 510 250 Z" fill="#4cc9f0"/><path d="M325 250 C330 330 330 340 330 390" stroke="#00b4d8" stroke-width="10" stroke-linecap="round"/><path d="M375 250 C380 330 380 340 380 390" stroke="#00b4d8" stroke-width="10" stroke-linecap="round"/><path d="M425 250 C430 330 430 340 430 390" stroke="#00b4d8" stroke-width="10" stroke-linecap="round"/><path d="M475 250 C480 330 480 340 480 390" stroke="#00b4d8" stroke-width="10" stroke-linecap="round"/></g>`;
  }
  if (theme === "rainbow") {
    return `<g fill="none" stroke-width="22"><path d="M220 360 A180 180 0 0 1 580 360" stroke="#ef476f"/><path d="M250 360 A150 150 0 0 1 550 360" stroke="#f78c6b"/><path d="M280 360 A120 120 0 0 1 520 360" stroke="#ffd166"/><path d="M310 360 A90 90 0 0 1 490 360" stroke="#06d6a0"/><path d="M340 360 A60 60 0 0 1 460 360" stroke="#118ab2"/></g>`;
  }
  if (theme === "mandala") {
    return `<g>${[0, 45, 90, 135]
      .map(
        (a) =>
          `<ellipse cx="400" cy="235" rx="130" ry="40" fill="${hsl((seed + a * 3) % 360, 75, 58)}" transform="rotate(${a} 400 235)" opacity="0.88"/>`
      )
      .join("")}<circle cx="400" cy="235" r="34" fill="#fff"/></g>`;
  }
  if (theme === "checkered") {
    const cells = [];
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 6; c += 1) {
        const color = (r + c) % 2 === 0 ? "#f4a261" : "#2a9d8f";
        cells.push(`<rect x="${250 + c * 50}" y="${150 + r * 50}" width="50" height="50" fill="${color}"/>`);
      }
    }
    return `<g>${cells.join("")}</g>`;
  }
  if (theme === "ladder") {
    return `<g><line x1="280" y1="130" x2="280" y2="370" stroke="#264653" stroke-width="16"/><line x1="520" y1="130" x2="520" y2="370" stroke="#264653" stroke-width="16"/>${[0, 1, 2, 3, 4]
      .map((i) => `<line x1="292" y1="${165 + i * 50}" x2="508" y2="${165 + i * 50}" stroke="#2a9d8f" stroke-width="14"/>`)
      .join("")}</g>`;
  }
  if (theme === "xbase") {
    return `<g stroke="#3a0ca3" stroke-width="20" stroke-linecap="round"><line x1="280" y1="140" x2="520" y2="330"/><line x1="520" y1="140" x2="280" y2="330"/><line x1="400" y1="120" x2="400" y2="350"/></g>`;
  }
  if (theme === "rotator") {
    return `<g><circle cx="400" cy="235" r="110" fill="none" stroke="#118ab2" stroke-width="22"/><circle cx="400" cy="235" r="60" fill="none" stroke="#06d6a0" stroke-width="18"/><polygon points="400,100 430,160 370,160" fill="#ef476f"/></g>`;
  }
  if (theme === "kitty") {
    return `<g><circle cx="400" cy="230" r="95" fill="#fff"/><polygon points="335,160 360,110 390,165" fill="#fff"/><polygon points="465,160 440,110 410,165" fill="#fff"/><circle cx="365" cy="230" r="9" fill="#222"/><circle cx="435" cy="230" r="9" fill="#222"/><ellipse cx="400" cy="255" rx="12" ry="8" fill="#f4a261"/><rect x="458" y="170" width="76" height="28" rx="14" fill="#ef476f"/></g>`;
  }
  if (theme === "bracelet") {
    return `<g><circle cx="400" cy="235" r="105" fill="none" stroke="#2a9d8f" stroke-width="30"/><circle cx="400" cy="235" r="55" fill="none" stroke="#ffd166" stroke-width="20"/></g>`;
  }
  return `<g>${[0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => `<circle cx="${190 + i * 60}" cy="${i % 2 ? 255 : 190}" r="28" fill="${hsl((seed + i * 27) % 360, 78, 55)}"/>`)
    .join("")}</g>`;
};

const makeTitleThumbnail = (title) => {
  const seed = hashText(title);
  const hueA = seed % 360;
  const hueB = (seed * 7) % 360;
  const theme = detectTheme(title);
  const shortTitle = title.length > 28 ? `${title.slice(0, 28)}...` : title;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${hsl(hueA, 86, 88)}" />
      <stop offset="100%" stop-color="${hsl(hueB, 80, 82)}" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)" />
  ${motifSvg(theme, seed)}
  <rect x="30" y="300" width="740" height="118" rx="16" fill="rgba(255,255,255,0.72)" />
  <text x="50" y="335" fill="#33415c" font-family="Nunito, Arial, sans-serif" font-size="20" font-weight="700">
    ${escapeXml(titleCase(theme))}
  </text>
  <text x="50" y="382" fill="#1e1f24" font-family="Nunito, Arial, sans-serif" font-size="32" font-weight="800">
    ${escapeXml(shortTitle)}
  </text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getThumbnail = (item) => makeTitleThumbnail(item.title);

const matchesQuery = (item, query) => {
  if (!query) return true;
  const blob = [item.title, item.source, item.summary, item.level, item.type, item.tags.join(" ")]
    .join(" ")
    .toLowerCase();
  return blob.includes(query);
};

const getFiltered = () => {
  const query = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const level = levelFilter.value;

  return resources.filter((item) => {
    const typeOk = type === "all" || item.type === type;
    const levelOk = level === "all" || item.level === level;
    return typeOk && levelOk && matchesQuery(item, query);
  });
};

const renderCards = () => {
  const filtered = getFiltered();
  cardGrid.innerHTML = "";
  resultCount.textContent = `${filtered.length} resource${filtered.length === 1 ? "" : "s"}`;

  for (const item of filtered) {
    const node = cardTemplate.content.cloneNode(true);
    const thumb = node.querySelector(".thumb");
    thumb.src = getThumbnail(item);
    thumb.alt = `${item.title} thumbnail`;
    thumb.addEventListener("error", () => {
      thumb.src = fallbackThumb;
    });

    node.querySelector("h2").textContent = item.title;
    node.querySelector(".pill.type").textContent = titleCase(item.type);
    node.querySelector(".pill.level").textContent = titleCase(item.level);
    node.querySelector(".meta").textContent = item.source;
    node.querySelector(".summary").textContent = item.summary;
    node.querySelector(".tags").textContent = `Tags: ${item.tags.join(", ")}`;

    const link = node.querySelector(".open-link");
    link.href = item.url;
    link.textContent = item.type === "video" ? "Watch" : "Open";

    cardGrid.appendChild(node);
  }
};

searchInput.addEventListener("input", renderCards);
typeFilter.addEventListener("change", renderCards);
levelFilter.addEventListener("change", renderCards);

renderCards();
