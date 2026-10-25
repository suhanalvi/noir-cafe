import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Seo from "../components/Seo";
import { ButtonLink, Eyebrow, PageHero } from "../components/ui";
import { useMediaQuery, useReducedMotion, useRevealContainer } from "../lib/hooks";
import { IMG } from "../lib/site";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface Shot {
  src: string;
  alt: string;
  title: string;
  cat: "Interior" | "Craft" | "People" | "Ritual";
  ratio: string;
}

const SHOTS: Shot[] = [
  { src: IMG.interior.industrialWide, alt: "Wide view of the dimly lit café with industrial décor", title: "The long room", cat: "Interior", ratio: "aspect-[4/3]" },
  { src: IMG.barista.milkHands, alt: "Hands pouring frothy milk into coffee to create latte art", title: "The pour", cat: "Craft", ratio: "aspect-[3/4]" },
  { src: IMG.people.icedChat, alt: "Two friends in lively conversation over iced coffee", title: "First catch-up", cat: "People", ratio: "aspect-[4/5]" },
  { src: IMG.interior.wovenChairs, alt: "A row of wooden weave chairs lit in a dark room", title: "Woven seats", cat: "Interior", ratio: "aspect-[3/4]" },
  { src: IMG.coffeeDark.grinderCup, alt: "Vintage coffee grinder with a cup of coffee", title: "Hand-ground", cat: "Ritual", ratio: "aspect-[4/5]" },
  { src: IMG.interior.counterBarista, alt: "Warm café counter with a barista preparing coffee", title: "Counter service", cat: "Craft", ratio: "aspect-[4/3]" },
  { src: IMG.people.colleagues, alt: "Two men enjoying coffee and conversation outdoors", title: "Working lunch", cat: "People", ratio: "aspect-[16/11]" },
  { src: IMG.interior.chairShadow, alt: "Dramatic shadows cast across a wooden chair", title: "Corner light", cat: "Interior", ratio: "aspect-[3/4]" },
  { src: IMG.barista.latteClose, alt: "Latte art being created in a coffee cup, close-up", title: "Rosetta practice", cat: "Craft", ratio: "aspect-[3/4]" },
  { src: IMG.interior.rusticTable, alt: "Rustic wooden café table under vintage lighting", title: "The back table", cat: "Interior", ratio: "aspect-[3/4]" },
  { src: IMG.people.laughter, alt: "Two women laughing over coffee outdoors", title: "Second rounds", cat: "People", ratio: "aspect-[4/3]" },
  { src: IMG.interior.barCounter, alt: "Glowing lamp above the café counter by a wooden stairway", title: "The rail", cat: "Interior", ratio: "aspect-[3/4]" },
];

export default function Experience() {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rootRef = useRevealContainer<HTMLDivElement>();
  const galleryRef = useRef<HTMLDivElement>(null);

  /* restrained parallax drift per card */
  useEffect(() => {
    if (reduced || isMobile || !galleryRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: i % 2 === 0 ? 26 : -14 },
          {
            y: i % 2 === 0 ? -26 : 14,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 },
          },
        );
      });
    }, galleryRef);
    return () => ctx.revert();
  }, [reduced, isMobile]);

  const next = useCallback(() => setLightbox((i) => (i === null ? null : (i + 1) % SHOTS.length)), []);
  const prev = useCallback(() => setLightbox((i) => (i === null ? null : (i - 1 + SHOTS.length) % SHOTS.length)), []);

  useEffect(() => {
    if (lightbox === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, next, prev]);

  const activeShot = useMemo(() => (lightbox === null ? null : SHOTS[lightbox]), [lightbox]);

  return (
    <div ref={rootRef} className="bg-coal">
      <Seo
        title="Experience"
        description="Inside NOIR CAFÉ — amber interiors, barista craft, quiet corners and loud laughter. A cinematic gallery of the room."
        path="/experience"
      />

      <PageHero
        eyebrow="Experience"
        title={
          <>
            The room is <br />
            <span className="italic text-caramel">part of the menu.</span>
          </>
        }
        intro="A walk through the dark — interiors, craftsmanship, and the people who make the room feel alive. Demo photography, replaceable with real café shoots."
      />

      {/* opening spread */}
      <div className="reveal-img relative mx-auto max-w-[1500px] px-6 md:px-10">
        <figure className="relative aspect-[16/8] overflow-hidden">
          <img
            src={IMG.interior.colourfulChairs}
            alt="Moody café scene with chairs and tables in dramatic lighting"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <figcaption className="absolute bottom-4 left-5 text-[10px] tracking-[0.3em] text-cream/85 uppercase">
            06:58 — before the doors open
          </figcaption>
        </figure>
      </div>

      {/* masonry gallery */}
      <div ref={galleryRef} className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28">
        <div className="reveal flex items-end justify-between gap-6">
          <Eyebrow>The gallery</Eyebrow>
          <p className="hidden text-[11px] tracking-[0.24em] uppercase text-mute sm:block">
            Click any frame for fullscreen
          </p>
        </div>

        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {SHOTS.map((s, i) => (
            <figure key={s.title} data-drift className="group relative mb-6 break-inside-avoid">
              <button
                onClick={() => setLightbox(i)}
                className="block w-full overflow-hidden text-left"
                aria-label={`Open ${s.title} fullscreen`}
              >
                <span className={cn("relative block overflow-hidden", s.ratio)}>
                  <img
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-108"
                  />
                  <span className="absolute inset-0 bg-coal/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border border-cream/30 bg-coal/50 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                    <Expand className="h-4 w-4 text-cream" />
                  </span>
                </span>
                <figcaption className="flex items-baseline justify-between gap-4 pt-3.5 pb-1">
                  <span className="font-display text-lg font-light text-cream italic">{s.title}</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-mute">{s.cat}</span>
                </figcaption>
              </button>
            </figure>
          ))}
        </div>
      </div>

      {/* quiet interlude */}
      <section className="border-y border-cream/10 bg-noir">
        <div className="reveal mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-[clamp(1.7rem,4vw,3rem)] leading-snug font-light text-cream italic">
            “You come for coffee. You stay because the light makes everyone look like they mean it.”
          </p>
          <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-mute">— overheard at table four (sample copy)</p>
        </div>
      </section>

      {/* cta */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center md:py-40">
        <div className="reveal">
          <Eyebrow>See it in person</Eyebrow>
          <h2 className="font-display mt-6 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1] font-light text-cream">
            Photographs end <span className="italic text-caramel">at the door.</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink to="/visit">Plan your visit</ButtonLink>
            <ButtonLink to="/menu" variant="ghost">
              Browse the menu
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------ lightbox ------------------------------ */}
      <AnimatePresence>
        {activeShot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-coal/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeShot.title} — fullscreen view`}
            onClick={() => setLightbox(null)}
          >
            <motion.figure
              key={activeShot.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[82vh] max-w-6xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeShot.src.replace("h=650&w=940", "h=1200&w=1800")}
                alt={activeShot.alt}
                className="mx-auto max-h-[76vh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 flex items-baseline justify-between gap-6">
                <span className="font-display text-xl font-light text-cream italic">{activeShot.title}</span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-mute">
                  {activeShot.cat} · {(lightbox ?? 0) + 1} / {SHOTS.length}
                </span>
              </figcaption>
            </motion.figure>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photograph"
              className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-cream/25 bg-coal/60 text-cream backdrop-blur transition-colors hover:border-caramel hover:text-caramel md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photograph"
              className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-cream/25 bg-coal/60 text-cream backdrop-blur transition-colors hover:border-caramel hover:text-caramel md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close fullscreen view"
              className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center border border-cream/25 bg-coal/60 text-cream backdrop-blur transition-colors hover:border-caramel hover:text-caramel"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
