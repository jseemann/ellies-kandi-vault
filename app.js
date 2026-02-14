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

const makeTitleThumbnail = (title) => {
  const seed = hashText(title);
  const hueA = seed % 360;
  const hueB = (seed * 7) % 360;
  const hueC = (seed * 13) % 360;
  const shortTitle = title.length > 28 ? `${title.slice(0, 28)}...` : title;

  const circles = Array.from({ length: 9 }, (_, i) => {
    const x = 70 + i * 78;
    const y = i % 2 === 0 ? 140 : 230;
    const r = 26 + (i % 3) * 5;
    const hue = (hueC + i * 22) % 360;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${hsl(hue, 78, 56)}" opacity="0.95" />`;
  }).join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${hsl(hueA, 86, 88)}" />
      <stop offset="100%" stop-color="${hsl(hueB, 80, 82)}" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)" />
  ${circles}
  <rect x="30" y="300" width="740" height="118" rx="16" fill="rgba(255,255,255,0.72)" />
  <text x="50" y="352" fill="#1e1f24" font-family="Nunito, Arial, sans-serif" font-size="32" font-weight="800">
    ${shortTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
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
