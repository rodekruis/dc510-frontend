import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Camera as CameraExpo } from 'expo-camera';
import { withNavigationFocus } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import uuidv4 from 'uuid/v4';
import { buttonContainerStyle } from './AddObservations';
import Images from '../components/Images';
import SafeArea from '../components/SafeArea';
import { Stack, Inset } from '../components/Spacing';
import { IMAGES_DIR, spacing } from '../constants';

class Camera extends React.Component {
  state = {
    hasPermission: false,
    images: []
  };

  async componentDidMount() {
    const { status } = await CameraExpo.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
    await this.createDirIfNotExists();
  }

  createDirIfNotExists = async () => {
    // create ${IMAGES_DIR} if not exists
    const { exists } = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (exists) return;
    await FileSystem.makeDirectoryAsync(IMAGES_DIR);
  };

  takePhoto = async () => {
    if (!this.camera) return;
    const { task, onImageAdd } = this.props.navigation.state.params;
    try {
      const data = await this.camera.takePictureAsync();
      // add task id to filename so that it becomes easy to recognize
      const image = `Image_task_${task.id}_${uuidv4()}.jpg`;
      // Move from cache to a more permanent location
      await FileSystem.copyAsync({
        from: data.uri,
        to: `${IMAGES_DIR}/${image}`
      });
      this.setState({ images: this.state.images.concat([image]) });
      onImageAdd(image);
    } catch (e) {
      console.log(e.toString());
    }
  };

  render() {
    const { isFocused } = this.props;
    const { hasPermission } = this.state;

    if (!hasPermission) {
      return (
        <Inset all="medium">
          <Text>
            Permission to access camera was denied. Please go to your phone
            settings and give permission in order to add photos to observations.
          </Text>
        </Inset>
      );
    } else if (!isFocused) return null;

    return (
      <SafeArea>
        <CameraExpo
          style={styles.container}
          ref={ref => {
            this.camera = ref;
          }}
          type={CameraExpo.Constants.Type.back}>
          <View style={styles.cameraInner}>
            <View>
              <Images
                items={this.state.images}
                imageStyle={styles.imageStyle}
              />
              <Stack type="small" />
              <Button
                title="Snap"
                style={buttonContainerStyle}
                onPress={this.takePhoto}
              />
            </View>
          </View>
        </CameraExpo>
      </SafeArea>
    );
  }
}

Camera.propTypes = {
  isFocused: PropTypes.bool,
  navigation: PropTypes.object
};

export default withNavigationFocus(Camera);

const styles = StyleSheet.create({
  cameraInner: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  container: {
    flex: 1
  },
  imageStyle: {
    width: 50,
    height: 50,
    marginRight: spacing.small
  }
});
