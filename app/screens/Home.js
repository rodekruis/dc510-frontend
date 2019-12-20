import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation: { navigate } }) => ({
    title: 'Home',
    headerRight: (
      <HeaderButtons>
        <Item title="Profile" onPress={() => navigate('Profile')} />
      </HeaderButtons>
    )
  });

  render() {
    const {
      data: { loading, allTasks }
    } = this.props;
    return (
      <View style={styles.container}>
        <Text>Tasks</Text>
        {loading && <Text>Loading...</Text>}
        {(allTasks || []).map(({ name, id }) => (
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
    allTasks(where: { assignee: { id: $userId }, completed: false }) {
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
    allTasks: PropTypes.array,
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
