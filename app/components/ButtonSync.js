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
  error: null,
  uploading: false
};

class ButtonSync extends React.Component {
  state = {
    ...initialState
  };

  sync = async () => {
    this.setState({ loading: true, error: null, uploading: true });
    try {
      // Uploads `images` from the FileSystem to the cloud.
      // After upload, url of the image is returned which is stored in
      // `images_urls`.
      await this.props.uploadImages();
      this.setState({ uploading: false });

      // transform it into type ObservationsCreateInput
      const observations = this.props.data.observations
        .map(o => ({
          ...o,
          task: { connect: { id: o.task } }, // type TaskRelateToOneInput
          severity: { connect: { id: o.severity } }, // type SeverityRelateToOneInput
          image_urls: {
            create: o.image_urls.map(url => ({ url }))
          }
        }))
        .map(
          ({ key, images, ...o }) => ({ data: o }) // eslint-disable-line
        );

      const { data } = await this.props.createObservations({
        variables: { observations }
      });
      if (data.error) throw data.error;
      this.setState({ ...initialState });
    } catch (e) {
      console.log(e);
      this.setState({
        ...initialState,
        error: 'Some error in syncing, let the developers know!'
      });
    }
  };

  render() {
    const { observations } = this.props.data;
    const { error, loading, uploading } = this.state;
    // @todo investigate
    // For some reason, observations evaluates to undefined when there's nothing
    // in the cache yet. From the documentation it looks like this should be
    // taken from what's available in `data` object of the cache.
    // We are providing an initial state observations: [], yet it's undefined.
    // Perhaps this is a bug in apollo client?
    const count = (observations || []).length;
    if (!count) return null;
    return (
      <Inset all="medium">
        {error && (
          <View>
            <Text style={styles.error}>{error}</Text>
            <Stack size="medium" />
          </View>
        )}
        <Button
          title="Sync"
          loading={loading || uploading}
          onPress={this.sync}
        />
        <Stack size="medium" />
        <Text>You have {count} observations to sync</Text>
      </Inset>
    );
  }
}

ButtonSync.propTypes = {
  data: PropTypes.object,
  createObservations: PropTypes.func,
  uploadImages: PropTypes.func
};

const CREATE_OBSERVATIONS = gql`
  mutation($observations: [ObservationsCreateInput]) {
    createObservations(data: $observations) {
      id
      task {
        id
      }
    }
  }
`;

const UPLOAD_IMAGES = gql`
  mutation {
    uploadImages @client
  }
`;

export default compose(
  graphql(GET_OBSERVATIONS),
  graphql(UPLOAD_IMAGES, {
    name: 'uploadImages'
  }),
  graphql(CREATE_OBSERVATIONS, {
    name: 'createObservations',
    options: {
      // empty observations after syncing
      update: proxy => {
        const data = { observations: [] };
        proxy.writeQuery({ query: GET_OBSERVATIONS, data });
      }
      // @todo may be we can store this in stats or something
      // so that we can give progress indicator to the user?
    }
  })
)(ButtonSync);

const styles = StyleSheet.create({
  error: {
    color: 'red'
  }
});
