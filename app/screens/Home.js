import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ListItem, Text } from 'react-native-elements';
import striptags from 'striptags';
import truncate from 'truncate';
import SafeArea from '../components/SafeArea';
import ButtonSync from '../components/ButtonSync';
import { Inset } from '../components/Spacing';

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
      data: { allTasks, refetch }
    } = this.props;
    const tasks = (allTasks || []).map(item => ({
      ...item,
      description: truncate(striptags(item.description), 80)
    }));

    return (
      <SafeArea>
        <ButtonSync />
        {!tasks.length && (
          <Inset all="large">
            <Text>
              There are no tasks assigned to you. Pull down to refresh.
            </Text>
          </Inset>
        )}
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          onRefresh={refetch}
          refreshing={false}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              titleStyle={styles.itemTitle}
              subtitle={item.description}
              subtitleStyle={styles.itemDescription}
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
    allTasks(where: { assignee: { id: $userId }, completed: false }) {
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

const styles = StyleSheet.create({
  itemTitle: {
    fontWeight: '600'
  },
  itemDescription: {
    marginTop: 5,
    color: '#777'
  }
});
