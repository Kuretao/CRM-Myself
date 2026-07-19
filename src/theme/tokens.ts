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
    bg: "#F1F3F5",
    bgDeep: "#E4E8EC",
    surface: "rgba(250, 251, 252, 0.74)",
    surfaceSolid: "#F8F9FA",
    surfaceSoft: "rgba(235, 239, 242, 0.76)",
    text: "#171A1F",
    textSoft: "#5F6873",
    textFaint: "#9098A2",
    border: "rgba(24, 28, 34, 0.11)",
    borderStrong: "rgba(24, 28, 34, 0.20)",
    accent: "#66829D",
    accentSoft: "rgba(102, 130, 157, 0.15)",
    green: "#4F9077",
    red: "#B85E67",
    amber: "#B0894E",
    blue: "#637D9B",
    shadow: "rgba(27, 32, 38, 0.14)",
    glow: "rgba(102, 130, 157, 0.18)",
  },
  dark: {
    mode: "dark",
    bg: "#0C1016",
    bgDeep: "#070A0F",
    surface: "rgba(19, 24, 31, 0.68)",
    surfaceSolid: "#171C23",
    surfaceSoft: "rgba(31, 38, 47, 0.64)",
    text: "#F2F4F7",
    textSoft: "#A7B0BA",
    textFaint: "#707A86",
    border: "rgba(225, 232, 240, 0.11)",
    borderStrong: "rgba(225, 232, 240, 0.20)",
    accent: "#91AFC8",
    accentSoft: "rgba(145, 175, 200, 0.16)",
    green: "#6CB194",
    red: "#D57982",
    amber: "#C5A269",
    blue: "#819CB8",
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
