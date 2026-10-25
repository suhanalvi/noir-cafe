import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown, Flame, Droplets, Wind, BookOpen } from "lucide-react";
import HeroCanvas, { HERO_CTRL_DEFAULTS, type HeroCtrl } from "../three/HeroCanvas";
import Seo from "../components/Seo";
import { ButtonLink, Eyebrow, Marquee, SectionTitle } from "../components/ui";
import { useMediaQuery, useReducedMotion, useRevealContainer } from "../lib/hooks";
import { MENU } from "../data/menu";
import { IMG } from "../lib/site";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ctrl = useRef<HeroCtrl>({ ...HERO_CTRL_DEFAULTS });
  const journeyRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const rootRef = useRevealContainer<HTMLDivElement>();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      /* ---------- master scrubbed 3D timeline (reversible) ---------- */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: journeyRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
        },
      });
      tl.to(ctrl.current, { camZ: 7.0, tarY: 1.05, duration: 0.7, ease: "none" }, 0)
        // Scene 2 — The Roast
        .to(ctrl.current, { camX: 2.8, camZ: 5.4, camY: 1.15, cupRy: 3.8, beanBoost: 2.6, warm: 1, duration: 2, ease: "power1.inOut" }, ">")
        // Scene 3 — The Pour (approach)
        .to(ctrl.current, { camX: 0.45, camY: 2.5, camZ: 4.1, tarY: 1.0, beanBoost: 0.35, spout: 1, duration: 0.9, ease: "power1.inOut" }, ">")
        // extraction
        .to(ctrl.current, { pour: 1, liquid: 1, steam: 1.6, duration: 1.1, ease: "none" }, ">")
        .to(ctrl.current, { crema: 1, duration: 0.45, ease: "power1.out" }, ">-0.35")
        // Scene 4 — The Aroma
        .to(
          ctrl.current,
          { camX: 0, camY: 1.75, camZ: 9.6, tarY: 1.25, rays: 1, aroma: 1, warm: 0.55, spout: 0, beanBoost: 0.8, cupRy: "+=1.4", duration: 2, ease: "power1.inOut" },
          ">-0.1",
        );

      /* ---------- narrative panels (fade in / out, scrubbed) ---------- */
      gsap.utils.toArray<HTMLElement>("[data-panel='io']").forEach((p) => {
        const section = p.closest("section");
        if (!section) return;
        gsap.fromTo(p, { autoAlpha: 0, y: 56 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: section, start: "top 62%", end: "top 8%", scrub: 1 } });
        gsap.to(p, { autoAlpha: 0, y: -46, ease: "none", scrollTrigger: { trigger: section, start: "bottom 88%", end: "bottom 45%", scrub: 1 } });
      });
      gsap.utils.toArray<HTMLElement>("[data-panel='out']").forEach((p) => {
        const section = p.closest("section");
        if (!section) return;
        gsap.to(p, { autoAlpha: 0, y: -40, ease: "none", scrollTrigger: { trigger: section, start: "bottom 96%", end: "bottom 58%", scrub: 1 } });
      });

      /* ---------- fade the 3D stage as the menu section arrives ---------- */
      gsap.to(canvasWrapRef.current, {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: "#scene-menu", start: "top bottom", end: "top 38%", scrub: 1 },
      });

      /* ---------- cinematic scale on the café photograph ---------- */
      gsap.fromTo(
        "#scene-cafe img",
        { scale: 1.28 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: "#scene-cafe", start: "top bottom", end: "bottom top", scrub: 1 } },
      );
      gsap.fromTo(
        "#scene-cafe .cafe-copy",
        { yPercent: 18 },
        { yPercent: -18, ease: "none", scrollTrigger: { trigger: "#scene-cafe", start: "top bottom", end: "bottom top", scrub: 1 } },
      );
    });
    return () => ctx.revert();
  }, [reduced]);

  const stickyOr = reduced ? "relative flex min-h-screen items-center" : "sticky top-0 flex h-screen items-center";
  const tall = (vh: string) => (reduced ? "relative" : `relative ${vh}`);

  const previewItems = [...MENU.signature.slice(0, 2), MENU.espresso[0]];

  return (
    <div ref={rootRef} className="relative">
      <Seo
        title="Coffee, beyond the ordinary"
        description="A cinematic specialty coffee experience — slow mornings, bold flavours, and a 3D journey from roast to pour at NOIR CAFÉ."
        path="/"
      />

      {/* ------------------------- fixed 3D stage ------------------------- */}
      <div ref={canvasWrapRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <HeroCanvas ctrl={ctrl} reduced={reduced} isMobile={isMobile} />
      </div>

      {/* ============================ JOURNEY ============================ */}
      <div ref={journeyRef} className="relative z-10">
        {/* ---------- Scene 1 · The Arrival ---------- */}
        <section className={tall("h-[140vh]")} aria-label="Introduction">
          <div className={cn(stickyOr, "justify-center")}>
            <div data-panel="out" className="mx-auto max-w-5xl px-6 text-center">
              <Eyebrow className="justify-center">Specialty coffee · Est. dusk</Eyebrow>
              <h1 className="font-display mt-8 text-[clamp(4rem,13vw,11rem)] leading-[0.9] font-light tracking-tight text-cream">
                NOIR <span className="italic text-caramel">Café</span>
              </h1>
              <p className="font-display mt-7 text-[clamp(1.3rem,2.6vw,2rem)] font-light text-sand italic">
                Coffee, beyond the ordinary.
              </p>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-sand/75">
                Slow mornings. Bold flavours. Moments worth staying for.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ButtonLink to="/experience">Explore the experience</ButtonLink>
                <ButtonLink to="/coffee-lab" variant="ghost">
                  Discover our coffee
                </ButtonLink>
              </div>
              <div className="scroll-indicator mx-auto mt-14 w-px" aria-hidden="true" />
              <p className="mt-3 flex items-center justify-center gap-2 text-[10px] tracking-[0.4em] uppercase text-mute">
                <ChevronDown className="h-3.5 w-3.5 text-caramel" /> Scroll to begin
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Scene 2 · The Roast ---------- */}
        <section className={tall("h-[165vh]")} aria-label="The Roast">
          <div className={cn(stickyOr, "justify-end")}>
            <div data-panel="io" className="mx-auto w-full max-w-7xl px-6 md:px-10">
              <div className="ml-auto max-w-lg">
                <p className="eyebrow flex items-center gap-3">
                  <Flame className="h-4 w-4" /> 01 — The Roast
                </p>
                <h2 className="font-display mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1] font-light text-cream">
                  Roasted until <br />
                  <span className="italic text-caramel">it sings.</span>
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-sand/85">
                  Small batches tumble in the drum until first crack blooms — sugars caramelise, acidity turns to
                  syrup, and the room fills with ember and toast. We roast dark enough for depth, never so dark that
                  the origin disappears.
                </p>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-cream/10 pt-6 text-center">
                  {[
                    ["212°C", "drum temp"],
                    ["11:40", "min drop"],
                    ["4 kg", "batch size"],
                  ].map(([v, k]) => (
                    <div key={k}>
                      <dt className="font-display text-xl text-cream italic">{v}</dt>
                      <dd className="mt-1 text-[10px] tracking-[0.28em] uppercase text-mute">{k}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Scene 3 · The Pour ---------- */}
        <section className={tall("h-[175vh]")} aria-label="The Pour">
          <div className={cn(stickyOr)}>
            <div data-panel="io" className="mx-auto w-full max-w-7xl px-6 md:px-10">
              <div className="max-w-lg">
                <p className="eyebrow flex items-center gap-3">
                  <Droplets className="h-4 w-4" /> 02 — The Pour
                </p>
                <h2 className="font-display mt-6 text-[clamp(2.4rem,5vw,4.4rem)] leading-[1] font-light text-cream">
                  Nine bars. <br />
                  <span className="italic text-caramel">Twenty-seven seconds.</span>
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-sand/85">
                  Watch the first drops fall — tiger-striped, thick, patient. Pressure coaxes honeyed crema from the
                  grounds while the cup warms below. This is the moment everything before it was for.
                </p>
                <p className="mt-6 inline-flex items-center gap-3 border border-cream/15 px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-sand/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-caramel" /> Keep scrolling — it backs up
                  too
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Scene 4 · The Aroma ---------- */}
        <section className={tall("h-[160vh]")} aria-label="The Aroma">
          <div className={cn(stickyOr, "justify-center")}>
            <div data-panel="io" className="mx-auto max-w-3xl px-6 pt-[34vh] text-center md:pt-[38vh]">
              <p className="eyebrow flex items-center justify-center gap-3">
                <Wind className="h-4 w-4" /> 03 — The Aroma
              </p>
              <h2 className="font-display mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[1] font-light text-cream">
                You smell it <span className="italic text-caramel">before you see it.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-sand/85">
                Cocoa, toasted hazelnut, orange marmalade. Aroma is memory arriving early — let the steam do the
                talking.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ====================== Scene 5 · Menu reveal ====================== */}
      <section id="scene-menu" className="relative z-10 border-t border-cream/10 bg-noir" aria-label="Menu preview">
        <Marquee items={["Espresso", "Pour-over", "Cold brew", "Signature lattes", "Slow mornings", "Small-batch roast", "Fresh pastry"]} />
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
          <div className="reveal flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <BookOpen className="h-4 w-4" /> 04 — The Menu
              </p>
              <SectionTitle className="mt-6">
                A short list, <br />
                <span className="italic text-caramel">done properly.</span>
              </SectionTitle>
            </div>
            <ButtonLink to="/menu" variant="ghost">
              Full menu
            </ButtonLink>
          </div>

          <div className="mt-16 space-y-2">
            {previewItems.map((item, i) => (
              <Link
                key={item.id}
                to="/menu"
                className={cn(
                  "reveal group grid grid-cols-[64px_1fr_auto] items-center gap-5 border-t border-cream/10 py-7 transition-colors hover:bg-cream/[0.03] md:grid-cols-[90px_130px_1fr_auto]",
                )}
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <span className="font-display text-2xl text-mute italic md:text-3xl">0{i + 1}</span>
                {item.image && (
                  <span className="hidden h-24 w-32 overflow-hidden md:block">
                    <img
                      src={item.image}
                      alt={item.alt ?? item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </span>
                )}
                <span>
                  <span className="font-display text-xl font-light text-cream transition-colors group-hover:text-caramel md:text-2xl">
                    {item.name}
                  </span>
                  <span className="mt-1 block max-w-md text-[13px] leading-relaxed text-sand/70">{item.desc}</span>
                </span>
                <span className="inline-flex items-center gap-4">
                  <span className="font-display text-lg text-caramel italic md:text-xl">₹{item.price}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 text-caramel opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= Scene 6 · The café ======================= */}
      <section id="scene-cafe" className="relative z-10 overflow-hidden bg-noir" aria-label="The café">
        <div className="relative h-[110vh]">
          <img
            src={IMG.interior.industrialWide}
            alt="Dimly lit café interior with industrial décor and warm counter light"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/25 to-coal/60" />
          <div className="cafe-copy absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10">
              <p className="eyebrow">05 — The Café</p>
              <h2 className="font-display mt-6 max-w-2xl text-[clamp(2.6rem,6vw,5rem)] leading-[1] font-light text-cream">
                A room tuned to <span className="italic text-amber">amber.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-sand/90">
                Low light, low music, long tables. Leather, oak and the hum of the grinder — the room is mixed like a
                record.
              </p>
              <div className="mt-8">
                <ButtonLink to="/experience" variant="ghost">
                  Step inside
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Scene 7 · The invitation ===================== */}
      <section className="relative z-10 flex min-h-screen items-center justify-center border-t border-cream/10 bg-coal" aria-label="Invitation">
        <div className="reveal mx-auto max-w-4xl px-6 py-32 text-center">
          <p className="eyebrow">06 — The Invitation</p>
          <h2 className="font-display mt-8 text-[clamp(3rem,8vw,7rem)] leading-[0.98] font-light text-cream">
            Your table <br />
            <span className="italic text-caramel">is waiting.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-sand/80">
            Come at dawn for the first pull, or at dusk when the lights drop low. Either way — stay for the second
            cup.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink to="/menu">Explore the menu</ButtonLink>
            <ButtonLink to="/visit" variant="ghost">
              Plan your visit
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
