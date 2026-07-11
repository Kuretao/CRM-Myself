import type { ThemeName } from "../types/domain";

type Palette = {
  mode: ThemeName;
  bg: string;
  bgDeep: string;
  surface: string;
  surfaceSolid: string;
  surfaceSoft: string;
  text: string;
  textSoft: string;
  textFaint: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentSoft: string;
  green: string;
  red: string;
  amber: string;
  blue: string;
  shadow: string;
  glow: string;
};

export const palettes: Record<ThemeName, Palette> = {
  light: {
    mode: "light",
    bg: "#EEF1F8",
    bgDeep: "#DCE3F1",
    surface: "rgba(255, 255, 255, 0.82)",
    surfaceSolid: "#FFFFFF",
    surfaceSoft: "rgba(239, 243, 252, 0.86)",
    text: "#111629",
    textSoft: "#68718A",
    textFaint: "#98A1B8",
    border: "rgba(25, 35, 67, 0.12)",
    borderStrong: "rgba(25, 35, 67, 0.22)",
    accent: "#4DA3FF",
    accentSoft: "rgba(77, 163, 255, 0.18)",
    green: "#39D98A",
    red: "#FF6F87",
    amber: "#FFC65C",
    blue: "#477BFF",
    shadow: "rgba(19, 26, 52, 0.18)",
    glow: "rgba(115, 92, 255, 0.28)",
  },
  dark: {
    mode: "dark",
    bg: "rgba(3, 8, 20, 0.22)",
    bgDeep: "rgba(0, 3, 12, 0.36)",
    surface: "rgba(9, 18, 39, 0.54)",
    surfaceSolid: "rgba(20, 38, 72, 0.64)",
    surfaceSoft: "rgba(13, 28, 58, 0.38)",
    text: "#F4F8FF",
    textSoft: "#AABBD4",
    textFaint: "#667B9B",
    border: "rgba(184, 215, 255, 0.13)",
    borderStrong: "rgba(184, 215, 255, 0.24)",
    accent: "#56B4FF",
    accentSoft: "rgba(86, 180, 255, 0.17)",
    green: "#46E596",
    red: "#FF6F87",
    amber: "#FFC65C",
    blue: "#6677FF",
    shadow: "rgba(0, 0, 0, 0.32)",
    glow: "rgba(56, 149, 255, 0.28)",
  },
};

export type AppPalette = Palette;

export const getPalette = (themeName: ThemeName): AppPalette =>
  palettes[themeName];

export const layout = {
  pagePadding: 16,
  radius: 8,
  gap: 12,
};
