import Svg, { Circle, Line, Path } from 'react-native-svg';
import type { AppPalette } from '../../theme/tokens';

type NovaLogoProps = {
  colors: AppPalette;
  size?: number;
};

export function NovaLogo({ colors, size = 44 }: NovaLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      <Circle cx="22" cy="22" r="21" fill={colors.accent} />
      <Circle cx="22" cy="22" r="20.4" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.2" />
      <Path
        d="M13.2 31.2V13.4L30.8 31.2V13.1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="14" y1="13.4" x2="31" y2="30.6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" />
      <Circle cx="31.4" cy="12.8" r="2.2" fill="#FFFFFF" />
    </Svg>
  );
}
