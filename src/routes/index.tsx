import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, X } from "lucide-react";

import heroBackground from "@/assets/hero-background.jpg";
import { DiscordCta, DiscordGlyph } from "@/components/DiscordCta";
// Logo is served from public/ so the static export works on any plain hosting.
const LOGO_SRC = "/aniimo-polska-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aniimo Polska – Polska społeczność graczy Aniimo" },
      {
        name: "description",
        content:
          "Aniimo Polska to polska społeczność graczy Aniimo. Aktualności, kody, wydarzenia, pomoc i Discord dla polskich graczy.",
      },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#7fd7f5" },
      { property: "og:title", content: "Aniimo Polska – Polska społeczność graczy Aniimo" },
      {
        property: "og:description",
        content: "Dołącz do polskiej społeczności Aniimo. Aktualności, kody, wydarzenia, pomoc i wspólna gra.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://aniimo.pl/" },
      { property: "og:locale", content: "pl_PL" },
      { property: "og:site_name", content: "Aniimo Polska" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Aniimo Polska – Polska społeczność graczy Aniimo" },
      {
        name: "twitter:description",
        content: "Dołącz do polskiej społeczności Aniimo. Aktualności, kody, wydarzenia, pomoc i wspólna gra.",
      },
    ],
    links: [{ rel: "canonical", href: "https://aniimo.pl/" }],
  }),
  component: Index,
});

const DISCORD_URL = "https://discord.gg/aniimopl";
const OFFICIAL_URL = "https://www.aniimo.com/";


const navLinks = [
  { label: "Strona główna", href: "/", active: true },
  { label: "Discord", href: DISCORD_URL, external: true },
  { label: "Aniimo", href: OFFICIAL_URL, external: true },
];

function Index() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden text-foreground">
      {/* BACKGROUND — replace src/assets/hero-background.jpg to change the artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
        style={{ backgroundImage: `url(${heroBackground})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-tint/25 via-transparent to-sky-tint/40"
        aria-hidden="true"
      />

      {/* DECORATIVE UI */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-10 top-32 hidden h-24 w-24 rounded-full bg-glow-cyan/40 blur-2xl md:block animate-float-slow" />
        <div className="absolute right-16 top-1/3 hidden h-20 w-20 rounded-full bg-glow-pink/35 blur-2xl md:block animate-float-slower" />
        <div className="absolute left-8 top-1/2 hidden flex-col gap-2 md:flex">
          <span className="block h-px w-16 bg-glow-cyan/70" />
          <span className="block h-px w-10 bg-glow-cyan/50" />
          <span className="block h-px w-6 bg-glow-pink/60" />
        </div>
        <div className="absolute right-10 bottom-28 hidden grid-cols-4 gap-1.5 md:grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-glow-cyan/60" />
          ))}
        </div>
        <span className="absolute left-1/4 top-24 hidden text-glow-cyan/70 md:block animate-float-slow">
          ✕
        </span>
        <span className="absolute right-1/3 bottom-40 hidden text-glow-pink/70 md:block animate-float-slower">
          ✕
        </span>
        <div className="absolute inset-x-0 bottom-16 h-px bg-gradient-to-r from-transparent via-glow-cyan/70 to-transparent" />
      </div>

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-5 py-5 md:px-12 md:py-7">
        {/* LOGO — swap this block for an <img> logo later */}
        <a href="/" className="flex items-center leading-none">
          <img
            src={LOGO_SRC}
            alt="Aniimo Polska"
            className="h-9 w-auto md:h-11"
          />
        </a>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className={`group relative border-r border-white/40 px-6 text-sm font-semibold transition-colors duration-300 last:border-r-0 ${
                link.active ? "text-accent-cyan" : "text-ink hover:text-accent-cyan"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-2 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent-cyan transition-all duration-300 ${
                  link.active ? "w-5" : "w-0 group-hover:w-5"
                }`}
              />
            </a>
          ))}
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="group relative px-6 text-sm font-semibold text-ink transition-colors duration-300 hover:text-accent-cyan"
          >
            O grze
            <span className="absolute -bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-accent-cyan transition-all duration-300 group-hover:w-5" />
          </button>
        </nav>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-gradient-cta px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-glow-cyan transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-cyan-strong md:px-7 md:text-sm"
        >
          DOŁĄCZ DO NAS
        </a>
      </header>

      {/* HERO */}
      <section className="relative z-10 flex h-[calc(100dvh-140px)] flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 rounded-full border border-white/60 bg-white/35 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-ink backdrop-blur-md md:text-xs">
          🇵🇱 POLSKA SPOŁECZNOŚĆ ANIIMO
        </p>

        <h1 className="w-full">
          <img
            src={LOGO_SRC}
            alt="Aniimo Polska"
            className="mx-auto h-auto w-[min(88vw,520px)] drop-shadow-[0_6px_26px_rgba(70,150,205,0.55)]"
          />
        </h1>

        <p className="mt-4 text-lg font-semibold text-ink drop-shadow-sm md:text-2xl">
          Razem odkrywamy Idyll.
        </p>
        <p className="mt-3 max-w-xl text-sm text-ink-soft md:text-base">
          Polska społeczność graczy Aniimo. Poznaj innych Pathfinderów, odkrywaj świat Idyll i bądź
          na bieżąco z najnowszymi informacjami.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <DiscordCta
            href={DISCORD_URL}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-cta px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-glow-cyan sm:w-auto md:text-base"
          >
            <DiscordGlyph className="h-5 w-5 shrink-0" />
            DOŁĄCZ NA DISCORDA
          </DiscordCta>
          <a
            href={OFFICIAL_URL}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-white/70 bg-white/30 px-8 py-3.5 text-sm font-semibold text-ink backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/45 sm:w-auto md:text-base"
          >
            <Globe className="h-5 w-5 text-accent-cyan" />
            OFICJALNA STRONA ANIIMO
          </a>
        </div>

        <div className="mt-7 flex flex-col items-center gap-1 text-[0.7rem] text-ink-soft md:text-xs">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
            <strong className="font-semibold text-ink">Aniimo Polska</strong>
            <span>· Nieoficjalna polska społeczność</span>
          </span>
          <span className="tracking-wide">aniimo.pl • discord.gg/aniimopl</span>
        </div>
      </section>

      {/* BOTTOM */}
      <div className="absolute inset-x-0 bottom-4 z-10 text-center text-[0.65rem] text-ink-soft">
        <p>Aniimo Polska • Nieoficjalna społeczność</p>
        <p className="opacity-70">Aniimo i powiązane znaki towarowe należą do ich właścicieli.</p>
      </div>

      {/* O GRZE — popover */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-ink/20 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="O grze Aniimo"
          onClick={() => setAboutOpen(false)}
        >
          <div
            className="relative max-w-md rounded-3xl border border-white/70 bg-white/70 p-7 text-left shadow-glow-cyan backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="Zamknij"
              className="absolute right-4 top-4 text-ink-soft transition-colors hover:text-accent-cyan"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="font-display text-xl text-ink">O grze</h2>
            <p className="mt-3 text-sm text-ink-soft">
              Aniimo to otwartoświatowa gra przygodowa osadzona w krainie Idyll, w której jako
              Pathfinder poznajesz tajemnicze stworzenia, eksplorujesz rozległe krajobrazy i
              przeżywasz historie razem z innymi graczami.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Aniimo Polska to niezależna, nieoficjalna społeczność polskich graczy.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
