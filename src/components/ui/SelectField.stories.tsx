import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { palettes } from "../../theme/tokens";
import { SelectField } from "./SelectField";

const meta = {
  title: "UI/SelectField",
  component: SelectField,
  args: {
    colors: palettes.dark,
    label: "Приоритет",
    value: "medium",
    onChange: () => undefined,
    options: [
      { label: "Низкий", value: "low" },
      { label: "Обычный", value: "medium" },
      { label: "Высокий", value: "high", color: palettes.dark.red },
    ],
  },
} satisfies Meta<typeof SelectField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
