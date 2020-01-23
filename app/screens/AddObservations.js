import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Alert, BackHandler } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import SafeArea from '../components/SafeArea';
import SlideView from '../components/SlideView';
import { spacing, IMAGES_DIR } from '../constants';
import { Inset, Stack } from '../components/Spacing';
import Images from '../components/Images';
import theme from '../theme';
import { mbtiles } from './Task';

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
// const urlTemplate = `${baseMap}/{z}/{x}/{y}.png`;

// We use delta's instead of zoom levels for the map
// https://github.com/react-native-community/react-native-maps/blob/master/example/examples/DisplayLatLng.js#L12-L18
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922; // don't really know how this came to be!
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MIN_ZOOM_LEVEL = 13;
const MAX_ZOOM_LEVEL = 20;

function Confirm(callback) {
  return Alert.alert(
    'Are you sure you want to cancel?',
    'Cancelling will discard any observations you have made so far',
    [
      {
        text: 'No',
        style: 'cancel'
      },
      { text: 'Yes', onPress: () => callback() }
    ],
    { cancelable: false }
  );
}

class AddObservationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  static navigationOptions = ({
    navigation: {
      goBack,
      state: { params }
    }
  }) => ({
    title: params.task.name,
    headerLeft: null,
    headerRight: (
      <HeaderButtons>
        <Item title="Cancel" onPress={() => Confirm(goBack)} />
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage:
          'Permission to access location was denied. Please go to your phone settings and give permission in order to add observations.'
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    Confirm(this.props.navigation.goBack);
    return true;
  };

  getCurrentLocation = async () => {
    const { coords } = await Location.getCurrentPositionAsync({});
    return coords;
  };

  getLocationInfo = async coords => {
    const current = await this.getCurrentLocation();
    return {
      marked_lat: coords.latitude,
      marked_lng: coords.longitude,
      lat: current.latitude,
      lng: current.longitude
    };
  };

  // add markers on map press
  onMapPress = async e => {
    const { markers } = this.state;
    const { params } = this.props.navigation.state;
    const nextKey = !markers.length
      ? 1
      : Math.max(...markers.map(m => m.key)) + 1;
    const locInfo = await this.getLocationInfo(e.nativeEvent.coordinate);
    this.setState({
      markers: markers.concat({
        ...locInfo,
        key: nextKey,
        severity: 1, // set default severity to 'none'
        images: [],
        task: params.task.id,
        recordedAt: new Date().toISOString()
      })
    });
  };

  // update marker coordinates on drag end
  onMarkerDragEnd = key => async e => {
    const { markers } = this.state;
    const locInfo = await this.getLocationInfo(e.nativeEvent.coordinate);
    this.setState({
      markers: markers.map(m => {
        if (m.key !== key) return m;
        return {
          ...m,
          ...locInfo
        };
      })
    });
  };

  openMenu = activeMarker => () => this.setState({ activeMarker });

  unsetActiveMarker = () => this.setState({ activeMarker: null });

  removeMarker = async () => {
    const { markers, activeMarker } = this.state;
    // remove images if there are any
    if (activeMarker.images.length) {
      await Promise.all(
        activeMarker.images.map(image =>
          FileSystem.deleteAsync(IMAGES_DIR + '/' + image)
        )
      );
    }
    this.setState({
      markers: markers.filter(m => m.key !== activeMarker.key),
      activeMarker: null
    });
  };

  setSeverity = index => {
    const { markers, activeMarker } = this.state;
    const severity = index + 1;
    // make sure that severity is updated in both
    // list - markers
    // detail - activeMarker
    this.setState({
      activeMarker: { ...activeMarker, severity },
      markers: markers.map(m => {
        if (m.key === activeMarker.key) m.severity = severity;
        return m;
      })
    });
  };

  // update images in both list and detail
  onImageAdd = image => {
    const { markers, activeMarker } = this.state;
    const images = activeMarker.images.concat(image);
    this.setState({
      activeMarker: { ...activeMarker, images },
      markers: markers.map(m => {
        if (m.key === activeMarker.key) m.images = images;
        return m;
      })
    });
  };

  // @todo
  // add a way to remove each image individually
  addPhotos = () => {
    const {
      navigate,
      state: { params }
    } = this.props.navigation;
    navigate('Camera', {
      activeMarker: this.state.activeMarker,
      task: params.task,
      onImageAdd: this.onImageAdd
    });
  };

  addObservations = async () => {
    const { popToTop } = this.props.navigation;
    await this.props.addObservations({
      variables: { items: this.state.markers }
    });
    popToTop(); // navigate back
  };

  onLayout = async () => {
    const location = await this.getCurrentLocation();
    this.map.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    });
    // zoom level workaround
    // https://github.com/react-native-community/react-native-maps/issues/2400
    this.setState({ location, minZoomLevel: MIN_ZOOM_LEVEL });
  };

  render() {
    const { markers, activeMarker, errorMessage } = this.state;
    const { task } = this.props.navigation.state.params;

    // Disable finish button until all severities are set
    const cannotFinish = markers.map(m => m.severity).includes(1);

    return (
      <SafeArea>
        <View style={styles.container}>
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          <MapView
            // mapType={Platform.OS == 'android' ? 'none' : 'standard'}
            showsUserLocation
            ref={this.map}
            onPress={this.onMapPress}
            minZoomLevel={this.state.minZoomLevel}
            maxZoomLevel={MAX_ZOOM_LEVEL}
            onLayout={this.onLayout}
            style={styles.mapStyle}>
            {task.mbtilesUrl.length > 0 && (
              <MapView.MbTile pathTemplate={mbtiles(task)} />
            )}
            {markers.map(marker => (
              <Marker
                title={`Marker ${marker.key}`}
                key={marker.key}
                coordinate={{
                  latitude: marker.marked_lat,
                  longitude: marker.marked_lng
                }}
                stopPropagation
                image={SEVERITY_ICON[marker.severity]}
                centerOffset={{ x: 0, y: -16 }} // ios
                anchor={{ x: 0.5, y: 1 }} // android
                draggable
                onPress={this.openMenu(marker)}
                onDragEnd={this.onMarkerDragEnd(marker.key)}
              />
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
              <Stack size="medium" />
              <Images items={(activeMarker && activeMarker.images) || []} />
            </Inset>
          </SlideView>
        </View>
      </SafeArea>
    );
  }
}

const ADD_OBSERVATIONS = gql`
  mutation($items: [Observation]) {
    addObservations(items: $items) @client
  }
`;

export default graphql(ADD_OBSERVATIONS, {
  name: 'addObservations'
})(withNavigation(AddObservationsScreen));

AddObservationsScreen.propTypes = {
  navigation: PropTypes.object,
  addObservations: PropTypes.func
};

export const buttonContainerStyle = {
  marginVertical: spacing.massive,
  paddingLeft: spacing.massive,
  paddingRight: spacing.massive,
  width
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
  error: {
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.error,
    zIndex: 1,
    width,
    top: 0,
    position: 'absolute',
    padding: spacing.medium,
    color: 'white'
  },
  buttonContainer: buttonContainerStyle,
  severityText: {
    color: 'white'
  }
});
