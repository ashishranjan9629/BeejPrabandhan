import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {BallIndicator} from 'react-native-indicators';
import Colors from './Colors';
import PropTypes from 'prop-types';
import { moderateScale } from './responsiveSize';

const LoadingComponent = () => {
  return (
    <View style={styles.loaderContainer}>
      <BallIndicator color={Colors.greenColor} size={moderateScale(40)} />
    </View>
  );
};

const Loader = ({isLoading}) => {
  if (isLoading) {
    return (
      <Modal visible={isLoading} transparent={true} statusBarTranslucent={true}>
        <LoadingComponent />
      </Modal>
    );
  }
  return null;
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    // borderWidth: moderateScale(2),
    // borderColor: Colors.lightBackground,
    position: 'absolute',
    top: '45%',
    width: '80%',
    alignSelf: 'center',
    // padding: moderateScale(10),
    // backgroundColor: Colors.lightBackground,
    // borderRadius: moderateScale(20),
    // elevation: moderateScale(5),
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.25,
    // shadowRadius: 1,
  },
});
