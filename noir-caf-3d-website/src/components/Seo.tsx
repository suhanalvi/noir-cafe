import { useEffect } from "react";
import { SITE } from "../lib/site";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Per-route SEO: title, description, canonical + Open Graph. */
export default function Seo({
  title,
  description,
  path = "/",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  useEffect(() => {
    const full = `${title} · NOIR CAFÉ`;
    document.title = path === "/" ? "NOIR CAFÉ — Coffee, beyond the ordinary" : full;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", path === "/" ? "NOIR CAFÉ — Coffee, beyond the ordinary" : full);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", SITE.domain + path);
    upsertMeta(
      "property",
      "og:image",
      image ??
        "https://images.pexels.com/photos/40175047/pexels-photo-40175047.jpeg?auto=compress&cs=tinysrgb&w=1200",
    );
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = SITE.domain + path;
  }, [title, description, path, image]);

  return null;
}
