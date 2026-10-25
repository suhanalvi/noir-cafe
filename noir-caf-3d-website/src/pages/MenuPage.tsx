import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Info, X } from "lucide-react";
import Seo from "../components/Seo";
import { Eyebrow, PageHero, Tag } from "../components/ui";
import { CATEGORIES, MENU, MENU_NOTE, type MenuCategory, type MenuItem } from "../data/menu";
import { useRevealContainer } from "../lib/hooks";
import { cn } from "../utils/cn";

export default function MenuPage() {
  const [category, setCategory] = useState<MenuCategory>("espresso");
  const [active, setActive] = useState<MenuItem | null>(null);
  const items = useMemo(() => MENU[category], [category]);
  const revealRef = useRevealContainer<HTMLDivElement>([category]);

  const close = useCallback(() => setActive(null), []);
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <div ref={revealRef} className="bg-coal">
      <Seo
        title="Menu"
        description="Espresso, signature lattes, cold brew, tea and fresh bakery — the NOIR CAFÉ menu. Sample items and INR prices as editable demo content."
        path="/menu"
      />

      <PageHero
        eyebrow="The Menu"
        title={
          <>
            Ordered slowly, <br />
            <span className="italic text-caramel">sipped slower.</span>
          </>
        }
        intro="Six short chapters — pulled, poured, whisked and baked through the day. Order at the counter; everything is made to order."
      />

      {/* ------------------------------ tabs ------------------------------ */}
      <div className="sticky top-[72px] z-40 border-y border-cream/10 bg-coal/85 backdrop-blur-md">
        <div
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 py-3 md:px-10"
          role="tablist"
          aria-label="Menu categories"
        >
          {CATEGORIES.map((c) => {
            const selected = category === c.id;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "shrink-0 px-4 py-2.5 text-[11px] font-semibold tracking-[0.26em] uppercase transition-colors duration-300",
                  selected ? "bg-cream text-coal" : "text-sand/70 hover:text-cream",
                )}
              >
                {c.label}
                <span className={cn("ml-2 text-[9px]", selected ? "text-coal/60" : "text-mute")}>
                  {MENU[c.id].length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------ list ------------------------------ */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <ul key={category} className="divide-y divide-cream/10">
          {items.map((item, i) => (
            <li key={item.id} className="reveal" style={{ ["--reveal-delay" as string]: `${Math.min(i * 70, 280)}ms` }}>
              <button
                onClick={() => setActive(item)}
                aria-haspopup="dialog"
                className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-4 py-8 text-left sm:grid-cols-[auto_110px_1fr_auto] md:grid-cols-[70px_150px_1fr_auto]"
              >
                <span className="font-display hidden text-3xl text-mute italic sm:block">0{i + 1}</span>
                {item.image && (
                  <span className="relative col-span-2 block h-44 w-full overflow-hidden sm:col-span-1 sm:h-24 sm:w-26 md:h-26 md:w-36">
                    <img
                      src={item.image}
                      alt={item.alt ?? item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-112"
                    />
                    <span className="absolute inset-0 bg-caramel/0 transition-colors duration-500 group-hover:bg-caramel/10" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="font-display text-2xl font-light text-cream transition-colors duration-300 group-hover:text-caramel md:text-[1.7rem]">
                    {item.name}
                  </span>
                  <span className="mt-2 block max-w-xl text-[13.5px] leading-relaxed text-sand/75">{item.desc}</span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-3">
                  <span className="font-display text-xl text-caramel italic md:text-2xl">₹{item.price}</span>
                  <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-mute transition-colors group-hover:text-cream">
                    Details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="reveal mt-14 flex items-start gap-3 border border-cream/10 bg-espresso/60 px-5 py-4 text-[13px] leading-relaxed text-sand/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
          {MENU_NOTE} Prices are in Indian Rupees and include all taxes.
        </p>
      </main>

      {/* ------------------------- detail overlay ------------------------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-coal/80 backdrop-blur-sm sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name} details`}
            onClick={close}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-3xl overflow-hidden border border-cream/15 bg-espresso sm:grid-cols-2"
            >
              <div className="relative h-56 sm:h-auto sm:min-h-[380px]">
                {active.image && (
                  <img src={active.image} alt={active.alt ?? active.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent sm:bg-gradient-to-r" />
              </div>
              <div className="relative flex flex-col p-7 sm:p-9">
                <button
                  onClick={close}
                  aria-label="Close details"
                  className="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-caramel hover:text-caramel"
                >
                  <X className="h-4 w-4" />
                </button>
                <Eyebrow>{CATEGORIES.find((c) => c.id === category)?.label}</Eyebrow>
                <h3 className="font-display mt-4 pr-10 text-3xl leading-tight font-light text-cream sm:text-4xl">
                  {active.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-sand/85">{active.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="mt-auto flex items-end justify-between pt-8">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-mute">Price (sample)</p>
                    <p className="font-display mt-1 text-3xl text-caramel italic">₹{active.price}</p>
                  </div>
                  <p className="max-w-[45%] text-right text-[11px] leading-relaxed text-mute">
                    Order at the counter — no online checkout on this demo.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
