import {
  stackFactory,
  queueFactory,
  insetFactory
} from 'react-native-spacing-system';

import { spacing } from '../constants';

// https://github.com/hirokazutei/react-native-spacing-system

export const Stack = stackFactory(spacing);
export const Queue = queueFactory(spacing);
export const Inset = insetFactory(spacing);
