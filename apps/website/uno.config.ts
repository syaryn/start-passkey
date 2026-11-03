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
    /* DADS content max 1120px (70rem @ 16px) */
    container: "max-w-[70rem] mx-auto w-full",
    "mb-section": "mb-8",
  },
});
