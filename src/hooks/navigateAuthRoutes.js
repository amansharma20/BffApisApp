const customHook = (isUserLoggedIn, navigation, screenToNaviagte, props) => {
  if (isUserLoggedIn) {
    return navigation.navigate(screenToNaviagte, props);
  } else {
    return navigation.navigate('LoginScreen');
  }
};
export default customHook;
