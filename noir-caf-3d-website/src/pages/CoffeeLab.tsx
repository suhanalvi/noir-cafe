import { useMemo, useState } from "react";
import { Beaker, Droplets, FlaskConical, Hand, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import Seo from "../components/Seo";
import { Eyebrow, PageHero, SectionTitle } from "../components/ui";
import LabCanvas, { LAB_DEFAULTS, type LabMood, type LabState } from "../three/LabCanvas";
import { type CupFinish, type LiquidKind } from "../three/CoffeeCup";
import { useMediaQuery, useReducedMotion, useRevealContainer } from "../lib/hooks";
import { cn } from "../utils/cn";

const DRINK_INFO: Record<Exclude<LiquidKind, "none">, { label: string; ratio: string; time: string; notes: string }> = {
  espresso: { label: "Espresso", ratio: "1 : 2", time: "27 s extraction", notes: "Dark chocolate · burnt sugar · orange peel" },
  latte: { label: "Café Latte", ratio: "1 : 4 milk", time: "Silked to 60°C", notes: "Creamy caramel · vanilla · round body" },
  cappuccino: { label: "Cappuccino", ratio: "1 : 1 : 1", time: "Deep foam cap", notes: "Cocoa dust · toasted malt · plush" },
  coldbrew: { label: "Cold Brew", ratio: "1 : 8", time: "18 h steep", notes: "Cocoa nibs · dried fig · cool finish" },
};

const FINISH_INFO: Record<CupFinish, string> = {
  ivory: "Ivory ceramic — glazed, warm to the light",
  noir: "Matte black stoneware — absorbs the room",
  cream: "Cream gloss — soft studio reflections",
};

const MOOD_INFO: Record<LabMood, string> = {
  ember: "Ember — late-evening amber key light",
  ivory: "Ivory — bright morning studio",
  midnight: "Midnight — cool, low and blue",
};

function OptionButton({
  selected,
  onClick,
  children,
  ariaLabel,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={cn(
        "border px-4 py-3 text-left text-[11px] font-semibold tracking-[0.22em] uppercase transition-all duration-300",
        selected ? "border-caramel bg-caramel/10 text-cream" : "border-cream/15 text-sand/70 hover:border-cream/35 hover:text-cream",
      )}
    >
      {children}
    </button>
  );
}

function ControlGroup({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-cream/10 px-6 py-7 md:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
          <Icon className="h-4 w-4 text-caramel" /> {title}
        </p>
        {hint && <p className="hidden text-[10.5px] text-mute xl:block">{hint}</p>}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">{children}</div>
    </div>
  );
}

export default function CoffeeLab() {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lab, setLab] = useState<LabState>(LAB_DEFAULTS);
  const [hintVisible, setHintVisible] = useState(true);
  const revealRef = useRevealContainer<HTMLDivElement>();

  const patch = (p: Partial<LabState>) => setLab((s) => ({ ...s, ...p }));
  const liquidKey = lab.liquid as Exclude<LiquidKind, "none">;
  const drink = useMemo(() => DRINK_INFO[liquidKey] ?? DRINK_INFO.espresso, [liquidKey]);

  return (
    <div ref={revealRef} className="bg-coal">
      <Seo
        title="Coffee Lab"
        description="An interactive 3D coffee playground — rotate the cup, swap materials and lighting moods, and explore espresso, latte, cappuccino and cold brew."
        path="/coffee-lab"
      />

      <PageHero
        eyebrow="Coffee Lab"
        title={
          <>
            Play with <br />
            <span className="italic text-caramel">the craft.</span>
          </>
        }
        intro="A living 3D cup. Rotate it, relight it, redress it — and learn what actually changes between an espresso and an 18-hour cold brew."
      />

      <section className="mx-auto grid max-w-[1500px] gap-6 px-6 pb-24 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ------------------------------- stage ------------------------------- */}
        <div className="relative">
          <div className="relative h-[58vh] overflow-hidden border border-cream/12 bg-noir lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)]">
            <LabCanvas state={lab} reduced={reduced} isMobile={isMobile} onOrbit={() => setHintVisible(false)} />
            {/* readout chip */}
            <div className="pointer-events-none absolute top-5 left-5 border border-cream/15 bg-coal/70 px-4 py-3 backdrop-blur-sm">
              <p className="text-[9px] tracking-[0.34em] uppercase text-mute">Now pouring</p>
              <p className="font-display mt-1 text-lg text-cream italic">{drink.label}</p>
            </div>
            {hintVisible && !isMobile && (
              <div className="pointer-events-none absolute right-5 bottom-5 flex items-center gap-3 border border-cream/15 bg-coal/70 px-4 py-3 backdrop-blur-sm">
                <Hand className="h-4 w-4 text-caramel" />
                <p className="text-[10px] tracking-[0.26em] uppercase text-sand/80">Drag to rotate · scroll to zoom</p>
              </div>
            )}
            {/* corner ticks */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-cream/[0.07]" />
          </div>
        </div>

        {/* ----------------------------- controls ----------------------------- */}
        <div className="border border-cream/12 bg-espresso/40">
          <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5 md:px-8">
            <p className="eyebrow !text-cream">Controls</p>
            <button
              onClick={() => setLab(LAB_DEFAULTS)}
              className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.26em] uppercase text-sand/70 transition-colors hover:text-caramel"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset scene
            </button>
          </div>

          <ControlGroup icon={FlaskConical} title="Brew in the cup" hint="Changes the real liquid in the model">
            {(Object.keys(DRINK_INFO) as (keyof typeof DRINK_INFO)[]).map((k) => (
              <OptionButton key={k} selected={lab.liquid === k} onClick={() => patch({ liquid: k })}>
                {DRINK_INFO[k].label}
              </OptionButton>
            ))}
          </ControlGroup>
          <div className="border-b border-cream/10 px-6 py-5 md:px-8">
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                [drink.ratio, "brew ratio"],
                [drink.time, "method"],
                [drink.notes, "tasting notes"],
              ].map(([v, k]) => (
                <div key={k} className="border border-cream/10 px-2 py-3">
                  <dt className="text-[9px] tracking-[0.3em] uppercase text-mute">{k}</dt>
                  <dd className="font-display mt-1.5 text-[13px] leading-snug text-cream italic">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ControlGroup icon={Sparkles} title="Cup material" hint={FINISH_INFO[lab.finish]}>
            {(["ivory", "noir", "cream"] as CupFinish[]).map((f) => (
              <OptionButton key={f} selected={lab.finish === f} onClick={() => patch({ finish: f })}>
                <span className="flex items-center gap-3">
                  <span
                    className="inline-block h-4 w-4 rounded-full border border-cream/25"
                    style={{ background: f === "ivory" ? "#f3e9d8" : f === "noir" ? "#181413" : "#efdfc2" }}
                  />
                  {f === "ivory" ? "Ceramic" : f === "noir" ? "Matte black" : "Cream"}
                </span>
              </OptionButton>
            ))}
          </ControlGroup>

          <ControlGroup icon={Lightbulb} title="Lighting mood" hint={MOOD_INFO[lab.mood]}>
            {(["ember", "ivory", "midnight"] as LabMood[]).map((m) => (
              <OptionButton key={m} selected={lab.mood === m} onClick={() => patch({ mood: m })}>
                {m}
              </OptionButton>
            ))}
          </ControlGroup>

          <ControlGroup icon={Droplets} title="Particles" hint="Roasted beans orbiting the cup">
            <OptionButton selected={lab.beans} onClick={() => patch({ beans: true })} ariaLabel="Show coffee-bean particles">
              Beans on
            </OptionButton>
            <OptionButton selected={!lab.beans} onClick={() => patch({ beans: false })} ariaLabel="Hide coffee-bean particles">
              Beans off
            </OptionButton>
          </ControlGroup>
        </div>
      </section>

      {/* ---------------------------- education ---------------------------- */}
      <section className="border-t border-cream/10 bg-noir">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <div className="reveal">
            <Eyebrow>Field notes</Eyebrow>
            <SectionTitle className="mt-6 max-w-3xl">
              What the lab <span className="italic text-caramel">is teaching.</span>
            </SectionTitle>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-cream/10 bg-cream/10 md:grid-cols-3">
            {[
              {
                icon: Beaker,
                title: "Origins, in broad strokes",
                body: "Altitude and climate shape flavour: Ethiopian coffees often lean floral and citrus-bright; Colombian lots tend toward caramel and red fruit; Brazilian coffees bring chocolate and hazelnut depth. It's a map, not law — processing and roast rewrite it.",
              },
              {
                icon: FlaskConical,
                title: "Roast levels",
                body: "Light roasts keep origin acidity and aromatics; medium roasts trade sparkle for sweetness and balance; dark roasts push toward bittersweet, smoky and heavy. Our house style sits just past medium — dark enough for comfort, light enough for place.",
              },
              {
                icon: Droplets,
                title: "Brewing styles",
                body: "Espresso is pressure — nine bars, half a minute, intense and small. Pour-over is gravity and patience — clean, articulate cups. Immersion (French press, cold brew) is time — round, sweet, forgiving. Same bean, three different stories.",
              },
            ].map((c, i) => (
              <article key={c.title} className="reveal bg-noir p-8 md:p-10" style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
                <c.icon className="h-6 w-6 text-caramel" />
                <h3 className="font-display mt-6 text-2xl font-light text-cream italic">{c.title}</h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-sand/80">{c.body}</p>
              </article>
            ))}
          </div>
          <p className="reveal mt-8 text-[11px] tracking-[0.2em] uppercase text-mute">
            General coffee knowledge — no farm, certification or sourcing claims are made on this demo.
          </p>
        </div>
      </section>
    </div>
  );
}
