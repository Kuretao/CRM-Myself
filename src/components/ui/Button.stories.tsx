import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { palettes } from "../../theme/tokens";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    colors: palettes.dark,
    label: "Добавить операцию",
    onPress: () => undefined,
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Soft: Story = { args: { variant: "soft", label: "Отменить" } };
export const Ghost: Story = { args: { variant: "ghost", label: "Подробнее" } };
