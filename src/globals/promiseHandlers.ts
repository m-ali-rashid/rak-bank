import Geolocation from 'react-native-geolocation-service';
import {
  getIpAddress,
  getMacAddress,
  getSystemName,
  getManufacturer,
  getModel,
} from 'react-native-device-info';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

export const getData = new Promise(function (resolve, reject) {
  try {
    async function getDeviceData() {
      let ip = await getIpAddress();
      let mac = await getMacAddress();
      let operating_system = getSystemName();
      let imei = 'No IMEI info allowed for Apple devices';
      if (getSystemName() === 'Android') {
        const IMEI = require('react-native-imei');
        imei = await IMEI.getImei();
      }
      let device_name = (await getManufacturer()) + ' ' + getModel();
      return {ip, mac, operating_system, imei, device_name};
    }
    resolve(getDeviceData());
  } catch (error) {
    reject(error);
  }
});

export const getLocationData = new Promise(function (resolve, reject) {
  try {
    async function getLocation() {
      let permissions: any = await requestMultiple([
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      ]);
      // const iosPermission =
      //   getSystemName() === 'iOS' &&
      //   permissions['ios.permission.LOCATION_WHEN_IN_USE'] === 'granted';
      // const androidPermission =
      //   getSystemName() === 'android' &&
      //   permissions['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
      //     'granted';
      // if (iosPermission || androidPermission) {}
      Geolocation.getCurrentPosition(
        pos =>
          resolve(
            JSON.parse(
              `{"longitude":${pos.coords.longitude}, "latitude":${pos.coords.latitude}}`,
            ),
          ),

        err => reject(err),
      );
    }
    getLocation();
  } catch (error) {
    reject(error);
  }
});
