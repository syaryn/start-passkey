import { describe, expect, it } from "vite-plus/test";
import { cycleThemePreference, parseThemePreference, THEME_CYCLE } from "../src/data/theme.ts";

describe("theme preference", () => {
  it("parses stored values", () => {
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference(null)).toBe("system");
  });

  it("cycles system → light → dark → system", () => {
    expect(cycleThemePreference("system")).toBe("light");
    expect(cycleThemePreference("light")).toBe("dark");
    expect(cycleThemePreference("dark")).toBe("system");
    expect(THEME_CYCLE).toEqual(["system", "light", "dark"]);
  });
});
