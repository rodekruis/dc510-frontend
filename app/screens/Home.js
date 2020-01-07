import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ListItem } from 'react-native-elements';
import striptags from 'striptags';
import SafeArea from '../components/SafeArea';
import ButtonSync from '../components/ButtonSync';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation: { navigate } }) => ({
    title: 'Tasks',
    headerRight: (
      <HeaderButtons>
        <Item title="Profile" onPress={() => navigate('Profile')} />
      </HeaderButtons>
    )
  });

  render() {
    const {
      navigation: { navigate },
      data: { loading, allTasks, refetch }
    } = this.props;
    // only display tasks that are not completed
    const tasks = (allTasks || [])
      .filter(t => !t.completed)
      .map(item => ({ ...item, description: striptags(item.description) }));

    return (
      <SafeArea>
        <ButtonSync />
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          onRefresh={refetch}
          refreshing={loading}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={item.description}
              onPress={() => navigate('Task', { task: item })}
              bottomDivider
              chevron
            />
          )}
        />
      </SafeArea>
    );
  }
}

const GET_ASSIGNED_TASKS = gql`
  query assignedTasks($userId: ID!) {
    user @client {
      id @export(as: "userId")
    }
    allTasks(where: { assignee: { id: $userId } }) {
      id
      name
      description
    }
  }
`;

export default graphql(GET_ASSIGNED_TASKS, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(withNavigation(HomeScreen));

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }),
  data: PropTypes.shape({
    allTasks: PropTypes.array,
    loading: PropTypes.bool,
    refetch: PropTypes.func
  })
};
