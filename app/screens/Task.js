import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';

const mbtileUrl =
  'https://openmaptiles.com/download/WyJiMDJlN2ExZi0xM2YyLTQyYjEtYjRmNC04YzZjMzA0Yjc4ZDciLCItMSIsODQyMV0.XgpR_w.TpsvlbyjIISndgNkTVrkzAfJwhE/osm-2017-07-03-v3.6.1-netherlands_amsterdam.mbtiles?usage=personal';
export const fileLocation = task =>
  FileSystem.documentDirectory + `task-${task.id}.mbtiles`;

class TaskScreen extends React.Component {
  static navigationOptions = {
    title: 'Task'
  };

  state = {
    downloadProgress: 0,
    hasDownload: false
  };

  downloadMap = task => async () => {
    const callback = downloadProgress => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      this.setState({
        downloadProgress: parseInt(progress * 100)
      });
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      mbtileUrl,
      fileLocation(task),
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);
    } catch (e) {
      console.error(e);
    }
  };

  clearDownload = task => async () => {
    await FileSystem.deleteAsync(fileLocation(task));
    this.setState({ downloadProgress: 0, hasDownload: false });
  };

  hasDownload = async task => {
    const { exists } = await FileSystem.getInfoAsync(fileLocation(task));
    this.setState({ hasDownload: exists });
  };

  componentDidMount() {
    // check if it has download and set required state
    this.hasDownload(this.props.navigation.state.params.task);
  }

  render() {
    const {
      navigate,
      state: {
        params: { task }
      }
    } = this.props.navigation;
    const { downloadProgress: progress, hasDownload } = this.state;
    const downloading = progress > 0 && progress !== 100;
    const downloaded = hasDownload || progress === 100;

    return (
      <SafeArea>
        <ScrollView>
          <Inset all="large">
            <Text h4>{task.name}</Text>
            <Stack size="large" />
            <Text>{task.description}</Text>
            <Stack size="large" />
            {!downloaded && (
              <Button
                type="outline"
                onPress={this.downloadMap(task)}
                title={downloading ? `Downloading... ${progress}%` : 'Download'}
              />
            )}
            {downloaded && (
              <Button
                type="outline"
                title="Clear download"
                onPress={this.clearDownload(task)}
              />
            )}
            <Button
              title="Add Observations"
              type="solid"
              onPress={() => navigate('AddObservations', { task })}
            />
          </Inset>
        </ScrollView>
      </SafeArea>
    );
  }
}

export default withNavigation(TaskScreen);

TaskScreen.propTypes = {
  navigation: PropTypes.object
};
