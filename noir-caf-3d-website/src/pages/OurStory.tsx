import Seo from "../components/Seo";
import { ButtonLink, Eyebrow, Marquee, SectionTitle } from "../components/ui";
import { useRevealContainer } from "../lib/hooks";
import { IMG } from "../lib/site";

const TIMELINE = [
  {
    year: "2016",
    title: "A counter, four stools",
    body: "NOIR begins as an idea sketched on napkins — a room where the coffee is slow and the pace is slower. The first bar is a rented corner with a secondhand lever machine.",
  },
  {
    year: "2018",
    title: "The roaster arrives",
    body: "A battered 4 kg drum roaster, refurbished by hand. Roast nights run past midnight; neighbours start-timing their evenings by the smell of first crack.",
  },
  {
    year: "2021",
    title: "The dark room",
    body: "The current space opens — oak, leather, amber light. The menu shrinks deliberately: fewer drinks, done with more conviction.",
  },
  {
    year: "Today",
    title: "Still small, on purpose",
    body: "One room, one roaster, one bar. Growth is measured in returning faces, not franchises. The second cup remains free of hurry.",
  },
];

export default function OurStory() {
  const revealRef = useRevealContainer<HTMLDivElement>();

  return (
    <div ref={revealRef} className="bg-coal">
      <Seo
        title="Our Story"
        description="The philosophy behind NOIR CAFÉ — slow roasting, deliberate brewing, and a room built for staying. Sample brand narrative, editable by the client."
        path="/our-story"
      />

      {/* ------------------------------- hero ------------------------------- */}
      <header className="relative mx-auto max-w-7xl px-6 pt-40 pb-16 md:px-10 md:pt-52 md:pb-24">
        <div className="reveal is-inview">
          <Eyebrow>Our story</Eyebrow>
          <h1 className="font-display mt-6 max-w-5xl text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] font-light tracking-tight text-cream">
            A café written in <br />
            <span className="italic text-caramel">shadow & steam.</span>
          </h1>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <p className="reveal max-w-xl text-[15px] leading-relaxed text-sand/85">
            NOIR CAFÉ is a fictional specialty coffee house built for this demo — but the philosophy is real: coffee is
            not fuel, it is a pause. We designed this brand around the five minutes when the cup is still too hot and
            the world can wait. <em className="text-sand/60">(All brand history on this page is editable sample copy.)</em>
          </p>
          <div className="reveal-img relative aspect-[4/3] overflow-hidden">
            <img
              src={IMG.coffeeDark.espressoMaker}
              alt="Steaming coffee beside an espresso maker in moody light"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </header>

      <Marquee items={["Slow roast", "Small batch", "First crack", "Amber light", "Ceramic & oak", "Second cups"]} />

      {/* ---------------------------- philosophy ---------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="reveal">
              <Eyebrow>Philosophy</Eyebrow>
              <SectionTitle className="mt-6">
                We subtract until <br />
                <span className="italic text-caramel">only the cup is left.</span>
              </SectionTitle>
            </div>
          </div>
          <div className="space-y-10">
            <p className="reveal text-lg leading-relaxed text-cream/90 md:text-xl">
              Most cafés add. We take away. The menu is short. The music is low. The room asks nothing of you except
              that you taste what’s in front of you.
            </p>
            <p className="reveal max-w-xl text-[14.5px] leading-relaxed text-sand/85">
              Sourcing, in our world, means buying well-roasted lots from roasters we trust and tasting every batch
              before it hits the bar. We make no claims about farms we haven’t walked — and on this demo site any
              sourcing language is <em className="text-sand/60">placeholder copy awaiting the client’s real story.</em>
            </p>
            <blockquote className="reveal border-l-2 border-caramel pl-8">
              <p className="font-display text-2xl leading-snug font-light text-cream italic md:text-3xl">
                “Darkness isn’t the absence of light. It’s where the light decides to rest.”
              </p>
              <cite className="mt-4 block text-[11px] tracking-[0.3em] uppercase text-mute not-italic">
                — The Noir house note (sample copy)
              </cite>
            </blockquote>
            <div className="reveal-img relative aspect-[16/10] overflow-hidden">
              <img
                src={IMG.beans.darkBeans}
                alt="Roasted coffee beans scattered on a black surface"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ timeline ----------------------------- */}
      <section className="border-y border-cream/10 bg-noir">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="reveal">
            <Eyebrow>The timeline</Eyebrow>
            <SectionTitle className="mt-6">
              Four chapters, <span className="italic text-caramel">one roast.</span>
            </SectionTitle>
          </div>
          <ol className="mt-16 space-y-0">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className="reveal group grid gap-4 border-t border-cream/10 py-10 md:grid-cols-[180px_1fr_1.2fr] md:gap-10 md:py-14">
                <span className="font-display text-stroke text-5xl font-light md:text-6xl">{t.year}</span>
                <h3 className="font-display text-2xl font-light text-cream italic md:text-3xl">{t.title}</h3>
                <p className="max-w-xl text-[14px] leading-relaxed text-sand/80">{t.body}</p>
                {i === TIMELINE.length - 1 && <span className="sr-only">Present day</span>}
              </li>
            ))}
          </ol>
          <p className="reveal mt-4 text-[11px] tracking-[0.2em] uppercase text-mute">
            Timeline is fictional sample content — replace with the café’s real milestones.
          </p>
        </div>
      </section>

      {/* ------------------------------- craft ------------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="reveal-img relative order-2 aspect-[3/4] overflow-hidden md:order-1">
            <img
              src={IMG.barista.streamPitcher}
              alt="Barista pouring steamed milk into a coffee cup"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="reveal">
              <Eyebrow>The craft</Eyebrow>
              <SectionTitle className="mt-6">
                Roasting is listening. <br />
                <span className="italic text-caramel">Brewing is grammar.</span>
              </SectionTitle>
            </div>
            <p className="reveal mt-8 max-w-lg text-[14.5px] leading-relaxed text-sand/85">
              A roast is finished by ear and nose as much as by curve — the rolling crack, the moment sweetness peaks.
              Then the bar takes over: water at 93°C, 18 grams in, 36 out, twenty-seven seconds. Numbers steady the
              hand; the hand still decides.
            </p>
            <p className="reveal mt-5 max-w-lg text-[14.5px] leading-relaxed text-sand/85">
              Every pour is timed, weighed and tasted. When it’s wrong, it’s ours — poured out, dialled in again.
            </p>
            <div className="reveal mt-10">
              <ButtonLink to="/coffee-lab" variant="ghost">
                Try the Coffee Lab
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ closing ------------------------------ */}
      <section className="relative overflow-hidden">
        <img
          src={IMG.interior.rusticTable}
          alt="Warm café interior with rustic wooden table and vintage lighting"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-coal/72" />
        <div className="relative mx-auto max-w-4xl px-6 py-40 text-center md:py-56">
          <div className="reveal">
            <p className="eyebrow">The whole idea</p>
            <p className="font-display mt-8 text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[1.05] font-light text-cream">
              Stay until the cup is cold. <br />
              <span className="italic text-amber">Then order another.</span>
            </p>
            <div className="mt-12">
              <ButtonLink to="/visit">Plan your visit</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
