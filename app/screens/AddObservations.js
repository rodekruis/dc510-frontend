import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import MapView from 'react-native-maps';
import SafeArea from '../components/SafeArea';
import { spacing } from '../constants';

class AddObservationsScreen extends React.Component {
  static navigationOptions = ({
    navigation: {
      state: { params }
    }
  }) => ({
    title: params.task.name
  });

  render() {
    const { popToTop } = this.props.navigation;

    return (
      <SafeArea>
        <View style={styles.container}>
          <MapView style={styles.mapStyle} />
          <View style={styles.buttonContainer}>
            <Button title="Finish" type="solid" onPress={() => popToTop()} />
          </View>
        </View>
      </SafeArea>
    );
  }
}

export default withNavigation(AddObservationsScreen);

AddObservationsScreen.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: spacing.massive,
    backgroundColor: 'transparent'
  }
});
