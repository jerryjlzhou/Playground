import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const takePhoto = (onResult) => {
  launchCamera({mediaType: 'photo'}, (response) => {
    if (!response.didCancel && !response.errorCode) {
      onResult && onResult(response.assets[0]);
    }
  });
};

export const uploadImage = (onResult) => {
  launchImageLibrary({mediaType: 'photo'}, (response) => {
    if (!response.didCancel && !response.errorCode) {
      onResult && onResult(response.assets[0]);
    }
  });
};
