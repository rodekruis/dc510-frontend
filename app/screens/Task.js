import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';
import { fontSize } from '../constants';

const MBTILES_DIR = FileSystem.documentDirectory;
export const mbtiles = task => MBTILES_DIR + `task-${task.id}.mbtiles`;

const initialState = {
  downloadProgress: 0,
  hasDownload: false
};

class TaskScreen extends React.Component {
  state = {
    ...initialState
  };

  static navigationOptions = {
    title: 'Task'
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
      task.mbtilesUrl,
      mbtiles(task),
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
    try {
      await Promise.all([FileSystem.deleteAsync(mbtiles(task))]);
    } catch (e) {
      console.log(e.toString());
    }
    this.setState({ ...initialState });
  };

  async componentDidMount() {
    const { task } = this.props.navigation.state.params;
    // check if it has downloaded and unzipped required files/directories
    const { exists: hasDownload } = await FileSystem.getInfoAsync(
      mbtiles(task)
    );
    this.setState({ hasDownload });
  }

  render() {
    const {
      navigate,
      state: {
        params: { task }
      }
    } = this.props.navigation;
    const { downloadProgress, hasDownload } = this.state;
    const downloading = downloadProgress > 0 && downloadProgress !== 100;
    const downloaded = hasDownload || downloadProgress === 100;

    return (
      <SafeArea>
        <ScrollView>
          <Inset all="large">
            <Text style={styles.title}>{task.name}</Text>
            <Stack size="large" />
            <Text style={styles.meta}>
              {moment(task.updatedAt).fromNow()} by {task.createdBy.name}
            </Text>
            <Stack size="large" />
            <Text>{task.description}</Text>
            <Stack size="large" />
            {task.mbtilesUrl.length > 0 && !downloaded && (
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
            {downloaded && (
              <Button
                type="outline"
                title="Clear download"
                onPress={this.clearDownload(task)}
              />
            )}
            <Stack size="large" />
            <Button
              title="Add Observations"
              type="solid"
              disabled={task.mbtilesUrl.length > 0 && !downloaded}
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

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: fontSize.xlarge
  },
  meta: {
    color: '#777' // @todo use theme
  }
});
