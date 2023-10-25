/* eslint-disable react/require-default-props */
import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { theme } from '../../atoms';
import { useNavigation } from '@react-navigation/native';
import { GoBackIcon } from '../../assets/svgs';

interface ButtonProps {
  onPress?: () => void;
}

const GoBackButton: React.FC<ButtonProps> = ({ onPress }) => {
  const navigation = useNavigation();
  function goBack() {
    navigation.goBack();
  }

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={onPress || goBack}
    >
      <GoBackIcon />
    </TouchableOpacity>
  );
};

export default GoBackButton;

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: theme.spacing.backButtonPadding,
    width: 30,
  },
});
