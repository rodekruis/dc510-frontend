import { gql } from 'apollo-boost';
import * as FileSystem from 'expo-file-system';
import { IMAGES_DIR } from './constants';
import upload from './upload';

export const AUTHENTICATED_USER = gql`
  query User {
    user @client {
      id
      name
      email
      token
    }
  }
`;

export const GET_OBSERVATIONS = gql`
  query {
    observations @client
  }
`;

export const initialState = {
  user: {
    __typename: 'User'
  },
  observations: []
};

export default {
  Mutation: {
    addObservations: (parent, { items }, { cache }) => {
      const query = GET_OBSERVATIONS;
      let existing = [];
      try {
        const d = cache.readQuery({ query });
        existing = d.observations;
      } catch (e) {
        console.log(e);
      }
      cache.writeQuery({
        query,
        data: { observations: existing.concat(items) }
      });
      return null;
    },

    // @todo
    // Find a way to show upload progress
    uploadImages: async (parent, _, { cache }) => {
      const query = GET_OBSERVATIONS;
      try {
        const { observations } = cache.readQuery({ query });

        // upload images of each observation
        for (const o of observations) {
          const image_urls = await Promise.all(o.images.map(upload));
          o.image_urls = image_urls;

          // after upload, delete the local file
          await Promise.all(o.images.map(removeFile));

          // update cache about the uploaded files
          cache.writeQuery({
            query,
            data: { observations }
          });
        }
      } catch (e) {
        console.log(e);
      }
      return null;
    }
  }
};

function removeFile(image) {
  return FileSystem.deleteAsync(IMAGES_DIR + '/' + image);
}
