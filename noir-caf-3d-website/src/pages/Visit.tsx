import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowUpRight, CalendarCheck, Check, Clock, Mail, MapPin, Navigation } from "lucide-react";
import Seo from "../components/Seo";
import { PageHero } from "../components/ui";
import { useRevealContainer } from "../lib/hooks";
import { SITE } from "../lib/site";
import { cn } from "../utils/cn";

interface FormState {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

const INITIAL: FormState = { name: "", email: "", date: "", time: "", guests: "2", notes: "" };

const TIME_SLOTS = ["08:00", "09:30", "11:00", "12:30", "14:00", "16:00", "18:00", "19:30", "21:00"];

function validate(f: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (!f.date) {
    errors.date = "Choose a date.";
  } else {
    const d = new Date(f.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime()) || d < today) errors.date = "Date must be today or later.";
  }
  if (!f.time) errors.time = "Pick a time.";
  const g = Number(f.guests);
  if (!Number.isInteger(g) || g < 1 || g > 12) errors.guests = "1–12 guests.";
  if (f.notes.length > 500) errors.notes = "Keep notes under 500 characters.";
  return errors;
}

const inputCls =
  "w-full border border-cream/15 bg-noir px-4 py-3.5 text-sm text-cream placeholder:text-mute/70 transition-colors focus:border-caramel focus:outline-none";
const labelCls = "mb-2 block text-[10px] font-semibold tracking-[0.28em] uppercase text-sand/80";

export default function Visit() {
  const revealRef = useRevealContainer<HTMLDivElement>();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const directionsHref = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.addressLines.join(", "))}`,
    [],
  );

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  return (
    <div ref={revealRef} className="bg-coal">
      <Seo
        title="Visit"
        description="Find NOIR CAFÉ — sample address, opening hours, contact email and a reservation inquiry form. Editable demo business details."
        path="/visit"
      />

      <PageHero
        eyebrow="Visit"
        title={
          <>
            Come when the light <br />
            <span className="italic text-caramel">goes amber.</span>
          </>
        }
        intro="Everything on this page is sample business content — swap in the café's real address, hours and contact channels before launch."
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:px-10 lg:grid-cols-2">
        {/* ------------------------------ info ------------------------------ */}
        <div className="space-y-6">
          <div className="reveal border border-cream/12 bg-noir p-7 md:p-9">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
              <MapPin className="h-4 w-4 text-caramel" /> Address
            </p>
            <address className="font-display mt-5 text-2xl leading-snug font-light text-cream not-italic">
              {SITE.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-mute">Sample address — fully editable</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={directionsHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 bg-cream px-6 py-3.5 text-[10px] font-semibold tracking-[0.3em] uppercase text-coal transition-colors hover:bg-caramel"
              >
                <Navigation className="h-3.5 w-3.5" /> Get directions
              </a>
            </div>
          </div>

          <div className="reveal border border-cream/12 bg-noir p-7 md:p-9">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
              <Clock className="h-4 w-4 text-caramel" /> Opening hours
            </p>
            <dl className="mt-5 divide-y divide-cream/10">
              {SITE.hours.map((h) => (
                <div key={h.days} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-sm text-sand/85">{h.days}</dt>
                  <dd className="font-display text-base text-cream italic">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-mute">Sample hours — fully editable</p>
          </div>

          <div className="reveal border border-cream/12 bg-noir p-7 md:p-9">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
              <Mail className="h-4 w-4 text-caramel" /> Contact
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="font-display mt-5 inline-block text-2xl font-light text-cream italic transition-colors hover:text-caramel"
            >
              {SITE.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 border border-cream/15 px-4 py-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase text-sand transition-colors hover:border-caramel hover:text-caramel"
                >
                  {s.label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-mute">
              Demo links point to the platforms — add the café's handles before launch.
            </p>
          </div>

          {/* map slot */}
          <div className="reveal relative overflow-hidden border border-dashed border-cream/20 bg-espresso/40 p-7 md:p-9">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
              <MapPin className="h-4 w-4 text-caramel" /> Map
            </p>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-sand/75">
              No map is embedded — by design. Once a real street address is supplied in the site configuration, an
              interactive map renders here. The directions button above works today.
            </p>
          </div>
        </div>

        {/* ---------------------------- inquiry form ---------------------------- */}
        <div className="reveal border border-cream/12 bg-noir p-7 md:p-10 lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] uppercase text-cream">
            <CalendarCheck className="h-4 w-4 text-caramel" /> Reservation inquiry
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
                role="status"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-caramel bg-caramel/10">
                  <Check className="h-6 w-6 text-caramel" />
                </div>
                <h2 className="font-display mt-6 text-3xl font-light text-cream italic">
                  Looks good — but nothing was sent.
                </h2>
                <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-sand/85">
                  This demo form validates locally only; it has no backend or form service connected, so your inquiry
                  did not reach the café. To actually book, email us directly:
                </p>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                    `Table inquiry — ${form.date} at ${form.time} (${form.guests} guests)`,
                  )}&body=${encodeURIComponent(
                    `Name: ${form.name}\nEmail: ${form.email}\nDate: ${form.date}\nTime: ${form.time}\nGuests: ${form.guests}\nNotes: ${form.notes || "—"}`,
                  )}`}
                  className="mt-7 inline-flex items-center gap-3 bg-cream px-6 py-4 text-[10px] font-semibold tracking-[0.3em] uppercase text-coal transition-colors hover:bg-caramel"
                >
                  Send as email instead <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(INITIAL);
                  }}
                  className="ml-0 mt-6 block text-[11px] tracking-[0.28em] uppercase text-sand/70 underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  Fill the form again
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mt-8 space-y-5"
                noValidate
                onSubmit={onSubmit}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="v-name" className={labelCls}>
                      Name
                    </label>
                    <input id="v-name" className={cn(inputCls, errors.name && "border-burnt")} value={form.name} onChange={set("name")} placeholder="Asha Rao" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "v-name-err" : undefined} />
                    {errors.name && <p id="v-name-err" className="mt-2 text-[11px] text-burnt">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="v-email" className={labelCls}>
                      Email
                    </label>
                    <input id="v-email" type="email" className={cn(inputCls, errors.email && "border-burnt")} value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "v-email-err" : undefined} />
                    {errors.email && <p id="v-email-err" className="mt-2 text-[11px] text-burnt">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="v-date" className={labelCls}>
                      Date
                    </label>
                    <input id="v-date" type="date" className={cn(inputCls, "[color-scheme:dark]", errors.date && "border-burnt")} value={form.date} onChange={set("date")} aria-invalid={!!errors.date} aria-describedby={errors.date ? "v-date-err" : undefined} />
                    {errors.date && <p id="v-date-err" className="mt-2 text-[11px] text-burnt">{errors.date}</p>}
                  </div>
                  <div>
                    <label htmlFor="v-time" className={labelCls}>
                      Time
                    </label>
                    <select id="v-time" className={cn(inputCls, errors.time && "border-burnt")} value={form.time} onChange={set("time")} aria-invalid={!!errors.time} aria-describedby={errors.time ? "v-time-err" : undefined}>
                      <option value="">Select</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.time && <p id="v-time-err" className="mt-2 text-[11px] text-burnt">{errors.time}</p>}
                  </div>
                  <div>
                    <label htmlFor="v-guests" className={labelCls}>
                      Guests
                    </label>
                    <input id="v-guests" type="number" min={1} max={12} className={cn(inputCls, errors.guests && "border-burnt")} value={form.guests} onChange={set("guests")} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "v-guests-err" : undefined} />
                    {errors.guests && <p id="v-guests-err" className="mt-2 text-[11px] text-burnt">{errors.guests}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="v-notes" className={labelCls}>
                    Notes <span className="text-mute normal-case">(optional)</span>
                  </label>
                  <textarea id="v-notes" rows={3} className={cn(inputCls, "resize-none", errors.notes && "border-burnt")} value={form.notes} onChange={set("notes")} placeholder="Window seat, a quiet corner, a cake…" aria-invalid={!!errors.notes} aria-describedby={errors.notes ? "v-notes-err" : undefined} />
                  {errors.notes && <p id="v-notes-err" className="mt-2 text-[11px] text-burnt">{errors.notes}</p>}
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-3 bg-cream px-7 py-4 text-[11px] font-semibold tracking-[0.32em] uppercase text-coal transition-colors hover:bg-caramel"
                >
                  Check request <Check className="h-4 w-4" />
                </button>

                <p className="flex items-start gap-3 border border-cream/10 bg-espresso/50 px-4 py-3.5 text-[11.5px] leading-relaxed text-sand/75">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel" />
                  Demo only: this form validates in your browser and sends nothing. Connect a form service or backend
                  to deliver real inquiries.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
