import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  const styles = createStyles(colors);
  const content = (
    <View style={[styles.content, !padded && styles.flush]}>{children}</View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/nova-particle-background.png")}
      resizeMode="cover"
      style={styles.gradient}
    >
      <LiveBackground colors={colors} />
      <LinearGradient
        colors={[colors.bg, colors.bgDeep, colors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overlay}
      >
        <View style={styles.gridLineTop} />
        <View style={styles.gridLineMid} />
        <View style={styles.gridLineLeft} />
        <View style={styles.gridLineRight} />
        <View style={styles.glowAmber} />
        <View style={styles.glowBlue} />
        <View style={styles.glowMint} />
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
      </LinearGradient>
    </ImageBackground>
  );
}

const createStyles = (colors: AppPalette) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
      position: "relative",
      overflow: "hidden",
    },
    overlay: {
      flex: 1,
      position: "relative",
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(2, 7, 18, 0.28)"
          : "rgba(240, 246, 255, 0.38)",
    },
    safe: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 30,
    },
    flush: {
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
    gridLineTop: {
      position: "absolute",
      top: 92,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.border,
    },
    gridLineMid: {
      position: "absolute",
      top: 218,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(184, 200, 255, 0.06)"
          : "rgba(25, 35, 67, 0.08)",
    },
    gridLineLeft: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "18%",
      width: 1,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(184, 200, 255, 0.06)"
          : "rgba(25, 35, 67, 0.08)",
    },
    gridLineRight: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: "22%",
      width: 1,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(184, 200, 255, 0.06)"
          : "rgba(25, 35, 67, 0.08)",
    },
    glowAmber: {
      position: "absolute",
      width: 520,
      height: 520,
      borderRadius: 260,
      right: "8%",
      top: -330,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(246,196,83,.12)"
          : "rgba(246,196,83,.18)",
    },
    glowBlue: {
      position: "absolute",
      width: 460,
      height: 460,
      borderRadius: 230,
      left: "20%",
      bottom: -350,
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(71,123,255,.10)"
          : "rgba(71,123,255,.13)",
    },
    glowMint: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: 160,
      right: -220,
      bottom: "12%",
      backgroundColor:
        colors.mode === "dark"
          ? "rgba(70,229,150,.08)"
          : "rgba(70,229,150,.12)",
    },
  });
