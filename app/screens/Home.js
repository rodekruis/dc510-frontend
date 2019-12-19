import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  render() {
    const {
      data: { loading, allActivities }
    } = this.props;
    return (
      <View style={styles.container}>
        <Text>Tasks</Text>
        {loading && <Text>Loading...</Text>}
        {(allActivities || []).map(({ name, id }) => (
          <Text key={id}>
            {id} - {name}
          </Text>
        ))}
      </View>
    );
  }
}

const GET_ASSIGNED_TASKS = gql`
  query assignedTasks($userId: ID!) {
    user @client {
      id @export(as: "userId")
    }
    allActivities(where: { assignee: { id: $userId } }) {
      id
      name
    }
  }
`;

export default graphql(GET_ASSIGNED_TASKS, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(withNavigation(HomeScreen));

HomeScreen.propTypes = {
  data: PropTypes.shape({
    allActivities: PropTypes.array,
    loading: PropTypes.bool
  })
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
