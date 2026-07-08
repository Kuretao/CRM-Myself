import { StyleSheet, View } from 'react-native';
import type { AppPalette } from '../../theme/tokens';
import { Muted, Title } from './Typography';

type SectionHeaderProps = {
  colors: AppPalette;
  title: string;
  subtitle: string;
};

export function SectionHeader({ colors, title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Title colors={colors} style={styles.title}>{title}</Title>
      <Muted colors={colors} style={styles.subtitle}>{subtitle}</Muted>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 19,
    lineHeight: 25,
  },
  subtitle: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
