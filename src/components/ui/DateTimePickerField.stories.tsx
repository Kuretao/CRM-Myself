import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { palettes } from "../../theme/tokens";
import { DateTimePickerField } from "./DateTimePickerField";

const meta = {
  title: "UI/DateTimePicker",
  component: DateTimePickerField,
  args: {
    colors: palettes.dark,
    label: "Срок и время",
    date: "15.07.2026",
    time: "13:00",
    onChangeDate: () => undefined,
    onChangeTime: () => undefined,
  },
} satisfies Meta<typeof DateTimePickerField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
