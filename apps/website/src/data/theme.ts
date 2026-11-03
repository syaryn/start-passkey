export const THEME_STORAGE_KEY = "pkmfa-color-theme";

export type ThemePreference = "system" | "light" | "dark";

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "システム",
  light: "ライト",
  dark: "ダーク",
};

export const THEME_CYCLE: ThemePreference[] = ["system", "light", "dark"];

export function parseThemePreference(value: string | null): ThemePreference {
  if (value === "light" || value === "dark") {
    return value;
  }
  return "system";
}

export function readStoredThemePreference(): ThemePreference {
  if (typeof localStorage === "undefined") {
    return "system";
  }
  return parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
}

export function applyThemePreference(preference: ThemePreference): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
    localStorage.removeItem(THEME_STORAGE_KEY);
    return;
  }
  root.dataset.theme = preference;
  localStorage.setItem(THEME_STORAGE_KEY, preference);
}

export function cycleThemePreference(current: ThemePreference): ThemePreference {
  const index = THEME_CYCLE.indexOf(current);
  const next = THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
  return next ?? "system";
}

/** Inline in <head> before CSS to reduce wrong-theme flash. */
export function themeBootstrapScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;
}
