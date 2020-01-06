import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import MapView, { Marker, Callout } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import SafeArea from '../components/SafeArea';
import SlideView from '../components/SlideView';
import { spacing, baseMap } from '../constants';
import { Inset, Stack } from '../components/Spacing';

// @todo get this from api
const SEVERITIES = ['None', 'Mild', 'High', 'Severe'];
// Here keys 1-4 are ids of severities
const SEVERITY_ICON = {
  1: require('../../assets/marker-severity-none.png'),
  2: require('../../assets/marker-severity-mild.png'),
  3: require('../../assets/marker-severity-high.png'),
  4: require('../../assets/marker-severity-severe.png')
};

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
    markers: [],
    activeMarker: null
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
    const nextKey = !markers.length
      ? 1
      : Math.max(...markers.map(m => m.key)) + 1;
    this.setState({
      markers: markers.concat({
        coordinate: e.nativeEvent.coordinate,
        key: nextKey,
        severity: 1 // set default severity to 'none'
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

  openMenu = activeMarker => () => this.setState({ activeMarker });

  unsetActiveMarker = () => this.setState({ activeMarker: null });

  removeMarker = () => {
    const { markers, activeMarker } = this.state;
    this.setState({
      markers: markers.filter(m => m.key !== activeMarker.key),
      activeMarker: null
    });
  };

  setSeverity = index => {
    const { markers, activeMarker } = this.state;
    const severity = index + 1;
    this.setState({
      activeMarker: { ...activeMarker, severity },
      markers: markers.map(m => {
        if (m.key === activeMarker.key) m.severity = severity;
        return m;
      })
    });
  };

  addPhotos = () => {
    // @todo
    // open camera, take pictures, add them back to state
  };

  addObservations = () => {
    const { popToTop } = this.props.navigation;
    // @todo
    // add mutation to store it in the client cache
    popToTop(); // navigate back
  };

  render() {
    const { markers, activeMarker } = this.state;
    // Disable finish button until all severities are set
    const cannotFinish = markers.map(m => m.severity).includes(1);

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
                image={SEVERITY_ICON[marker.severity]}
                centerOffset={{ x: 0, y: -16 }} // ios
                anchor={{ x: 0, y: -16 }} // android
                draggable
                onDragEnd={this.onMarkerDragEnd(marker.key)}>
                <Callout onPress={this.openMenu(marker)}>
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
            <Button
              title="Finish"
              type="solid"
              disabled={cannotFinish}
              onPress={this.addObservations}
            />
          </View>
          <SlideView
            visible={!!activeMarker}
            duration={100}
            onClosed={this.unsetActiveMarker}>
            <Inset all="huge">
              <Text h3 style={styles.severityText}>
                Severity
              </Text>
              <Stack size="medium" />
              <SegmentedControlTab
                values={SEVERITIES}
                selectedIndex={(activeMarker && activeMarker.severity - 1) || 0}
                onTabPress={this.setSeverity}
              />
              <Stack size="medium" />
              <Button title="Add photos" onPress={this.addPhotos} />
              <Stack size="medium" />
              <Button title="Remove marker" onPress={this.removeMarker} />
              <Stack size="medium" />
              <Button
                title="Done"
                onPress={this.unsetActiveMarker}
                // Disable the button until severity is set
                disabled={activeMarker && activeMarker.severity === 1}
              />
            </Inset>
          </SlideView>
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
  },
  severityText: {
    color: 'white'
  }
});
