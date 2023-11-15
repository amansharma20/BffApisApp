import { useNavigation } from '@react-navigation/native';
import { useIsUserLoggedIn } from './useIsUserLoggedIn';
import { useCallback, useRef } from 'react';
import DynamicSnapPointBottomSheet from '@/components/bottomsheets/DynamicSnapPointBottomSheet';
import LoginScreen from '@/screens/auth/LoginScreen';

export const useAuthRoute = () => {
  const bottomSheetRef = useRef(null);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const navigation = useNavigation();
  const getAuthRoute = useCallback(
    (screenToNaviagte, props) => {
      if (isUserLoggedIn) {
        navigation.navigate(screenToNaviagte, props);
      } else {
        navigation.navigate('LoginScreen');
      }
    },
    [isUserLoggedIn],
  );

  return { getAuthRoute };
};
