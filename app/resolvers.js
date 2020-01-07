import { gql } from 'apollo-boost';

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
    }
  }
};
