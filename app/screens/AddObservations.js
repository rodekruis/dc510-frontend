import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import MapView from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import SafeArea from '../components/SafeArea';
import { spacing } from '../constants';

class AddObservationsScreen extends React.Component {
  static navigationOptions = ({
    navigation: {
      popToTop,
      state: { params }
    }
  }) => ({
    title: params.task.name,
    headerRight: (
      <HeaderButtons>
        <Item
          title="Cancel"
          onPress={() =>
            Alert.alert(
              'Are you sure you want to cancel?',
              'Cancelling will discard any observations you have made so far',
              [
                {
                  text: 'No',
                  style: 'cancel'
                },
                { text: 'Yes', onPress: () => popToTop() }
              ],
              { cancelable: false }
            )
          }
        />
      </HeaderButtons>
    )
  });

  cancel = () => {
    console.log('cancelling');
  };

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
    marginVertical: spacing.massive,
    paddingLeft: spacing.massive,
    paddingRight: spacing.massive,
    width: Dimensions.get('window').width
  }
});
