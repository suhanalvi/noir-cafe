import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Coffee } from "lucide-react";
import { ROUTES } from "../lib/site";
import { cn } from "../utils/cn";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled && !open ? "border-b border-cream/10 bg-coal/80 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10" aria-label="Main">
          <Link to="/" className="group flex items-baseline gap-2" aria-label="NOIR CAFÉ — home">
            <span className="font-display text-[26px] leading-none font-medium tracking-tight text-cream italic">
              Noir
            </span>
            <span className="text-[10px] font-semibold tracking-[0.5em] text-caramel uppercase">Café</span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <NavLink
                  to={r.path}
                  className={({ isActive }) =>
                    cn(
                      "nav-link text-[11px] font-medium tracking-[0.28em] uppercase transition-colors",
                      isActive ? "is-active text-cream" : "text-sand/70 hover:text-cream",
                    )
                  }
                >
                  {r.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link
              to="/visit"
              className="hidden border border-cream/20 px-5 py-2.5 text-[10px] font-semibold tracking-[0.32em] uppercase text-cream transition-colors duration-400 hover:border-caramel hover:text-caramel md:inline-flex"
            >
              Book a table
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-caramel lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-coal/97 backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <ul className="space-y-2 px-8">
              {ROUTES.map((r, i) => (
                <motion.li
                  key={r.path}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={r.path}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-4 py-3",
                        isActive ? "text-caramel" : "text-cream",
                      )
                    }
                  >
                    <span className="text-[10px] tracking-[0.3em] text-mute">0{i + 1}</span>
                    <span className="font-display text-4xl font-light italic">{r.label}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-12 flex items-center gap-3 px-8 text-[11px] tracking-[0.3em] uppercase text-sand/60"
            >
              <Coffee className="h-4 w-4 text-caramel" />
              Slow mornings · Bold flavours
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
