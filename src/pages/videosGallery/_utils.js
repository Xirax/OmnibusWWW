// Turn a share URL into an iframe src. Supports YouTube (watch / youtu.be /
// shorts / embed) and Canva (…/design/<id>/<token>/…). Canva needs the
// /watch player – the /view embed shows only a still frame for videos.
/** @param {string} url @returns {string | null} */
export const getEmbedUrl = (url) => {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const canva = url.match(/canva\.com\/design\/([\w-]+)\/([\w-]+)/);
  if (canva)
    return `https://www.canva.com/design/${canva[1]}/${canva[2]}/watch?embed`;

  return null;
};

/** @param {string[]} urls @returns {string[]} */
export const toEmbeds = (urls) =>
  urls.map(getEmbedUrl).filter((src) => src !== null);
