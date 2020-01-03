import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';
import { unzip, subscribe } from 'react-native-zip-archive';

const downloadUrl =
  'https://dl.dropboxusercontent.com/s/a389a9djp4jvapu/tiles1.zip?dl=0';

const unprefixedDir = path => `/${path.replace(/^file:\/\/\//g, '')}`;
const TILES_DIR = FileSystem.documentDirectory;
export const tilesDir = task => TILES_DIR + `task-${task.id}`;
export const tilesPath = task => `${tilesDir(task)}/tiles`;
export const zipFilePath = task => `${tilesDir(task)}.zip`;

const initialState = {
  downloadProgress: 0,
  hasDownload: false,
  zipProgress: 0,
  hasUnzipped: false
};

class TaskScreen extends React.Component {
  static navigationOptions = {
    title: 'Task'
  };

  state = {
    ...initialState
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
      downloadUrl,
      zipFilePath(task),
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);

      // RNFS takes unprefixed path
      // Expo Filesystem uses file:/// prefix where as RNFS used by react-native-unzip uses /Path/to/file
      // https://github.com/mockingbot/react-native-zip-archive/issues/152#issuecomment-547356873

      const path = await unzip(
        unprefixedDir(uri), // source .zip file
        unprefixedDir(tilesDir(task)) // target task-{id}
      );
      console.log('Unzipped to path', path);
      await FileSystem.deleteAsync(uri); // .zip file
      console.log(`Removed zip file ${uri}`);
    } catch (e) {
      console.error(e);
    }
  };

  clearDownload = task => async () => {
    try {
      await Promise.all([
        FileSystem.deleteAsync(tilesDir(task)),
        FileSystem.deleteAsync(zipFilePath(task))
      ]);
    } catch (e) {
      console.log(e.toString());
    }
    this.setState({ ...initialState });
  };

  check = async task => {
    const { exists: hasDownload } = await FileSystem.getInfoAsync(
      zipFilePath(task)
    );
    const { exists: hasUnzipped } = await FileSystem.getInfoAsync(
      tilesPath(task)
    );
    this.setState({ hasDownload, hasUnzipped });
  };

  componentDidMount() {
    // check if it has downloaded and unzipped required files/directories
    this.check(this.props.navigation.state.params.task);
    this.zipProgress = subscribe(({ progress }) => {
      this.setState({ zipProgress: parseInt(progress * 100) });
    });
  }

  componentWillUnmount() {
    this.zipProgress.remove();
  }

  render() {
    const {
      navigate,
      state: {
        params: { task }
      }
    } = this.props.navigation;
    const {
      downloadProgress,
      hasDownload,
      zipProgress,
      hasUnzipped
    } = this.state;
    const downloading = downloadProgress > 0 && downloadProgress !== 100;
    const downloaded = hasDownload || downloadProgress === 100;
    const unzipped = hasUnzipped || zipProgress === 100;

    return (
      <SafeArea>
        <ScrollView>
          <Inset all="large">
            <Text h4>{task.name}</Text>
            <Stack size="large" />
            <Text>{task.description}</Text>
            <Stack size="large" />
            {!unzipped && !downloaded && (
              <Button
                type="outline"
                onPress={this.downloadMap(task)}
                title={
                  downloading
                    ? `Downloading... ${downloadProgress}%`
                    : 'Download'
                }
              />
            )}
            {(downloaded || unzipped) && (
              <Button
                type="outline"
                title={
                  downloaded && !unzipped
                    ? `Unzipping...${zipProgress}%`
                    : 'Clear download'
                }
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
