import React, { Component } from 'react';
import { AppRegistry, CameraRoll, Dimensions, View, StyleSheet } from 'react-native';
import Camera from 'react-native-camera';
// import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';

import { awsConfig } from './aws.config';


class CameraApp extends Component {
  constructor() {
    super();
    this.takePicture = this.takePicture.bind(this);
  }

  takePicture() {
    this.camera.capture()
      .then((data) => {
        const file = {
          uri: data.path,
          name: 'photo.jpg',
          type: 'image/jpeg'
        };

        const options = awsConfig

        RNS3.put(file, options).then(response => {
          if (response.status !== 201) {
            throw new Error('Failed to upload image to S3', response);
          }
          console.log('*** BODY ***', response.body);
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.cameraContainer}
          aspect={Camera.constants.Aspect.fill}
          captureAudio={false}
        />
        <Button
          name="ios-camera-outline"
          size={60}
          backgroundColor="transparent"
          style={{ justifyContent: 'center' }}
          onPress={this.takePicture}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  preview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width
  },
  cameraContainer: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    backgroundColor: 'salmon'
  }
});

export default App
