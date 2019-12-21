import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import SafeArea from '../components/SafeArea';
import { Inset, Stack } from '../components/Spacing';

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
          <Inset all="medium">
            <Text h4>{task.name}</Text>
            <Stack size="medium" />
            <Text>{task.description}</Text>
            <Stack size="medium" />
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
