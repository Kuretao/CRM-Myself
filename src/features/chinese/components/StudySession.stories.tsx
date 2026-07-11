import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { palettes } from "../../../theme/tokens";
import { vocabulary } from "../data/course";
import { StudySession } from "./StudySession";

const meta = {
  title: "Chinese/StudySession",
  component: StudySession,
  args: {
    colors: palettes.dark,
    words: vocabulary.slice(0, 10),
    mastered: ["hello", "i"],
    onResult: () => undefined,
  },
} satisfies Meta<typeof StudySession>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
