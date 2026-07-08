import type { ThemeName } from '../types/domain';

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
    mode: 'light',
    bg: '#EEF1F8',
    bgDeep: '#DCE3F1',
    surface: 'rgba(255, 255, 255, 0.82)',
    surfaceSolid: '#FFFFFF',
    surfaceSoft: 'rgba(239, 243, 252, 0.86)',
    text: '#111629',
    textSoft: '#68718A',
    textFaint: '#98A1B8',
    border: 'rgba(25, 35, 67, 0.12)',
    borderStrong: 'rgba(25, 35, 67, 0.22)',
    accent: '#735CFF',
    accentSoft: 'rgba(115, 92, 255, 0.16)',
    green: '#39D98A',
    red: '#FF6F87',
    amber: '#FFC65C',
    blue: '#477BFF',
    shadow: 'rgba(19, 26, 52, 0.18)',
    glow: 'rgba(115, 92, 255, 0.28)',
  },
  dark: {
    mode: 'dark',
    bg: '#101936',
    bgDeep: '#1A2D5B',
    surface: 'rgba(34, 46, 86, 0.38)',
    surfaceSolid: '#182443',
    surfaceSoft: 'rgba(79, 99, 158, 0.18)',
    text: '#F7F8FF',
    textSoft: '#B6BDD5',
    textFaint: '#707A9B',
    border: 'rgba(215, 224, 255, 0.16)',
    borderStrong: 'rgba(215, 224, 255, 0.28)',
    accent: '#7A5CFF',
    accentSoft: 'rgba(122, 92, 255, 0.22)',
    green: '#46E596',
    red: '#FF6F87',
    amber: '#FFC65C',
    blue: '#477BFF',
    shadow: 'rgba(0, 0, 0, 0.32)',
    glow: 'rgba(122, 92, 255, 0.48)',
  },
};

export type AppPalette = Palette;

export const getPalette = (themeName: ThemeName): AppPalette => palettes[themeName];

export const layout = {
  pagePadding: 16,
  radius: 8,
  gap: 12,
};
