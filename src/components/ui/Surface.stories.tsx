import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native";
import { palettes } from "../../theme/tokens";
import { Surface } from "./Surface";

const meta = {
  title: "UI/Surface",
  component: Surface,
  args: { colors: palettes.dark },
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Glass: Story = {
  args: {
    children: (
      <View style={{ padding: 24, width: 360 }}>
        <Text style={{ color: "#F4F2EC", fontSize: 18, fontWeight: "700" }}>
          Glass surface
        </Text>
        <Text style={{ color: "#AAA7A0", marginTop: 8 }}>
          Базовая поверхность NOVA для карточек и панелей.
        </Text>
      </View>
    ),
  },
};
