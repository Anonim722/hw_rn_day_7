import { StyleSheet, View } from 'react-native';

export function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    backgroundColor: '#D1D5DB',
  },
});
