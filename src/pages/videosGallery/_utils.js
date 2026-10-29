// Turn share URLs into lightweight video cards. Supports YouTube (watch /
// youtu.be / shorts / embed) and Canva (…/design/<id>/<token>/…). Canva needs
// the /watch player – the /view embed shows only a still frame for videos.
// Title and poster come from each provider's public oEmbed endpoint at build
// time, so the page ships static posters instead of one heavy player per video.

/** @typedef {{ embed: string, poster: string | null, title: string }} Video */

const CANVA_DEFAULT_TITLES = ["Untitled", "Bez tytułu"];

/** @param {string} endpoint */
const fetchOembed = async (endpoint) => {
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(10_000) });
    return res.ok ? await res.json() : null;
  } catch {
    // Offline or blocked build: the card falls back to a plain poster.
    return null;
  }
};

/** @param {string} url @returns {Promise<Video | null>} */
const getVideo = async (url) => {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/,
  );
  if (yt) {
    const meta = await fetchOembed(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
    );
    return {
      // Opened by a click, so browsers allow autoplay with sound.
      embed: `https://www.youtube.com/embed/${yt[1]}?autoplay=1`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`,
      title: meta?.title ?? "",
    };
  }

  const canva = url.match(/canva\.com\/design\/([\w-]+)\/([\w-]+)/);
  if (canva) {
    const base = `https://www.canva.com/design/${canva[1]}/${canva[2]}`;
    const meta = await fetchOembed(
      `https://www.canva.com/_oembed?url=${encodeURIComponent(`${base}/watch`)}`,
    );
    return {
      embed: `${base}/watch?embed`,
      poster: meta?.thumbnail_url ?? null,
      // Unnamed designs report Canva's placeholder – show no title instead.
      title: CANVA_DEFAULT_TITLES.includes(meta?.title)
        ? ""
        : (meta?.title ?? ""),
    };
  }

  return null;
};

/** @param {string[]} urls @returns {Promise<Video[]>} */
export const toVideos = async (urls) =>
  (await Promise.all(urls.map(getVideo))).filter((video) => video !== null);
