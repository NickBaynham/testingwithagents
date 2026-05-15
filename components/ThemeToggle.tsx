"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "warm";

const themes: ReadonlyArray<{
  value: Theme;
  label: string;
  glyph: string;
}> = [
  { value: "light", label: "Light theme", glyph: "☀" },
  { value: "dark", label: "Dark theme", glyph: "☾" },
  { value: "warm", label: "Warm theme", glyph: "✦" },
];

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "warm";
}

function getClientSnapshot(): Theme {
  const current = document.documentElement.getAttribute("data-theme");
  return isTheme(current) ? current : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    /* localStorage may be unavailable (private mode, embedded contexts) */
  }
}

export function ThemeToggle() {
  const active = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
    >
      {themes.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t.label}
            title={t.label}
            onClick={() => applyTheme(t.value)}
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded text-sm transition-colors " +
              (isActive
                ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]")
            }
          >
            <span aria-hidden suppressHydrationWarning>
              {t.glyph}
            </span>
          </button>
        );
      })}
    </div>
  );
}
