import * as FileSystem from 'expo-file-system';

export const spacing = {
  atomic: 2,
  micro: 4,
  tiny: 6,
  small: 8,
  medium: 12,
  large: 16,
  huge: 24,
  massive: 32,
  macro: 48,
  galactic: 64
};

export const fontSize = {
  small: 8,
  medium: 16,
  large: 20,
  xlarge: 24
};

export const baseMap = 'http://c.tile.openstreetmap.org';

export const IMAGES_DIR = `${FileSystem.documentDirectory}images`;

export const isDev = __DEV__; // eslint-disable-line

// Environments
const env = {
  dev: 'http://localhost:3000',
  staging: 'https://dc510-staging.herokuapp.com'
};

export const API_HOST = isDev ? env.dev : env.staging;
