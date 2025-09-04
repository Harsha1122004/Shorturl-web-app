const URLS_KEY = "short_urls";
const CLICKS_KEY = "click_events";

function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const Repo = {
  allUrls() {
    return read(URLS_KEY);
  },
  saveUrl(urlObj) {
    const urls = read(URLS_KEY);
    urls.push(urlObj);
    write(URLS_KEY, urls);
  },
  findByCode(code) {
    return read(URLS_KEY).find((u) => u.code === code);
  },
  codeExists(code) {
    return !!Repo.findByCode(code);
  },

  allClicks() {
    return read(CLICKS_KEY);
  },
  saveClick(click) {
    const clicks = read(CLICKS_KEY);
    clicks.push(click);
    write(CLICKS_KEY, clicks);
  },
  clicksFor(code) {
    return read(CLICKS_KEY).filter((c) => c.code === code);
  },
};
