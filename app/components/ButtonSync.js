import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import compose from 'lodash.flowright';
import { Inset, Stack } from './Spacing';
import { GET_OBSERVATIONS } from '../resolvers';

const initialState = {
  loading: false,
  error: null
};

class ButtonSync extends React.Component {
  state = {
    ...initialState
  };

  sync = async () => {
    this.setState({ loading: true, error: null });
    try {
      // @todo
      // - Upload images before syncing observations
      // - Update local state after syncing
      // - Add images via createMediaItem mutation

      // transform it into type `ObservationsCreateInput`
      const observations = this.props.data.observations
        .map(o => ({
          ...o,
          task: { connect: { id: o.task } }, // TaskRelateToOneInput
          severity: { connect: { id: o.severity } }, // SeverityRelateToOneInput
          image_urls: {
            create: o.images.map(img => ({
              url: `https://cloud.rodekruis.nl/${img}`
            }))
          }
        }))
        .map(
          ({ key, images, ...o }) => ({ data: o }) // eslint-disable-line
        );
      console.log(observations);
      const { data } = await this.props.createObservations({
        variables: { observations }
      });
      if (data.error) throw data.error;
      this.setState({ ...initialState });
    } catch (e) {
      console.log(e);
      this.setState({
        error: 'Some error in syncing, let the developers know!',
        loading: false
      });
    }
  };

  render() {
    const { observations } = this.props.data;
    const { error, loading } = this.state;
    // @todo investigate
    // For some reason, observations evaluates to undefined when there's nothing
    // in the cache yet. From the documentation it looks like this should be
    // taken from what's available in `data` object of the cache.
    // We are providing an initial state observations: [], yet it's undefined.
    // Perhaps this is a bug in apollo client?
    const count = (observations || []).length;
    return (
      <Inset all="medium">
        {error && (
          <View>
            <Text style={styles.error}>{error}</Text>
            <Stack size="medium" />
          </View>
        )}
        <Button title="Sync" loading={loading} onPress={this.sync} />
        {count > 0 && (
          <View>
            <Stack size="medium" />
            <Text>You have {count} observations to sync</Text>
          </View>
        )}
      </Inset>
    );
  }
}

ButtonSync.propTypes = {
  data: PropTypes.object,
  createObservations: PropTypes.func
};

const CREATE_OBSERVATIONS = gql`
  mutation($observations: [ObservationsCreateInput]) {
    createObservations(data: $observations) {
      id
      severity {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(GET_OBSERVATIONS),
  graphql(CREATE_OBSERVATIONS, { name: 'createObservations' })
)(ButtonSync);

const styles = StyleSheet.create({
  error: {
    color: 'red'
  }
});
