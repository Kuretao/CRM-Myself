import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet } from "react-native";
import type { AppPalette } from "../../theme/tokens";

export function LiveBackground({ colors }: { colors: AppPalette }) {
  const player = useVideoPlayer(
    require("../../../assets/nova-particle-loop.mp4"),
    (instance) => {
      instance.loop = true;
      instance.muted = true;
      instance.play();
    },
  );

  return (
    <VideoView
      player={player}
      style={[styles.video, colors.mode === "light" && styles.light]}
      contentFit="cover"
      nativeControls={false}
      surfaceType="textureView"
    />
  );
}

const styles = StyleSheet.create({
  video: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.9,
  },
  light: { opacity: 0.58 },
});
