import { createElement } from "react";
import type { AppPalette } from "../../theme/tokens";

export function LiveBackground({ colors }: { colors: AppPalette }) {
  const asset =
    colors.mode === "light"
      ? require("../../../assets/nova-light-wave-loop.mp4")
      : require("../../../assets/nova-particle-loop.mp4");
  const src = typeof asset === "string" ? asset : (asset?.uri ?? asset);

  return createElement("video", {
    src,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: colors.mode === "dark" ? 0.9 : 1,
      pointerEvents: "none",
    },
  });
}
