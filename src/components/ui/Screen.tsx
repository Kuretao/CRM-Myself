import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import type { AppPalette } from "../../theme/tokens";
import { LiveBackground } from "./LiveBackground";

type ScreenProps = {
  colors: AppPalette;
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({
  colors,
  children,
  scroll = true,
  padded = true,
}: ScreenProps) {
  const content = (
    <View style={[styles.content, !padded && styles.flush]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <LiveBackground colors={colors} />
      <SafeAreaView style={styles.safe}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  flush: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
});
