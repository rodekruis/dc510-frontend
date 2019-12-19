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

export const initialState = {
  user: {
    __typename: 'User'
  }
};

export default {};
