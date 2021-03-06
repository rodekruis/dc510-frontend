// Taken from https://github.com/Devnetik/react-native-slide-view/blob/master/lib/slideView.js
// May be better to use Overlay instead? https://react-native-elements.github.io/react-native-elements/docs/overlay.html

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

class SlideView extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.tapped = this.tapped.bind(this);

    var animatedOpacity = new Animated.Value(props.visible ? 1 : 0);
    animatedOpacity.addListener(value => {
      if (value.value === 0) {
        this.setState({ renderComponent: false });
      }
    });

    this.state = {
      renderComponent: props.visible,
      visible: props.visible,
      opacity: animatedOpacity,
      position: new Animated.Value(
        props.visible ? 0 : -this.props.expandedHeight
      )
    };
  }

  show() {
    this.setState({ renderComponent: true });
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1.0,
        friction: this.props.friction,
        duration: this.props.showDuration || this.props.duration
      }),
      Animated.timing(this.state.position, {
        toValue: 0,
        friction: this.props.friction,
        duration: this.props.showDuration || this.props.duration
      })
    ]).start(() => {
      if (this.props.onOpened) {
        this.props.onOpened();
      }
    });
  }

  hide() {
    if (this.props.closing) {
      this.props.closing();
    }

    Animated.parallel([
      Animated.timing(this.state.position, {
        toValue: -this.props.expandedHeight,
        friction: this.props.friction,
        duration: (this.props.hideDuration || this.props.duration) * 2
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        friction: this.props.friction,
        duration: this.props.hideDuration || this.props.duration
      })
    ]).start(() => {
      if (this.props.onClosed) {
        this.props.onClosed();
      }
    });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.state.visible === false && newProps.visible) {
      this.show();
    }
    if (this.state.visible === true && !newProps.visible) {
      this.hide();
    }
    if (this.state.visible !== newProps.visible) {
      this.setState({ visible: newProps.visible });
    }
  }

  tapped() {
    if (this.props.closeOnTap) {
      this.hide();
    }
  }

  render() {
    if (!this.state.renderComponent) return <View />;
    return (
      <Animated.ScrollView
        style={[
          styles.absolute,
          styles.container,
          { opacity: this.state.opacity }
        ]}>
        {this.props.children}
      </Animated.ScrollView>
    );
  }
}

SlideView.propTypes = {
  friction: PropTypes.number,
  duration: PropTypes.number,
  showDuration: PropTypes.number,
  hideDuration: PropTypes.number,
  expandedHeight: PropTypes.number,
  closeOnTap: PropTypes.bool,
  closing: PropTypes.func,
  onClosed: PropTypes.func,
  onOpened: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object,
  visible: PropTypes.bool
};

SlideView.defaultProps = {
  friction: 1,
  duration: 500,
  expandedHeight: Dimensions.get('window').height
};

export default SlideView;

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
});
