export const slugify = (value: string) => {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const clean = (pathname: string) => {
  return pathname.replace(/^posts\/\d{2}-/, "");
};
