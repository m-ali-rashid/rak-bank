import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  Keyboard,
  Alert,
  useWindowDimensions,
} from 'react-native';
import Circles from './components/Circles';
import {colors} from './globals/theme';
import {getData, getLocationData} from './globals/promiseHandlers';

// import {useKeyboard} from '@react-native-community/hooks';

const Header = ({inputOpacity, hideForm}: any) => (
  <View style={styles.headerContainer}>
    <Animated.View style={{opacity: inputOpacity}}>
      <TouchableOpacity onPress={hideForm}>
        <Image
          source={require('./assets/back.png')}
          style={{width: 30, height: 30}}
        />
      </TouchableOpacity>
    </Animated.View>
    <TouchableOpacity style={styles.regButton}>
      <Text style={styles.regButtonText}>Register</Text>
    </TouchableOpacity>
  </View>
);

const BoldText = ({children}: any) => (
  <Text style={{fontWeight: 'bold'}}>{children}</Text>
);

const LoggedInComponent = ({fetchedData, setLoggedIn, hideForm}: any) => {
  const [showSensitiveInfo, setSensitiveInfo] = useState(false);

  let {
    date,
    device_name,
    imei,
    ip,
    latitude,
    longitude,
    mac,
    operating_system,
    password,
    time,
    user,
  } = fetchedData;
  return (
    <>
      <View style={styles.loggedInContainer}>
        <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 10,
            }}>{`${user}'s Details`}</Text>
          <Text style={{fontSize: 16, lineHeight: 22}}>
            Signed In on {date} at {time} from {device_name} running{' '}
            {operating_system} operating system.{'\n'}
            <BoldText>Location:</BoldText> {latitude} Latitude, {longitude}{' '}
            Logitude.{'\n'}
            <BoldText>IP:</BoldText> {ip}
            {'\n'}
            <BoldText>MAC:</BoldText> {mac}
            {'\n'}
            <BoldText>IMEI:</BoldText>{' '}
            {showSensitiveInfo ? imei : '*Sensitive Info*'} {'\n'}
            <BoldText>Password:</BoldText>{' '}
            {showSensitiveInfo ? password : '*Sensitive Info*'}
            {'\n'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#ccc',
              marginBottom: 30,
              padding: 10,
              alignSelf: 'center',
            }}
            onPressIn={() => setSensitiveInfo(true)}
            onPressOut={() => setSensitiveInfo(false)}>
            <Text>Tap to reveal IMEI and Password</Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => {
            setLoggedIn(false);
            hideForm();
          }}>
          {console.log('fetched', fetchedData)}
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default function Home() {
  // const {keyboardHeight, keyboardShown} = useKeyboard();
  const {height, width} = useWindowDimensions();
  const [postData, setPostData] = useState<any>({});
  const [fetchedData, setFetchedData] = useState<any>({});
  const [pressedOnce, setPressedOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const inputRefEmail: any = React.useRef();
  const containerMarginBottom = React.useRef(new Animated.Value(40)).current;
  const inputOpacity = React.useRef(new Animated.Value(0)).current;

  function showForm() {
    inputRefEmail?.current.focus();
    if (pressedOnce) {
      submitForm();
      return;
    }
    Animated.timing(containerMarginBottom, {
      toValue: 220,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputOpacity, {
      toValue: 1,
      duration: 300,
      delay: 300,
      useNativeDriver: false,
    }).start();
    inputRefEmail?.current.focus();
    setPressedOnce(true);
  }

  function hideForm() {
    setPressedOnce(false);
    Animated.timing(containerMarginBottom, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Keyboard.dismiss();
  }

  function getDateTime() {
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    let time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return {date, time};
  }

  async function submitForm() {
    if (!postData.user || !postData.password) {
      Alert.alert('Invalid Credentials', 'User ID or Password not found');
      return;
    }
    hideForm();
    setIsLoading(true);
    let date = getDateTime().date;
    let time = getDateTime().time;
    let postDetails = {...postData, date, time};

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(postDetails),
    };

    await fetch(
      // 'http://localhost:3000/users',
      'https://rak-user-api.herokuapp.com/users',
      requestOptions,
    )
      .then(res => res.json())
      .then(jsonData => setFetchedData(jsonData));
    await Alert.alert(`Welcome ${postData.user}`);
    // setPostData({});
    setIsLoading(false);
    setLoggedIn(true);
  }

  function updatePostData(newData: any) {
    let temp = {...postData};
    temp = {...temp, ...newData};
    setPostData(temp);
  }

  useEffect(() => {
    async function getDetails() {
      let temp: any = {};
      await getLocationData.then((res: any) => (temp = {...temp, ...res}));
      await getData.then((res: any) => (temp = {...temp, ...res}));
      setPostData(temp);
    }
    getDetails();
    return () => {};
  }, []);

  const animStyles = {
    circlesContainer: {
      top: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
      }),
    },
    bodyTexts: {
      marginTop: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
      }),
      opacity: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    },
    formContainer: {marginBottom: containerMarginBottom},
    loginButton: {
      backgroundColor: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.black, colors.gray],
      }),
    },
    subLoginBtnText: {
      opacity: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      top: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -50],
      }),
    },
    forgotIdContainer: {
      opacity: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      top: inputOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
      }),
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[{position: 'absolute'}, animStyles.circlesContainer]}>
        <Circles width={width} height={height} />
      </Animated.View>
      <Header inputOpacity={inputOpacity} hideForm={hideForm} />
      <Animated.View style={[styles.body, animStyles.bodyTexts]}>
        <Text style={styles.heading}>RAKBANK</Text>
        <Text style={styles.desc}>
          Everything you love about Digital Marketing in a smarter, simpler
          design
        </Text>
      </Animated.View>
      {isLoggedIn ? (
        <LoggedInComponent
          fetchedData={fetchedData}
          setLoggedIn={setLoggedIn}
          hideForm={hideForm}
        />
      ) : (
        <Animated.View style={[styles.formContainer, animStyles.formContainer]}>
          <Animated.View
            style={[styles.textInputContainer, {opacity: inputOpacity}]}>
            <View style={[styles.inputWrapper, {marginBottom: 20}]}>
              <TextInput
                ref={inputRefEmail}
                style={styles.input}
                onChangeText={e => updatePostData({user: e})}
                onSubmitEditing={submitForm}
                value={postData.user}
                placeholder="User ID"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={e => updatePostData({password: e})}
                onSubmitEditing={submitForm}
                value={postData.password}
                placeholder="Password"
                secureTextEntry={true}
              />
            </View>
          </Animated.View>
          {isLoading ? (
            <View>
              <Text>Please Wait...</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => showForm()}>
              <Animated.View
                style={[styles.buttonView, animStyles.loginButton]}>
                <Text style={styles.buttonText}>
                  {pressedOnce ? 'Submit' : 'Login with User ID'}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          )}
          <Animated.View
            style={[styles.quickBalance, animStyles.subLoginBtnText]}>
            <Image
              source={require('./assets/FingerPrint.png')}
              style={{width: 30}}
              resizeMode="contain"
            />
            <Text style={{marginLeft: 12, color: colors.black, fontSize: 15}}>
              Quick Balance
            </Text>
          </Animated.View>
          <Animated.View style={animStyles.forgotIdContainer}>
            <Text style={styles.actions}>Forgot User ID | Forgot Password</Text>
            <Text style={styles.actions}>Enable User ID</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgOffWhite,
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  regButton: {
    marginLeft: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.RedMiddle,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  regButtonText: {color: 'white', fontSize: 16},
  body: {paddingHorizontal: 20, marginTop: 30, maxWidth: 300},
  heading: {color: 'white', fontSize: 38, marginBottom: 22},
  desc: {color: 'white', fontSize: 20, lineHeight: 26},
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputWrapper: {padding: 15, backgroundColor: 'white', borderRadius: 10},
  input: {
    height: 55,
    width: '100%',
    backgroundColor: 'white',
    borderColor: colors.yellow,
    borderBottomWidth: 2,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 12,
    zIndex: 20,
  },
  logoutButton: {
    backgroundColor: colors.RedInner,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    borderColor: colors.RedOuter,
    borderWidth: 2,
  },
  buttonView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  actions: {textAlign: 'center', color: colors.black, fontSize: 15},
  quickBalance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
