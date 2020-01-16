import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';
import { fontSize } from '../constants';

class TaskScreen extends React.Component {
  static navigationOptions = {
    title: 'Task'
  };

  render() {
    const {
      navigate,
      state: {
        params: { task }
      }
    } = this.props.navigation;

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

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: fontSize.xlarge
  },
  meta: {
    color: '#777' // @todo use theme
  }
});
