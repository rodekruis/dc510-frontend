import {
  stackFactory,
  queueFactory,
  insetFactory
} from 'react-native-spacing-system';

import { spacing } from '../constants';

export const Stack = stackFactory(spacing);
export const Queue = queueFactory(spacing);
export const Inset = insetFactory(spacing);
