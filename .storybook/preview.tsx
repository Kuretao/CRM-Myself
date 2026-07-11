import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

const preview: Preview = {
  decorators: [(Story) => <View style={{ minHeight: '100vh', padding: 32, backgroundColor: '#111110' }}><Story /></View>],
  parameters: { layout: 'fullscreen', controls: { expanded: true } },
};

export default preview;
