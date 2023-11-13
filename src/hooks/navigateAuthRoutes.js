import { useNavigation } from '@react-navigation/native';
import { useIsUserLoggedIn } from './useIsUserLoggedIn';
const navigateAuthRoutes = (screenToNavigate, props) => {
  const navigation = useNavigation();
  const { isUserLoggedIn } = useIsUserLoggedIn();
  if (isUserLoggedIn) {
    navigation.navigate(screenToNavigate, props);
  } else {
    navigation.navigate('LoginScreen');
  }
};
export default navigateAuthRoutes;
