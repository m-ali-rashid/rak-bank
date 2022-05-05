import React, {useState, useEffect} from 'react';
import {Animated} from 'react-native';
import {colors} from '../globals/theme';
import {useWindowDimensions} from 'react-native';
import {useKeyboard} from '@react-native-community/hooks';

const Circles = ({width, height}: any) => {
  let xValueMiddle = -(width / 2) - 50;
  let yValueMiddle = -(height / 2) + 20;
  let xValueInner = -(width / 2) - 50;
  let yValueInner = -(height / 2) + 30;
  const wobbleMiddle = React.useRef(new Animated.Value(xValueMiddle)).current;
  const wobbleInner = React.useRef(new Animated.Value(xValueInner)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(wobbleMiddle, {
            toValue: xValueMiddle + 20,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(wobbleMiddle, {
            toValue: xValueMiddle,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wobbleInner, {
            toValue: xValueMiddle + 20,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(wobbleInner, {
            toValue: xValueInner,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          width: width * 2,
          height: width * 2,
          backgroundColor: colors.RedOuter,
          borderRadius: width,
          left: -(width / 2) - 20,
          top: -(height / 2) + 40,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: colors.RedMiddle,
          borderRadius: width,
          width: width * 2 - 60,
          height: width * 2 - 20,
          left: wobbleMiddle,
          top: wobbleMiddle.interpolate({
            inputRange: [xValueMiddle, xValueMiddle + 20],
            outputRange: [yValueMiddle + 10, yValueMiddle + 30],
          }),
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: colors.RedInner,
          borderRadius: width,
          width: width * 2 - 140,
          height: width * 2 - 40,
          left: wobbleInner,
          top: wobbleInner.interpolate({
            inputRange: [xValueInner - 30, xValueInner + 20],
            outputRange: [yValueInner + 20, yValueInner - 20],
          }),
        }}
      />
    </Animated.View>
  );
};
export default Circles;
