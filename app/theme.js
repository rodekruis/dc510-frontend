import { Platform } from 'react-native';
import { colors } from 'react-native-elements';

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios
    })
  }
};

export default theme;
