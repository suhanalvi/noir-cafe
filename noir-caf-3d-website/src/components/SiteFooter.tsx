import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ROUTES, SITE } from "../lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-cream/10 bg-coal">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-6 py-20 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-display text-4xl font-light text-cream italic">
            Noir <span className="not-italic text-caramel">Café</span>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/80">
            {SITE.tagline} Slow mornings, bold flavours, and a room designed for staying a little longer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`NOIR CAFÉ on ${s.label} (add the café's real handle before launch)`}
                className="group inline-flex items-center gap-2 border border-cream/15 px-4 py-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-sand transition-colors hover:border-caramel hover:text-caramel"
              >
                {s.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul className="mt-6 space-y-3.5">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <Link
                  to={r.path}
                  className="group inline-flex items-center gap-2 text-sm text-sand/85 transition-colors hover:text-cream"
                >
                  {r.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-caramel" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Visit</p>
          <address className="mt-6 text-sm leading-relaxed text-sand/85 not-italic">
            {SITE.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <p className="mt-5 text-sm text-sand/85">
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-caramel">
              {SITE.email}
            </a>
          </p>
          <p className="mt-5 text-[11px] leading-relaxed text-mute">
            Address, hours and contact details are editable demonstration content.
          </p>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-3 px-6 py-6 text-[11px] tracking-[0.24em] uppercase text-mute md:flex-row md:items-center md:px-10">
          <span>© {new Date().getFullYear()} NOIR CAFÉ — a concept experience</span>
          <span>Crafted dark, served warm</span>
        </div>
      </div>
    </footer>
  );
}
