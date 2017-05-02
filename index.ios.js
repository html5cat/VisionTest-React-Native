import React, { Component } from 'react';
import { AppRegistry, CameraRoll, Dimensions, View, StyleSheet } from 'react-native';
import Camera from 'react-native-camera';
import { Button } from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';


class VisionTest extends Component {
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

        const options = {
          keyPrefix: 'photos/',
          bucket: 'html5cat-vision-test',
          region: 'us-west-2',
          accessKey: 'AKIAJ2J7QAZY3JUJYTZA',
          secretKey: '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',
          successActionStatus: 201
        }

        RNS3.put(file, options)
        .progress((e) => console.log(e.loaded / e.total))
        .then(response => {
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
  cameraContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'salmon'
  }
});

AppRegistry.registerComponent('VisionTest', () => VisionTest);
