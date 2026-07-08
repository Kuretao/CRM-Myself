import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type TextProps = {
  colors: AppPalette;
  children: ReactNode;
  style?: TextStyle | TextStyle[];
};

export function Title({ colors, children, style }: TextProps) {
  return <Text style={[styles(colors).title, style]}>{children}</Text>;
}

export function Body({ colors, children, style }: TextProps) {
  return <Text style={[styles(colors).body, style]}>{children}</Text>;
}

export function Muted({ colors, children, style }: TextProps) {
  return <Text style={[styles(colors).muted, style]}>{children}</Text>;
}

export function Kicker({ colors, children, style }: TextProps) {
  return <Text style={[styles(colors).kicker, style]}>{children}</Text>;
}

const styles = (colors: AppPalette) =>
  StyleSheet.create({
    title: {
      color: colors.text,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
      letterSpacing: 0,
    },
    body: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 21,
      letterSpacing: 0,
    },
    muted: {
      color: colors.textSoft,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0,
    },
    kicker: {
      color: colors.textFaint,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
  });
