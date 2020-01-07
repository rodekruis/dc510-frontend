import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { IMAGES_DIR, spacing } from '../constants';

class Images extends React.Component {
  render() {
    const { items, imageStyle, style } = this.props;
    return (
      <ScrollView
        contentContainerStyle={style || styles.container}
        automaticallyAdjustContentInsets={false}
        horizontal>
        {items.map(image => (
          <Image
            key={image}
            source={{ uri: `${IMAGES_DIR}/${image}` }}
            style={[styles.image, imageStyle]}
          />
        ))}
      </ScrollView>
    );
  }
}

Images.propTypes = {
  items: PropTypes.array,
  imageStyle: PropTypes.object,
  style: PropTypes.object
};

Images.defaultProps = {
  items: []
};

export default Images;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginRight: spacing.medium
  },
  container: {}
});
