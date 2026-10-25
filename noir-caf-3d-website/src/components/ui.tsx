import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../utils/cn";

/* --------------------------------- buttons --------------------------------- */

export function ButtonLink({
  to,
  children,
  variant = "primary",
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden px-7 py-4 text-[11px] font-semibold tracking-[0.32em] uppercase transition-colors duration-500",
        variant === "primary"
          ? "bg-cream text-coal hover:text-cream"
          : "border border-cream/25 text-cream hover:border-caramel",
        className,
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -z-0 translate-y-full bg-caramel transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0" />
      )}
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        className={cn(
          "relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          variant === "ghost" && "text-caramel",
        )}
      />
    </Link>
  );
}

/* ------------------------------ section heading ---------------------------- */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function SectionTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] font-light tracking-tight text-cream",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* --------------------------- inner-page header ----------------------------- */

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <header className="relative mx-auto max-w-7xl px-6 pt-40 pb-14 md:px-10 md:pt-48 md:pb-20">
      <div className="reveal is-inview">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionTitle as="h1" className="mt-6 max-w-4xl">
          {title}
        </SectionTitle>
        {intro && <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-sand/90">{intro}</p>}
      </div>
    </header>
  );
}

/* --------------------------------- marquee --------------------------------- */

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-cream/10 py-5 select-none" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-6 text-[12px] tracking-[0.4em] uppercase text-sand/60">
            {item}
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-caramel/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ atmosphere --------------------------------- */

export function Atmosphere() {
  return (
    <>
      <div className="grain-layer" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{ background: "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 60%, rgba(4,2,1,0.5) 100%)" }}
      />
    </>
  );
}

/* ------------------------------ dish tag pills ----------------------------- */

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-cream/15 px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase text-sand/80">
      {children}
    </span>
  );
}
