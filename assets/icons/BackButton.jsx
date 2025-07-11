import Svg, { Path } from 'react-native-svg';

const BackButtonIcon = ({ width = 24, height = 24, color = '#000', strokeWidth = 1.5, ...props }) => (
  <Svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <Path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.00009 12.0002L16.0001 12.0002M11.4999 8.50012C11.4999 8.50012 7.99996 11.0778 7.99995 12.0001C7.99994 12.9225 11.5 15.5001 11.5 15.5001" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default BackButtonIcon;