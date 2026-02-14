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

const getYouTubeId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const getThumbnail = (item) => {
  if (item.thumbnail) return item.thumbnail;
  const youtubeId = getYouTubeId(item.url);
  if (youtubeId) return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  return `https://image.thum.io/get/width/720/crop/405/noanimate/${item.url}`;
};

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
