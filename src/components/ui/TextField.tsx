import { StyleSheet, TextInput, type KeyboardTypeOptions } from 'react-native';
import type { AppPalette } from '../../theme/tokens';

type TextFieldProps = {
  colors: AppPalette;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  maxLength?: number;
  onSubmitEditing?: () => void;
};

export function TextField({
  colors,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  maxLength,
  onSubmitEditing,
}: TextFieldProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textFaint}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      maxLength={maxLength}
      onSubmitEditing={onSubmitEditing}
      style={createStyles(colors).input}
    />
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    input: {
      minHeight: 46,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSoft,
      color: colors.text,
      paddingHorizontal: 12,
      fontSize: 15,
      letterSpacing: 0,
    },
  });
