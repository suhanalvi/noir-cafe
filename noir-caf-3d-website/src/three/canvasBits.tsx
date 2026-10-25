import { Component, type ReactNode } from "react";
import { IMG } from "../lib/site";

/** Error boundary so a WebGL failure degrades to the fallback instead of a blank page. */
export class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    return this.state.crashed ? this.props.fallback : this.props.children;
  }
}

/** Polished non-WebGL visual so the experience still looks intentional. */
export function SceneFallback({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-coal ${tall ? "h-full min-h-[520px]" : "h-full min-h-[420px]"}`}>
      <img
        src={IMG.coffeeDark.blackCupSteam}
        alt="Steam rising from a dark ceramic coffee cup"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/40 to-transparent" />
      <p className="absolute bottom-5 left-5 max-w-xs text-[11px] uppercase tracking-[0.3em] text-sand/80">
        {label} — interactive 3D needs WebGL; showing a still instead.
      </p>
    </div>
  );
}
