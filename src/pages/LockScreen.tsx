import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { brand } from '../brand/identity';
import { NovaLogo } from '../components/brand/NovaLogo';
import { Button } from '../components/ui/Button';
import { Screen } from '../components/ui/Screen';
import { Surface } from '../components/ui/Surface';
import { TextField } from '../components/ui/TextField';
import { Body, Kicker, Title } from '../components/ui/Typography';
import type { AppPalette } from '../theme/tokens';

type LockScreenProps = {
  colors: AppPalette;
  pin: string;
  error: string;
  onChangePin: (value: string) => void;
  onSubmit: () => void;
};

export function LockScreen({ colors, pin, error, onChangePin, onSubmit }: LockScreenProps) {
  const styles = createStyles(colors);
  return (
    <Screen colors={colors} scroll={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrap}>
        <Surface colors={colors} style={styles.panel}>
          <View style={styles.mark}>
            <NovaLogo colors={colors} size={62} />
          </View>
          <Kicker colors={colors}>{brand.tagline}</Kicker>
          <Title colors={colors} style={styles.title}>{brand.productName}</Title>
          <Body colors={colors} style={styles.copy}>{brand.lockSubtitle}</Body>
          <TextField
            colors={colors}
            value={pin}
            onChangeText={(value) => onChangePin(value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Код доступа"
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            onSubmitEditing={onSubmit}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Button colors={colors} label="Войти" onPress={onSubmit} />
        </Surface>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    wrap: {
      flex: 1,
      justifyContent: 'center',
      paddingBottom: 24,
    },
    panel: {
      padding: 20,
      gap: 14,
    },
    mark: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 6,
      shadowColor: colors.glow,
      shadowOpacity: 1,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 10 },
    },
    title: {
      textAlign: 'center',
      fontSize: 34,
      lineHeight: 40,
    },
    copy: {
      color: colors.textSoft,
      textAlign: 'center',
      marginBottom: 6,
    },
    error: {
      color: colors.red,
      fontWeight: '800',
      textAlign: 'center',
    },
  });
