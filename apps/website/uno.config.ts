import presetIcons from "@unocss/preset-icons";
import { defineConfig } from "unocss";

/** Layout utilities; icons via @unocss/preset-icons. Visual design follows DADS CSS. */
export default defineConfig({
  presets: [
    presetIcons({
      scale: 1,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "-0.125em",
      },
    }),
  ],
  shortcuts: {
    container: "max-w-5xl mx-auto w-full",
    "mb-section": "mb-8",
  },
});
