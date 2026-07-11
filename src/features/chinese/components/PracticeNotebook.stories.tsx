import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { palettes } from "../../../theme/tokens";
import { PracticeNotebook } from "./PracticeNotebook";

function NotebookStory() {
  const [character, setCharacter] = useState("你");
  return (
    <PracticeNotebook
      colors={palettes.dark}
      character={character}
      onChangeCharacter={setCharacter}
      choices={["你", "好", "学", "中", "国"]}
    />
  );
}

const meta = {
  title: "Chinese/PracticeNotebook",
  component: NotebookStory,
} satisfies Meta<typeof NotebookStory>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
