import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import MapView, { Marker, Callout } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import SafeArea from '../components/SafeArea';
import { spacing, baseMap } from '../constants';

// @todo
// If offline, load from FileSystem
const urlTemplate = `${baseMap}/{z}/{x}/{y}.png`;

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

  state = {
    location: null,
    errorMessage: null,
    markers: []
  };

  // get permission for location
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      // @todo display this message to the user
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    } else {
      this.getLocation();
    }
  }

  getLocation = async () => {
    const { coords: location } = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  // add markers on map press
  onMapPress = e => {
    const { markers } = this.state;
    this.setState({
      markers: markers.concat({
        coordinate: e.nativeEvent.coordinate,
        key: markers.length + 1
      })
    });
  };

  // update marker coordinates on drag end
  onMarkerDragEnd = key => e => {
    const { markers } = this.state;
    this.setState({
      markers: markers.map(m => {
        if (m.key !== key) return m;
        return {
          ...m,
          coordinate: e.nativeEvent.coordinate
        };
      })
    });
  };

  render() {
    const { popToTop } = this.props.navigation;
    const { markers } = this.state;

    return (
      <SafeArea>
        <View style={styles.container}>
          <MapView
            mapType={Platform.OS == 'android' ? 'none' : 'standard'}
            showsUserLocation
            onPress={this.onMapPress}
            style={styles.mapStyle}>
            <MapView.UrlTile urlTemplate={urlTemplate} zIndex={1} />
            {markers.map(marker => (
              <Marker
                title={`Marker ${marker.key}`}
                key={marker.key}
                coordinate={marker.coordinate}
                stopPropagation
                draggable
                onDragEnd={this.onMarkerDragEnd(marker.key)}>
                <Callout>
                  <Text>Marker {marker.key}</Text>
                  {/* @todo
                    unfortunately onPress event on any child elements
                    don't get fired, find a solution
                    https://github.com/react-native-community/react-native-maps/issues/987 */}
                </Callout>
              </Marker>
            ))}
          </MapView>
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
