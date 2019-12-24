
import { StyleSheet, Dimensions } from 'react-native';
import variable from "../../native-base-theme/variables/platform";

const { width, height } = Dimensions.get('window');

const themeColor = variable.btnPrimaryBg;

const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: themeColor,
    paddingRight: width * 0.04,
    paddingLeft: width * 0.04,
    margin: 0,
  },
  transparentButtonText: {
    color: themeColor,
  }
});

export default buttonStyles;