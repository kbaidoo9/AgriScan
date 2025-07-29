import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainStackNavigator from "./Navigations/MainStackNavigator";
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {

  return (
    <SafeAreaProvider style={styles.root}>
      <PaperProvider> 
    <MainStackNavigator />
    </PaperProvider>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  // root: {
  //   flex: 1,
  //   backgroundColor: "#ffff",
  // },
});

export default App;