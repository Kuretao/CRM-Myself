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
    bg: '#F4F1EA',
    bgDeep: '#E9E4D8',
    surface: 'rgba(255, 255, 255, 0.9)',
    surfaceSolid: '#FFFFFF',
    surfaceSoft: '#F4F3EE',
    text: '#181A20',
    textSoft: '#626672',
    textFaint: '#9498A4',
    border: 'rgba(28, 31, 42, 0.12)',
    borderStrong: 'rgba(28, 31, 42, 0.22)',
    accent: '#6F6AF8',
    accentSoft: 'rgba(111, 106, 248, 0.14)',
    green: '#34A66F',
    red: '#D95D63',
    amber: '#D59A35',
    blue: '#4B8DDB',
    shadow: 'rgba(20, 21, 30, 0.16)',
    glow: 'rgba(111, 106, 248, 0.16)',
  },
  dark: {
    mode: 'dark',
    bg: '#030512',
    bgDeep: '#080A1B',
    surface: 'rgba(17, 19, 36, 0.82)',
    surfaceSolid: '#111324',
    surfaceSoft: '#171A2E',
    text: '#F2F4FF',
    textSoft: '#A6ABC2',
    textFaint: '#6E738A',
    border: 'rgba(255, 255, 255, 0.09)',
    borderStrong: 'rgba(255, 255, 255, 0.16)',
    accent: '#8D86FF',
    accentSoft: 'rgba(141, 134, 255, 0.18)',
    green: '#72D39A',
    red: '#FF7D85',
    amber: '#E9B969',
    blue: '#86A9FF',
    shadow: 'rgba(0, 0, 0, 0.42)',
    glow: 'rgba(93, 96, 239, 0.35)',
  },
};

export type AppPalette = Palette;

export const getPalette = (themeName: ThemeName): AppPalette => palettes[themeName];

export const layout = {
  pagePadding: 16,
  radius: 8,
  gap: 12,
};
